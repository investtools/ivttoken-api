import { api } from '~/utils/api'
import { useEffect, useState } from 'react'
import PageHeader from '~/styles/styledComponents/utils/pageHeader'
import HomeButton from '~/styles/styledComponents/utils/homeButton'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'
import SendIcon from '~/styles/styledComponents/icons/sendIcon'
import IncompleteFieldsModal from '~/styles/styledComponents/modals/incompleteFieldsModal'
import FormSentModal from '~/styles/styledComponents/modals/formSentModal'
import ErrorMessageComponent from '~/styles/styledComponents/utils/errorMessage'
import LoadingComponent from '~/styles/styledComponents/utils/loading'
import { getMaxDays } from '~/utils/functions/schoolAdminFunctions'
import { useRouter } from 'next/router'
import { Translate } from 'translate'
import SchoolHasNoProviderModal from '~/styles/styledComponents/modals/schoolHasNoProviderModal'
import { selectField } from '~/styles/styledComponents/utils/selectFieldForms'
import { getFullYear } from '~/utils/functions/ispFunctions'
import { mapMonthsEnglish } from '~/utils/functions/schoolAdminFunctions'
import DuplicatedReportModal from '~/styles/styledComponents/modals/duplicatedReportModal'

const months = [
  { name: 'Month', value: '' },
  { name: 'January', value: '01' },
  { name: 'February', value: '02' },
  { name: 'March', value: '03' },
  { name: 'April', value: '04' },
  { name: 'May', value: '05' },
  { name: 'June', value: '06' },
  { name: 'July', value: '07' },
  { name: 'August', value: '08' },
  { name: 'September', value: '09' },
  { name: 'October', value: '10' },
  { name: 'November', value: '11' },
  { name: 'December', value: '12' },
]

const connectionQuality = [
  { quality: 'Select connection quality' },
  { quality: 'Low' },
  { quality: 'Medium' },
  { quality: 'High' },
]

const ConnectivityReport: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(months[0])
  const [noInternetDays, setDaysWithoutInternet] = useState('')
  const [averageSpeed, setAverageSpeed] = useState('')
  const [selected, setSelected] = useState(connectionQuality[0])
  const [incompleteFieldsModalIsOpen, setIncompleteFieldsModalIsOpen] = useState(false)
  const [sentFormModalIsOpen, setSentFormModalIsOpen] = useState(false)
  const [duplicatedReportModalIsOpen, setDuplicatedReportModalIsOpen] = useState(false)
  const [schoolHasNoProviderModalIsOpen, setSchoolHasNoProviderModalIsOpen] = useState(false)

  const router = useRouter()
  const locale = router.locale === undefined ? 'en' : router.locale
  const t = new Translate(locale)

  useEffect(() => {
    const maxDays = getMaxDays(selectedMonth?.name)
    const currentNoInternetDays = parseInt(noInternetDays)
    if (currentNoInternetDays > maxDays) {
      setDaysWithoutInternet(maxDays.toString())
    }
  }, [noInternetDays, selectedMonth])

  const isSchoolAdmin = api.schoolAdmin.isSchoolAdmin.useQuery()
  const schoolHasProvider = api.schoolAdmin.schoolHasProvider.useQuery()
  const { mutate } = api.schoolAdmin.createConnectivityReport.useMutation()
  const schoolReports = api.schoolAdmin.getMyConnectivityReports.useQuery()

  if (isSchoolAdmin.data == false) return <ErrorMessageComponent locale={locale} />
  if (isSchoolAdmin.isLoading) return <LoadingComponent locale={locale} />

  function isReportDuplicated(selectedMonth: { name: string; value: string }) {
    if (selectedMonth.name) {
      const allReports = schoolReports.data
      if (allReports === undefined) return false

      const thisYearReports = []
      for (const report of allReports) {
        const reportFullYear = Number(getFullYear(report.createdAt))
        if (reportFullYear === new Date().getFullYear()) {
          thisYearReports.push(report.month)
        }
      }

      const existingReports = []
      for (const month of thisYearReports) {
        if (month === mapMonthsEnglish(selectedMonth.name)) {
          existingReports.push(month)
        }
      }

      return existingReports.length > 0 ? true : false
    }
  }

  const handleSubmit = (selectedMonth: { name: string; value: string }, noInternetDays: string, selected: { quality: string } | undefined, averageSpeed: string) => {
    if (schoolHasProvider.data === false) return setSchoolHasNoProviderModalIsOpen(true)
    if (isReportDuplicated(selectedMonth)) return setDuplicatedReportModalIsOpen(true)

    if (averageSpeed && selectedMonth.value && noInternetDays && selected && selected.quality !== 'Select connection quality' && selectedMonth.name !== "Month") {
      const connectionQuality = String(selected.quality)

      mutate({ month: selectedMonth.name, noInternetDays, connectionQuality: connectionQuality, averageSpeed })
      setSentFormModalIsOpen(true)
    } else {
      setIncompleteFieldsModalIsOpen(true)
    }
  }

  return (
    <>
      <PageHeader title={t.t("Connectivity Report")} />
      {incompleteFieldsModalIsOpen && (
        <IncompleteFieldsModal closeModal={() => setIncompleteFieldsModalIsOpen(false)} locale={locale} />
      )}
      {sentFormModalIsOpen && (
        <FormSentModal closeModal={() => setSentFormModalIsOpen(false)} locale={locale} />
      )}
      {schoolHasNoProviderModalIsOpen && (
        <SchoolHasNoProviderModal closeModal={() => setSchoolHasNoProviderModalIsOpen(false)} locale={locale} />
      )}
      {duplicatedReportModalIsOpen && (
        <DuplicatedReportModal closeModal={() => setDuplicatedReportModalIsOpen(false)} locale={locale} />
      )}
      <div className="p-8">
        <HomeButton />
        <div>
          <div className="flex justify-center items-top p-5">
            <form className="bg-white p-10 rounded-lg shadow-md">
              <h1 className="text-center text-2xl font-bold mb-8 text-gray-900">{t.t("Report Connection")}</h1>
              <div className="flex flex-col mb-4">
                <label htmlFor="month" className="mb-2 font-bold text-lg text-gray-900">
                  {t.t("Month")}:
                </label>
                <Listbox value={selectedMonth} onChange={(e) => setSelectedMonth(e)}>
                  <div className="relative mt-1 mb-4">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-ivtcolor sm:text-sm">
                      <span className="text-gray-900 block truncate">{selectedMonth?.name != undefined ? t.t(selectedMonth.name) : selectedMonth?.name}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="text-gray-900 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">

                        {months.map((month, monthIdx) => (
                          <Listbox.Option
                            key={monthIdx}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-ivtcolor text-white' : 'text-gray-900'
                              }`
                            }
                            value={month}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                    }`}
                                >
                                  {t.t(month.name)}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ivtcolor2">
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="noInternetDays" className="mb-2 font-bold text-lg text-gray-900">
                  {t.t("Days Without Internet")}:
                </label>
                <input
                  placeholder="5"
                  type="number"
                  id="noInternetDays"
                  value={noInternetDays}
                  onChange={(e) => {
                    const inputValue = parseInt(e.target.value)
                    if (inputValue >= 0 && inputValue <= 31) {
                      setDaysWithoutInternet(inputValue.toString())
                    }
                  }}
                  required
                  className={selectField}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="averageSpeed" className="mb-2 font-bold text-lg text-gray-900">
                  {t.t("Average Speed Mb/s")}:
                </label>
                <input
                  placeholder="300"
                  type="number"
                  id="averageSpeed"
                  value={averageSpeed}
                  onChange={(e) => {
                    const inputValue = parseInt(e.target.value)
                    if (inputValue >= 0 && inputValue <= 500) {
                      setAverageSpeed(inputValue.toString())
                    }
                  }}
                  required
                  className={selectField}
                />
              </div>
              <label htmlFor="month" className="mb-2 font-bold text-lg text-gray-900">
                {t.t("Connection Quality")}:
              </label>
              <Listbox value={selected} onChange={(e) => setSelected(e)}>
                <div className="relative mt-1 mb-4">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-ivtcolor sm:text-sm">
                    <span className="text-gray-900 block truncate">{selected?.quality != undefined ? t.t(selected.quality) : selected?.quality}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="text-gray-900 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {connectionQuality.map((quality, qualityIdx) => (
                        <Listbox.Option
                          key={qualityIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-ivtcolor text-white' : 'text-gray-900'
                            }`
                          }
                          value={quality}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                  }`}
                              >
                                {t.t(quality.quality)}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ivtcolor2">
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedMonth?.value != undefined) {
                      handleSubmit(selectedMonth, noInternetDays, selected, averageSpeed)
                    }
                  }}
                  className="text-white font-bold py-2 px-4 rounded-full gradient-animation"
                >
                  <span className="flex items-center">
                    {t.t("Send Report")}
                    <SendIcon />
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConnectivityReport

