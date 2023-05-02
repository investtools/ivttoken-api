import { api } from "~/utils/api"
import HomeButton from "../../../styles/styledComponents/utils/homeButton"
import { Listbox } from '@headlessui/react'
import LoadingComponent from "~/styles/styledComponents/utils/loading"
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import PageHeader from "~/styles/styledComponents/utils/pageHeader"
import FormSentModal from "~/styles/styledComponents/modals/formSentModal"
import IncompleteFieldsModal from "~/styles/styledComponents/modals/incompleteFieldsModal"
import SendIcon from "~/styles/styledComponents/icons/sendIcon"
import ErrorMessageComponent from "~/styles/styledComponents/utils/errorMessage"
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from "next/router"
import { Translate } from "translate"
import InputMask from 'react-input-mask'
import { validateEmail, type ViaCEPAddress } from "~/utils/functions/adminFunctions"
import AddNumberModal from "~/styles/styledComponents/modals/addNumberModal"
import InvalidEmailModal from "~/styles/styledComponents/modals/invalidEmailModal"
import { selectField } from "~/styles/styledComponents/utils/selectFieldForms"

function CreateSchool() {
  const [name, setName] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [address, setAddress] = useState('')
  const [number, setNumber] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [inepCode, setInepCode] = useState('')
  const [email, setEmail] = useState('')
  const [administrator, setAdministrator] = useState('')
  const [incompleteFieldsModalIsOpen, setIncompleteFieldsModalIsOpen] = useState(false)
  const [invalidEmailIsOpen, setInvalidEmailIsOpen] = useState(false)
  const [addNumberModalIsOpen, setAddNumberModalIsOpen] = useState(false)
  const [sentFormModalIsOpen, setSentFormModalIsOpen] = useState(false)
  const [optionsWidth, setOptionsWidth] = useState(0)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const router = useRouter()
  const locale = router.locale === undefined ? 'en' : router.locale
  const t = new Translate(locale)

  const { mutate, isLoading } = api.admin.createSchool.useMutation()
  useEffect(() => {
    if (buttonRef.current) {
      setOptionsWidth(buttonRef.current.getBoundingClientRect().width);
    }
  }, [administrator])

  const isAdmin = api.admin.isAdmin.useQuery()
  if (isAdmin.data == false) return <ErrorMessageComponent locale={locale} />
  if (isAdmin.isLoading) return <LoadingComponent locale={locale} />

  if (isLoading) return <LoadingComponent locale={locale} />

  const handleSubmit = (name: string, state: string, city: string, zipCode: string, address: string, number: number, cnpj: string, inepCode: string, email: string, administrator: string) => {
    if (name && state && city && zipCode && address && cnpj && inepCode && email && administrator && number) {
      if (validateEmail(email)) {
        administrator = String(administrator)
        mutate({ name, state, city, zipCode, address: address + ", " + String(number), cnpj, inepCode, email, administrator })
        setSentFormModalIsOpen(true)
      } else {
        setInvalidEmailIsOpen(true)
      }
    } else {
      setIncompleteFieldsModalIsOpen(true)
    }
  }

  const fetchAddress = async (zipCode: string) => {
    if (zipCode.length === 9) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`)
        const data = await response.json() as ViaCEPAddress

        if (!data.erro) {
          setAddress(data.logradouro)
          setCity(data.localidade)
          setState(data.uf)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <>
      {sentFormModalIsOpen && (
        <FormSentModal closeModal={() => setSentFormModalIsOpen(false)} locale={locale} />
      )}
      {incompleteFieldsModalIsOpen && (
        <IncompleteFieldsModal closeModal={() => setIncompleteFieldsModalIsOpen(false)} locale={locale} />
      )}
      {addNumberModalIsOpen && (
        <AddNumberModal closeModal={() => setAddNumberModalIsOpen(false)} locale={locale} />
      )}
      {invalidEmailIsOpen && (
        <InvalidEmailModal closeModal={() => setInvalidEmailIsOpen(false)} locale={locale} />
      )}
      <PageHeader title={t.t("Create School")} />
      <div className="p-8">
        <HomeButton />
        <div className="flex justify-center items-top p-5">
          <form className="bg-white p-10 rounded-lg shadow-md">
            <h1 className="text-center text-2xl font-bold mb-8 text-gray-900">{t.t("Create New School")}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col mb-4">
                <label htmlFor="name" className="mb-2 font-bold text-lg text-gray-900">
                  {t.t("School's Name")}:
                </label>
                <input
                  placeholder="E.E. João e Maria"
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={selectField}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="zipCode" className="mb-2 font-bold text-lg text-gray-900">
                  {t.t("Zip Code")}:
                </label>
                <InputMask
                  mask="99999-999"
                  placeholder="00000-000"
                  type="text"
                  id="zipCode"
                  value={zipCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setZipCode(e.target.value);
                    void fetchAddress(e.target.value)
                  }}
                  required
                  className={selectField}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="state" className="mb-2 font-bold text-lg text-gray-900">
                  {t.t("State")}:
                </label>
                <input
                  placeholder="São Paulo"
                  type="text"
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  className={selectField}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="city" className="mb-2 font-bold text-lg text-gray-900">
                  {t.t("City")}:
                </label>
                <input
                  placeholder="São Paulo"
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className={selectField}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="address" className="mb-2 font-bold text-lg text-gray-900">
                  {t.t("Address")}:
                </label>
                <input
                  placeholder="Rua A"
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className={selectField}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="number" className="mb-2 font-bold text-lg text-gray-900">
                  {t.t("Number")}:
                </label>
                <input
                  placeholder="1965"
                  type="number"
                  id="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  required
                  className={selectField}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="cnpj" className="mb-2 font-bold text-lg text-gray-900">
                  {t.t("Cnpj")}:
                </label>
                <InputMask
                  mask="99.999.999/9999-99"
                  placeholder="12.345.678/0001-00"
                  type="text"
                  id="cnpj"
                  value={cnpj}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCnpj(e.target.value)}
                  required
                  className={selectField}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="inepCode" className="mb-2 font-bold text-lg text-gray-900">
                  {t.t("Inep Code")}:
                </label>
                <InputMask
                  mask="99999999"
                  placeholder="12345678"
                  type="text"
                  id="inepCode"
                  value={inepCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInepCode(e.target.value)}
                  required
                  className={selectField}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="email" className="mb-2 font-bold text-lg text-gray-900">
                  {t.t("E-Mail")}:
                </label>
                <input
                  placeholder="email@domain.com"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={selectField}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="administrator"
                  className="mb-2 font-bold text-lg text-gray-900"
                >
                  {t.t("Administrator")}:
                </label>
                <Listbox value={administrator} onChange={(e) => setAdministrator(e.valueOf())}>
                  <Listbox.Button ref={buttonRef} className="h-full relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-ivtcolor sm:text-sm">
                    <span className="block truncate text-gray-900">
                      {administrator || t.t("Select an Administrator")}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronUpDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute py-1 mt-1 overflow-auto text-base text-gray-900 bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" style={{ width: optionsWidth }}>
                    <Listbox.Option
                      className={({ active }) =>
                        `${active ? "text-white bg-ivtcolor" : "text-gray-900"
                        } cursor-default select-none relative py-2 pl-10 pr-4`}
                      value={t.t("State")}
                    >
                      {t.t("State")}
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-ivtcolor text-white' : 'text-gray-900'
                        }`
                      }
                      value={t.t("Municipality")}
                    >
                      {t.t("Municipality")}
                    </Listbox.Option>
                  </Listbox.Options>
                </Listbox>
              </div>
            </div>
            <div className="flex items-center justify-center mt-6">
                <button
                  onClick={(event) => {
                    event.preventDefault()
                    handleSubmit(
                      name,
                      state,
                      city,
                      zipCode,
                      address,
                      Number(number),
                      cnpj,
                      inepCode,
                      email,
                      administrator
                    )
                  }}
                  type="submit"
                  style={{ marginBottom: "0.5rem" }}
                  className="w-1/2 border border-transparent shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ivtcolor text-white font-bold py-2 px-4 rounded-full gradient-animation"
                >
                  <span className="flex items-center justify-center">
                    {t.t("Create School")}
                    <SendIcon />
                  </span>
                </button>
              </div>
          </form>
        </div >
      </div >
    </>
  )
}

export default CreateSchool
