import { api } from "~/utils/api"
import LoadingComponent from "~/styles/styledComponents/utils/loading"
import PageHeader from "~/styles/styledComponents/utils/pageHeader"
import FormSentModal from "~/styles/styledComponents/modals/formSentModal"
import IncompleteFieldsModal from "~/styles/styledComponents/modals/incompleteFieldsModal"
import { useState } from 'react'
import SendIcon from "~/styles/styledComponents/icons/sendIcon"
import HomeButton from "~/styles/styledComponents/utils/homeButton"
import ErrorMessageComponent from "~/styles/styledComponents/utils/errorMessage"
import { useRouter } from "next/router"
import { Translate } from "translate"
import { Role } from "@prisma/client"
import InputMask from 'react-input-mask'
import { selectField } from "~/styles/styledComponents/utils/selectFieldForms"

const RegisterSchoolAdmin: React.FC = () => {
  const router = useRouter()
  const locale = router.locale === undefined ? 'en' : router.locale
  const t = new Translate(locale)

  const [name, setName] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [incompleteFieldsModalIsOpen, setIncompleteFieldsModalIsOpen] = useState(false)
  const [fetchReports, setFetchReports] = useState(false)
  const [sentFormModalIsOpen, setSentFormModalIsOpen] = useState(false)

  const userHasAccount = api.generalLogin.getUserRole.useQuery()
  const userAuthorizedRole = api.generalLogin.getAuthorizedRole.useQuery()
  const { mutate, isLoading } = api.schoolAdmin.registerSchoolAdmin.useMutation()
  const doesSchoolExist = api.schools.doesSchoolExist.useQuery({ cnpj }, { enabled: fetchReports })

  if (isLoading) return <LoadingComponent locale={locale} />
  if (userAuthorizedRole.data !== Role.SCHOOL) return <ErrorMessageComponent locale={locale} />

  const handleSubmit = (name: string, cnpj: string) => {
    if (name && cnpj) {
      if (doesSchoolExist.data) {
        try {
          setSentFormModalIsOpen(true);
          mutate({ name, cnpj });
        } catch (error) {
          console.log(error);
          return null;
        }
      } else {
        setIncompleteFieldsModalIsOpen(true)
      }
    } else {
      setIncompleteFieldsModalIsOpen(true)
    }
  }

  const handleSelect = (cnpj: string) => {
    setCnpj(cnpj)
    setFetchReports(true)
  }

  return (
    <>
      <PageHeader title={t.t("Register School Admin")} />
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
                <div className="flex flex-col mb-4">
                  <label htmlFor="cnpj" className="mb-2 font-bold text-lg text-gray-900">
                    {t.t("School's CNPJ")}:
                  </label>
                  <InputMask
                    mask="99.999.999/9999-99"
                    placeholder="12.345.678/0001-00"
                    type="text"
                    id="cnpj"
                    value={cnpj}
                    onChange={(e) => handleSelect(e.target.value)}
                    required
                    className={selectField}
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={(event) => {
                      event.preventDefault()
                      handleSubmit(name, cnpj)
                    }}
                    className="text-white font-bold py-2 px-4 rounded-full gradient-animation"
                  >
                    <span className="flex items-center">
                      {t.t("Register School Admin")}
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

export default RegisterSchoolAdmin