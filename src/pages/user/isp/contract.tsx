import { api } from "~/utils/api"
import HomeButton from "~/styles/styledComponents/utils/homeButton"
import ErrorMessageComponent from "~/styles/styledComponents/utils/errorMessage"
import LoadingComponent from "~/styles/styledComponents/utils/loading"
import PageHeader from "~/styles/styledComponents/utils/pageHeader"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Translate } from "translate"
import { translateSchoolKey } from "~/utils/functions/schoolAdminFunctions"
import MiniContractsIcon from "~/styles/styledComponents/icons/miniContractsIcon"
import ConfirmContractModal from "~/styles/styledComponents/modals/confirmContractModal"
import ContractSentModal from "~/styles/styledComponents/modals/contractSentModal"
import Underline from "~/styles/styledComponents/utils/underline"
import CardsHeader from "~/styles/styledComponents/utils/cardsHeader"

const Contract: React.FC = () => {
  const [cnpj, setCnpj] = useState('')
  const [confirmContractModalIsOpen, setConfirmContractModalIsOpen] = useState(false)
  const [contractSentModalIsOpen, setContractSentModalIsOpen] = useState(false)
  const router = useRouter()
  const locale = router.locale === undefined ? 'en' : router.locale
  const t = new Translate(locale)

  useEffect(() => {
    if (router.query.cnpj) {
      setCnpj(router.query.cnpj as string)
    }
  }, [router.query.cnpj])

  const isIsp = api.internetServiceProviders.isIsp.useQuery()
  const getSchoolByCnpj = api.schools.getSchoolByCnpj.useQuery({ cnpj })
  const createContract = api.internetServiceProviders.createContract.useMutation()

  if (isIsp.isLoading) return <LoadingComponent locale={locale} />
  if (getSchoolByCnpj.isLoading) return <LoadingComponent locale={locale} />
  if (isIsp.data == false) return <ErrorMessageComponent locale={locale} />
  if (!getSchoolByCnpj.data) return <ErrorMessageComponent locale={locale} />

  const confirmContract = () => {
    createContract.mutate({ schoolCnpj: cnpj })
    setContractSentModalIsOpen(true)
  }

  const handleSubmit = () => {
    setConfirmContractModalIsOpen(true)
  }

  return (
    <>
      {contractSentModalIsOpen && (
        <ContractSentModal closeModal={() => setContractSentModalIsOpen(false)} locale={locale} />
      )}
      {confirmContractModalIsOpen && (
        <ConfirmContractModal closeModal={() => setConfirmContractModalIsOpen(false)} onConfirm={() => confirmContract()} locale={locale} />
      )}
      <PageHeader title={t.t("Contract")} />
      <div className="p-8">
        <HomeButton />
        <div className="mt-8">
          <div className="bg-white p-4 my-4 rounded shadow">
          <CardsHeader title={t.t("School Details")} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-900">
              {Object.keys(getSchoolByCnpj.data).map((key, index) => {
                const typedKey = key as keyof typeof getSchoolByCnpj.data
                return (
                  <div key={index} className="bg-gray-100 p-4 rounded shadow">
                    <h3 className="text-ivtcolor2 font-semibold">{t.t(translateSchoolKey(key))}</h3>
                    <Underline />
                    <p>{t.t(String(getSchoolByCnpj.data[typedKey]))}</p>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center">
              <button
                style={{ marginTop: "1rem" }}
                onClick={(event) => {
                  event.preventDefault()
                  handleSubmit()
                }}
                className="text-white font-bold py-2 px-4 rounded-full gradient-animation"
              >
                <span className="flex items-center">
                  {t.t("Send Contract")}
                  &nbsp;<MiniContractsIcon />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contract
