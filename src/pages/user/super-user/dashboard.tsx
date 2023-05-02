import type { NextPage } from "next"
import PageHeader from "~/styles/styledComponents/utils/pageHeader"
import TableIcon from "~/styles/styledComponents/icons/tableIcon"
import UnlockedIcon from "~/styles/styledComponents/icons/unlockedIcon"
import SchoolIcon from "~/styles/styledComponents/icons/schoolIcon"
import GigaTokenTitle from "~/styles/styledComponents/utils/gigaTokenTitle"
import { api } from "~/utils/api"
import ErrorMessageComponent from "~/styles/styledComponents/utils/errorMessage"
import ConnectivityIcon from "~/styles/styledComponents/icons/connectivityIcon"
import LoadingComponent from "~/styles/styledComponents/utils/loading"
import ContractsIcon from "~/styles/styledComponents/icons/contractsIcon"
import EditIcon from "~/styles/styledComponents/icons/editIcon"
import { useRouter } from "next/router"
import DashboardButtonRight from "~/styles/styledComponents/utils/dashboardButtonRight"
import DashboardButtonLeft from "~/styles/styledComponents/utils/dashboardButtonLeft"

const UserDashboard: NextPage = () => {
  const router = useRouter()
  const locale = router.locale === undefined ? 'en' : router.locale

  const isSuperUser = api.superUser.isSuperUser.useQuery()
  if (isSuperUser.data == false) return <ErrorMessageComponent locale={locale} />
  if (isSuperUser.isLoading) return <LoadingComponent locale={locale} />

  return (
    <>
      <PageHeader title="Giga Token - SUPER-USER" />
      <main className="flex h-screen justify-start">
        <div className="w-full max-w-3xl p-6 flex flex-col items-start space-y-4">
          <GigaTokenTitle locale={locale} />

          <DashboardButtonLeft title={"Contracts"} link={"contracts"} RightIcon={ContractsIcon} />
          <DashboardButtonRight title={"Create School"} link={"create-school"} RightIcon={SchoolIcon} />
          <DashboardButtonLeft title={"School Catalog"} link={"school-catalog"} RightIcon={TableIcon} />
          <DashboardButtonRight title={"Unlock ISP Tokens"} link={"unlock-isp-tokens"} RightIcon={UnlockedIcon} />
          <DashboardButtonLeft title={"Connectivity Reports"} link={"connectivity-reports"} RightIcon={ConnectivityIcon} />
          <DashboardButtonRight title={"Assign Tokens to School"} link={"assign-tokens-school"} RightIcon={EditIcon} />
        </div>
      </main>
    </>
  )
}

export default UserDashboard