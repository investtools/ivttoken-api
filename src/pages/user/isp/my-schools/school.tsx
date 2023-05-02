import { api } from "~/utils/api"
import HomeButton from "~/styles/styledComponents/utils/homeButton"
import ErrorMessageComponent from "~/styles/styledComponents/utils/errorMessage"
import LoadingComponent from "~/styles/styledComponents/utils/loading"
import PageHeader from "~/styles/styledComponents/utils/pageHeader"
import { useEffect, useState } from "react"
import { connectivityQualityMap, monthMap } from "~/utils/functions/adminFunctions"
import { useRouter } from "next/router"
import { Translate } from "translate"
import Underline from "~/styles/styledComponents/utils/underline"
import ConnectivityChart from "~/styles/styledComponents/utils/connectivityChart"
import { getFullYear } from "~/utils/functions/ispFunctions"

const SchoolReports: React.FC = () => {
    const [cnpj, setCnpj] = useState('')
    const router = useRouter()
    const locale = router.locale === undefined ? 'en' : router.locale
    const t = new Translate(locale)

    useEffect(() => {
        if (router.query.cnpj) {
            setCnpj(router.query.cnpj as string)
        }
    }, [router.query.cnpj])

    const isIsp = api.internetServiceProviders.isIsp.useQuery()
    const connectivityReports = api.admin.getAllConnectivityReports.useQuery({ cnpj })
    const schoolName = api.schools.findSchoolNameByCnpj.useQuery({ cnpj })

    if (isIsp.isLoading) return <LoadingComponent locale={locale} />
    if (isIsp.data == false) return <ErrorMessageComponent locale={locale} />
    if (cnpj && connectivityReports.isLoading) return <LoadingComponent locale={locale} />
    if (cnpj && schoolName.isLoading) return <LoadingComponent locale={locale} />
    if (!connectivityReports.data) return <ErrorMessageComponent locale={locale} />

    const renderReports = () => {
        return connectivityReports.data?.map((report, index, array) => (
          <div key={index} className={`p-4 shadow ${index === array.length - 1 ? "rounded-b" : ""}`}>
            <h3 className="text-ivtcolor2 font-semibold mb-1">{t.t("Report")} {index + 1}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-gray-100 p-4 rounded shadow">
                        <h4 className="text-ivtcolor2 font-semibold">{t.t("Month")}</h4>
                        <Underline />
                        <p className="text-gray-900">{`${t.t(monthMap(report.month))} ${getFullYear(report.createdAt)}`}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded shadow">
                        <h4 className="text-ivtcolor2 font-semibold">{t.t("Days Without Internet")}</h4>
                        <Underline />
                        <p className="text-gray-900">{report.noInternetDays === -1 ? t.t("No Reports Available") : report.noInternetDays}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded shadow">
                        <h4 className="text-ivtcolor2 font-semibold">{t.t("Average Speed Mb/s")}</h4>
                        <Underline />
                        <p className="text-gray-900">{report.averageSpeed === -1 ? t.t("No Reports Available") : report.averageSpeed}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded shadow">
                        <h4 className="text-ivtcolor2 font-semibold">{t.t("Connection Quality")}</h4>
                        <Underline />
                        <p className="text-gray-900">{t.t(connectivityQualityMap(report.connectionQuality))}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded shadow">
                        <h4 className="text-ivtcolor2 font-semibold">{t.t("Connectivity Percentage")}</h4>
                        <Underline />
                        <p className="text-gray-900">{report.connectivityPercentage === "NONE" ? t.t("No Reports Available") : report.connectivityPercentage}</p>
                    </div>
                </div>
            </div>
        ))
    }

    return (
        <>
          <PageHeader title={t.t("Connectivity Reports")} />
          <div className="p-8">
            <HomeButton />
            <div className="mt-8">
            <ConnectivityChart locale={locale} data={connectivityReports.data} />
              <div className="bg-white p-2 rounded-t text-ivtcolor2 font-bold text-2xl flex justify-between">
                <div className="flex-1 text-left">{t.t("Connectivity Reports")}</div>
                <div className="flex-1 text-center">{schoolName.data}</div>
                <div className="flex-1 text-right">{cnpj}</div>
              </div>
              <div className="bg-white rounded-b">
                {renderReports()}
              </div>
            </div>
          </div>
        </>
      )
}

export default SchoolReports
