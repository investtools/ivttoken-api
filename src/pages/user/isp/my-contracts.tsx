import { api } from "~/utils/api"
import HomeButton from "../../../styles/styledComponents/utils/homeButton"
import ErrorMessageComponent from "~/styles/styledComponents/utils/errorMessage"
import LoadingComponent from "~/styles/styledComponents/utils/loading"
import PageHeader from "~/styles/styledComponents/utils/pageHeader"
import { formatDate, mapContractStatus } from "~/utils/functions/ispFunctions"
import { useRouter } from "next/router"
import { Translate } from "translate"
import Underline from "~/styles/styledComponents/utils/underline"

const ISPContracts: React.FC = () => {
  const isIsp = api.internetServiceProviders.isIsp.useQuery()
  const { data, isLoading } = api.internetServiceProviders.getIspData.useQuery()
  const contracts = api.internetServiceProviders.getIspContracts.useQuery()

  const router = useRouter()
  const locale = router.locale === undefined ? 'en' : router.locale
  const t = new Translate(locale)

  if (isLoading) return <LoadingComponent locale={locale} />
  if (isIsp.isLoading) return <LoadingComponent locale={locale} />
  if (contracts.isLoading) return <LoadingComponent locale={locale} />
  if (isIsp.data == false) return <ErrorMessageComponent locale={locale} />
  if (!data) return <ErrorMessageComponent locale={locale} />

  const renderContracts = () => {
    return contracts.data?.map((contract, index) => (
      <div key={index} className="p-4 shadow">
        <h3 className="text-ivtcolor2 font-semibold mb-1">{t.t("Contract")} {index + 1}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-100 p-4 rounded shadow">
            <h4 className="text-ivtcolor2 font-semibold">{t.t("School")}</h4>
            <Underline />
            <p className="text-gray-900">{contract.schoolsId === "NONE" ? "-" : contract.schoolsId}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h4 className="text-ivtcolor2 font-semibold">Status</h4>
            <Underline />
            <p className="text-gray-900">{t.t(mapContractStatus(contract.status))}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h4 className="text-ivtcolor2 font-semibold">{t.t("Created At")}</h4>
            <Underline />
            <p className="text-gray-900">{formatDate(String(contract.createdAt))}</p>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <>
      <PageHeader title={t.t("My Contracts")} />
      <div className="p-8">
        <HomeButton />
        <div className="mt-8 w-full">
          <div className="bg-white rounded">
            <h2 className="ml-4 translate-y-4 text-ivtcolor2 font-bold text-2xl mb-4 ">{t.t("My Contracts")}</h2>
            {renderContracts()}
          </div>
        </div>
      </div>
    </>
  )
}

export default ISPContracts