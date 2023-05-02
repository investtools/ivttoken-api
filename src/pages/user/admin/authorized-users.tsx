import { api } from "~/utils/api"
import HomeButton from "../../../styles/styledComponents/utils/homeButton"
import ErrorMessageComponent from "~/styles/styledComponents/utils/errorMessage"
import LoadingComponent from "~/styles/styledComponents/utils/loading"
import PageHeader from "~/styles/styledComponents/utils/pageHeader"
import IncompleteFieldsModal from "~/styles/styledComponents/modals/incompleteFieldsModal"
import { useState } from "react"
import { formatDate, mapUserRole } from "~/utils/functions/ispFunctions"
import { entityMap } from "~/utils/functions/adminFunctions"
import { useRouter } from "next/router"
import { Translate } from "translate"

const AuthorizedUsers: React.FC = () => {
  const [incompleteFieldsModalIsOpen, setIncompleteFieldsModalIsOpen] = useState(false)

  const router = useRouter()
  const locale = router.locale === undefined ? 'en' : router.locale
  const t = new Translate(locale)

  const isAdmin = api.admin.isAdmin.useQuery()
  const { data, isLoading } = api.admin.getAuthorizedUsers.useQuery()

  if (isAdmin.data == false) return <ErrorMessageComponent locale={locale} />
  if (isAdmin.isLoading) return <LoadingComponent locale={locale} />
  if (isLoading) return <LoadingComponent locale={locale} />
  if (!data) return <ErrorMessageComponent locale={locale} />

  return (
    <>
      {incompleteFieldsModalIsOpen && (
        <IncompleteFieldsModal closeModal={() => setIncompleteFieldsModalIsOpen(false)} locale={locale} />
      )}
      <PageHeader title={t.t("Authorized Users")} />
      <div className="p-8">
        <HomeButton />
        <div className="mt-8">
        </div>
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <h2 className="bg-white p-2 border-t drop-shadow-lg text-ivtcolor2 font-bold text-2xl">{t.t("Authorized Users")}</h2>
          <div className="overflow-x-auto">
            <table className="w-9/10 mx-auto min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="text-center bg-gray-200">
                  <th className="p-2 border text-ivtcolor2">{t.t("E-mail")}</th>
                  <th className="p-2 border text-ivtcolor2">{t.t("Role")}</th>
                  <th className="p-2 border text-ivtcolor2">{t.t("Authorized By")}</th>
                  <th className="p-2 border text-ivtcolor2">{t.t("Team")}</th>
                  <th className="p-2 border text-ivtcolor2">{t.t("Authorized At")}</th>
                </tr>
              </thead>
              <tbody>
                {[...data]?.map((authorizedUser) => (
                  <tr key={authorizedUser.id} className="bg-white text-center">
                    <td className="p-2 border text-ivtcolor2">{authorizedUser.email}</td>
                    <td className="p-2 border text-ivtcolor2">{t.t(mapUserRole(authorizedUser.role))}</td>
                    <td className="p-2 border text-ivtcolor2">{authorizedUser.adminName}</td>
                    <td className="p-2 border text-ivtcolor2">{entityMap(authorizedUser.adminTeam)}</td>
                    <td className="p-2 border text-ivtcolor2">{formatDate(String(authorizedUser.createdAt))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthorizedUsers
