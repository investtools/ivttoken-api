import { api } from "~/utils/api"
import HomeButton from "../../../styles/styledComponents/utils/homeButton"
import ErrorMessageComponent from "~/styles/styledComponents/utils/errorMessage"
import LoadingComponent from "~/styles/styledComponents/utils/loading"
import PageHeader from "~/styles/styledComponents/utils/pageHeader"
import { formatDate, mapContractStatus } from "~/utils/functions/ispFunctions"
import { useState } from "react"
import ApproveContractModal from "~/styles/styledComponents/modals/approveContractModal"
import DenyContractModal from "~/styles/styledComponents/modals/denyContractModal"
import NoContractModal from "~/styles/styledComponents/modals/noContractModal"
import { entityMap } from "~/utils/functions/adminFunctions"
import { useRouter } from "next/router"
import { Translate } from "translate"
import Underline from "~/styles/styledComponents/utils/underline"

const Contracts: React.FC = () => {
  const [approveContractModalIsOpen, setApproveContractModalIsOpen] = useState(false)
  const [denyContractModalIsOpen, setDenyContractModalIsOpen] = useState(false)
  const [noContractModalIsOpen, setNoContractModalIsOpen] = useState(false)

  const router = useRouter()
  const locale = router.locale === undefined ? 'en' : router.locale
  const t = new Translate(locale)

  const isAdmin = api.admin.isAdmin.useQuery()
  const pendingContracts = api.admin.getPendingContracts.useQuery()
  const allContracts = api.admin.getAllContracts.useQuery()
  const approveContract = api.admin.approveContract.useMutation()
  const denyContract = api.admin.denyContract.useMutation()

  if (isAdmin.isLoading) return <LoadingComponent locale={locale} />
  if (allContracts.isLoading) return <LoadingComponent locale={locale} />
  if (pendingContracts.isLoading) return <LoadingComponent locale={locale} />
  if (isAdmin.data == false) return <ErrorMessageComponent locale={locale} />

  const handleApproveContract = (contractId: string) => {
    if (contractId === "NONE") {
      setNoContractModalIsOpen(true)
    } else {
      setApproveContractModalIsOpen(true)
      approveContract.mutate({ contractId })
    }
  }

  const handleDenyContract = (contractId: string) => {
    if (contractId === "NONE") {
      setNoContractModalIsOpen(true)
    } else {
      setDenyContractModalIsOpen(true)
      denyContract.mutate({ contractId })
    }
  }

  const renderPendingContracts = () => {
    return pendingContracts.data?.map((contract, index) => (
      <div key={index} className="p-4 shadow">
        <h3 className="text-ivtcolor2 font-semibold mb-1">{t.t("Contract")} {index + 1}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gray-100 p-4 rounded shadow">
            <h4 className="text-ivtcolor2 font-semibold">{t.t("Internet Provider")}</h4>
            <Underline />
            <p className="text-gray-900">{contract.isp === "NONE" ? "-" : contract.isp}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h4 className="text-ivtcolor2 font-semibold">{t.t("School")}</h4>
            <Underline />
            <p className="text-gray-900">{contract.schoolsId === "NONE" ? "-" : contract.schoolsId}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h4 className="text-ivtcolor2 font-semibold">{t.t("Status")}</h4>
            <Underline />
            <p className="text-gray-900">{t.t(mapContractStatus(contract.status))}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h4 className="text-ivtcolor2 font-semibold">{t.t("Created At")}</h4>
            <Underline />
            <p className="text-gray-900">{formatDate(String(contract.createdAt))}</p>
          </div>
          <div className="flex items-center justify-center space-x-4 w-full">
            <button
              onClick={() => handleApproveContract(contract.contractId)}
              className="bg-ivtcolor hover:bg-hover text-white font-bold py-2 px-4 rounded-full"
            >
              {t.t("Approve")}
            </button>
            <button
              onClick={() => handleDenyContract(contract.contractId)}
              className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full"
            >
              {t.t("Deny")}
            </button>
          </div>
        </div>
      </div>
    ))
  }

  const renderAllContracts = () => {
    return allContracts.data?.map((contract, index) => (
      <div key={index} className="p-4 shadow">
        <h3 className="text-ivtcolor2 font-semibold mb-1">{t.t("Contract")} {index + 1}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-1">
          <div className="bg-gray-100 p-4 rounded shadow">
            <h4 className="text-ivtcolor2 font-semibold">{t.t("Internet Provider")}</h4>
            <Underline />
            <p className="text-gray-900">{contract.isp === "NONE" ? "-" : contract.isp}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h4 className="text-ivtcolor2 font-semibold">{t.t("School")}</h4>
            <Underline />
            <p className="text-gray-900">{contract.schoolsId === "NONE" ? "-" : contract.schoolsId}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h4 className="text-ivtcolor2 font-semibold">Status</h4>
            <Underline />
            <p className="text-gray-900">{contract.status === "NONE" ? "-" : t.t(mapContractStatus(contract.status))}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h4 className="text-ivtcolor2 font-semibold">{t.t("Created At")}</h4>
            <Underline />
            <p className="text-gray-900">{formatDate(String(contract.createdAt))}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h4 className="text-ivtcolor2 font-semibold">{t.t("Reviewed By")}</h4>
            <Underline />
            <p className="text-gray-900">{contract.adminName === "NONE" || contract.status === "PENDING" ? "-" : contract.adminName}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h4 className="text-ivtcolor2 font-semibold">{t.t("Reviewer Team")}</h4>
            <Underline />
            <p className="text-gray-900">{contract.adminTeam === "NONE" || contract.status === "PENDING" ? "-" : entityMap(contract.adminTeam)}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h4 className="text-ivtcolor2 font-semibold">{t.t("Reviewed At")}</h4>
            <Underline />
            <p className="text-gray-900">{contract.reviewedAt === "NONE" || contract.status === "PENDING" ? "-" : formatDate(String(contract.reviewedAt))}</p>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <>
      {approveContractModalIsOpen && (
        <ApproveContractModal closeModal={() => setApproveContractModalIsOpen(false)} locale={locale} />
      )}
      {denyContractModalIsOpen && (
        <DenyContractModal closeModal={() => setDenyContractModalIsOpen(false)} locale={locale} />
      )}
      {noContractModalIsOpen && (
        <NoContractModal closeModal={() => setNoContractModalIsOpen(false)} locale={locale} />
      )}
      <PageHeader title={t.t("Contracts")} />
      <div className="p-8">
        <HomeButton />
        <div className="mt-8 w-full rounded bg-white">
          <h2 className="p-2 text-ivtcolor2 font-bold text-2xl">{t.t("Pending Contracts")}</h2>
          {renderPendingContracts()}
        </div>
        <div className="mt-8 w-full rounded bg-white">
          <h2 className="p-2 text-ivtcolor2 font-bold text-2xl">{t.t("Contracts")}</h2>
          {renderAllContracts()}
        </div>
      </div>
    </>
  )
}

export default Contracts