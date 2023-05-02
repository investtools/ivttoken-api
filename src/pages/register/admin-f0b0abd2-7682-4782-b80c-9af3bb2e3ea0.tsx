import { api } from "~/utils/api"
import LoadingComponent from "~/styles/styledComponents/utils/loading"
import PageHeader from "~/styles/styledComponents/utils/pageHeader"
import FormSentModal from "~/styles/styledComponents/modals/formSentModal"
import IncompleteFieldsModal from "~/styles/styledComponents/modals/incompleteFieldsModal"
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Fragment, useState } from 'react'
import SendIcon from "~/styles/styledComponents/icons/sendIcon"
import HomeButton from "~/styles/styledComponents/utils/homeButton"
import ErrorMessageComponent from "~/styles/styledComponents/utils/errorMessage"
import { Translate } from "translate"
import { useRouter } from "next/router"
import { Role } from "@prisma/client"
import { selectField } from "~/styles/styledComponents/utils/selectFieldForms"

const entity = [
  { entity: "Select Your Team" },
  { entity: "InvestTools" },
  { entity: "Giga" },
  { entity: "Unicef" },
  { entity: "Government" }
]

const RegisterAdmin: React.FC = () => {
  const router = useRouter()
  const locale = router.locale === undefined ? 'en' : router.locale
  const t = new Translate(locale)

  const [name, setName] = useState('')
  const [selected, setSelected] = useState(entity[0])
  const [incompleteFieldsModalIsOpen, setIncompleteFieldsModalIsOpen] = useState(false)
  const [sentFormModalIsOpen, setSentFormModalIsOpen] = useState(false)

  const userHasAccount = api.generalLogin.getUserRole.useQuery()
  const { mutate, isLoading } = api.admin.registerAdmin.useMutation()
  const userAuthorizedRole = api.generalLogin.getAuthorizedRole.useQuery()

  if (userAuthorizedRole.data !== Role.ADMIN) return <ErrorMessageComponent locale={locale} />
  if (isLoading) return <LoadingComponent locale={locale} />

  const handleSubmit = (name: string, selected: { entity: string } | undefined) => {
    if (name && selected && selected.entity !== "Select Your Team") {
      try {
        const entity = String(selected['entity'])
        mutate({ name, entity })
        setSentFormModalIsOpen(true)
      } catch (error) {
        console.log(error)
        return null
      }
    } else {
      setIncompleteFieldsModalIsOpen(true);
    }
  }

  return (
    <>
      <PageHeader title={t.t("Register Admin")} />
      {sentFormModalIsOpen && (
        <FormSentModal closeModal={() => setSentFormModalIsOpen(false)} locale={locale} />
      )}
      {incompleteFieldsModalIsOpen && (
        <IncompleteFieldsModal closeModal={() => setIncompleteFieldsModalIsOpen(false)} locale={locale} />
      )}
      {userHasAccount.data ? (
        <ErrorMessageComponent locale={locale} />
      ) : (
        <div className="p-8">
          <HomeButton />
          <div>
            <div className="flex justify-center items-top p-5">
              <form className="bg-white p-10 rounded-lg shadow-md">
                <h1 className="text-center text-2xl font-bold mb-8 text-gray-900">{t.t("Register Your Credentials")}</h1>
                <div className="flex flex-col mb-4">
                  <label htmlFor="name" className="mb-2 font-bold text-lg text-gray-900">
                    {t.t("Name")}:
                  </label>
                  <input
                    placeholder="John Doe"
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={selectField}
                  />
                </div>
                <Listbox value={selected} onChange={(e) => setSelected(e)}>
                  <div className="relative mt-1 mb-4">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-ivtcolor sm:text-sm">
                      <span className="text-gray-900 block truncate">{selected?.entity === undefined ? selected?.entity : t.t(selected?.entity)}</span>
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
                      <Listbox.Options className=" text-gray-900 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {entity.map((entity, entityIdx) => (
                          <Listbox.Option
                            key={entityIdx}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-ivtcolor text-white' : 'text-gray-900'
                              }`
                            }
                            value={entity}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                    }`}
                                >
                                  {t.t(entity.entity)}
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
                    onClick={(event) => {
                      event.preventDefault()
                      handleSubmit(name, selected);
                    }}
                    className="text-white font-bold py-2 px-4 rounded-full gradient-animation"
                  >
                    <span className="flex items-center">
                      {t.t("Register Admin")}
                      <SendIcon />
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RegisterAdmin