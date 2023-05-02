import { api } from "~/utils/api"
import type { NextPage } from "next"
import PageHeader from "~/styles/styledComponents/utils/pageHeader"
import GigaTokenTitle from "~/styles/styledComponents/utils/gigaTokenTitle"
import SchoolIcon from "~/styles/styledComponents/icons/schoolIcon"
import ConnectivityIcon from "~/styles/styledComponents/icons/connectivityIcon"
import ErrorMessageComponent from "~/styles/styledComponents/utils/errorMessage"
import LoadingComponent from "~/styles/styledComponents/utils/loading"
import { useRouter } from "next/router"
import { Translate } from "translate"
import DashboardButtonLeft from "~/styles/styledComponents/utils/dashboardButtonLeft"
import DashboardButtonRight from "~/styles/styledComponents/utils/dashboardButtonRight"


const SchoolAdminDashboard: NextPage = () => {
  const router = useRouter()
  const locale = router.locale === undefined ? 'en' : router.locale
  const t = new Translate(locale)

  const isSchoolAdmin = api.schoolAdmin.isSchoolAdmin.useQuery()
  if (isSchoolAdmin.data == false) return <ErrorMessageComponent locale={locale} />
  if (isSchoolAdmin.isLoading) return <LoadingComponent locale={locale} />

  return (
    <>
      <PageHeader title={t.t("Giga Token - SCHOOL")} />
      <main className="flex h-screen justify-center items-center">
        <div className="w-full max-w-3xl p-6 flex flex-col items-center space-y-4">
          <GigaTokenTitle locale={locale} />
          <div className="grid grid-cols-2 gap-4 w-full">
            <DashboardButtonLeft title={t.t("My School")} link={"my-school"} RightIcon={SchoolIcon} />
            <DashboardButtonRight title={t.t("Connectivity Report")} link={"connectivity-report"} RightIcon={ConnectivityIcon} />
          </div>
        </div>
      </main>
    </>
  )
}

export default SchoolAdminDashboard