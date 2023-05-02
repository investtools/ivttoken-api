import { api } from "~/utils/api"
import HomeButton from "../../../styles/styledComponents/utils/homeButton"
import ErrorMessageComponent from "~/styles/styledComponents/utils/errorMessage"
import LoadingComponent from "~/styles/styledComponents/utils/loading"
import PageHeader from "~/styles/styledComponents/utils/pageHeader"
import { formatDate, mapBenefitPrice, mapBenefits } from "~/utils/functions/ispFunctions"
import { useRouter } from "next/router"
import { Translate } from "translate"
import Underline from "~/styles/styledComponents/utils/underline"
import CardsHeader from "~/styles/styledComponents/utils/cardsHeader"

const Transactions: React.FC = () => {
  const isIsp = api.internetServiceProviders.isIsp.useQuery()
  const { data, isLoading } = api.internetServiceProviders.getIspData.useQuery()
  const transactions = api.internetServiceProviders.getIspTransactions.useQuery()

  const router = useRouter()
  const locale = router.locale === undefined ? 'en' : router.locale
  const t = new Translate(locale)

  if (isLoading) return <LoadingComponent locale={locale} />
  if (isIsp.isLoading) return <LoadingComponent locale={locale} />
  if (transactions.isLoading) return <LoadingComponent locale={locale} />
  if (isIsp.data == false) return <ErrorMessageComponent locale={locale} />
  if (!data) return <ErrorMessageComponent locale={locale} />

  const renderTransactions = () => {
    return transactions.data?.map((transaction, index) => (
      <div key={index} className="p-4 shadow">
        <h3 className="text-ivtcolor2 font-semibold mb-1">{t.t("Transaction")} {index + 1}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-100 p-4 rounded shadow">
            <h4 className="text-ivtcolor2 font-semibold">{t.t("Benefit")}</h4>
            <Underline />
            <p className="text-gray-900">{t.t(mapBenefits(transaction.benefit))}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h4 className="text-ivtcolor2 font-semibold">{t.t("Price")}</h4>
            <Underline />
            <p className="text-gray-900">{mapBenefitPrice(transaction.benefitPrice)}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h4 className="text-ivtcolor2 font-semibold">{t.t("Date")}</h4>
            <Underline />
            <p className="text-gray-900">{formatDate(String(transaction.createdAt))}</p>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <>
      <PageHeader title={t.t("Transactions")} />
      <div className="p-8">
        <HomeButton />
        <div className="mt-8 max-w-6xl">
          <div className="bg-white p-4 my-4 rounded shadow">
            <CardsHeader title={t.t("Balance")} />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-gray-900">
              {Object.keys(data).map((key, index) => {
                if (key === "tokenAmount" || key === "unlockedTokens" || key === "lockedTokens" || key === "spentTokens" || key === "tokensHistory") {
                  const typedKey = key
                  return (
                    <div key={index} className="bg-gray-100 p-4 rounded shadow">
                      <h3 className="text-ivtcolor2 font-semibold">
                        {key === "tokenAmount"
                          ? t.t("Token Amount")
                          : key === "unlockedTokens"
                            ? t.t("Unlocked Tokens")
                            : key === "lockedTokens"
                              ? t.t("Locked Tokens")
                              : key === "spentTokens"
                                ? t.t("Spent Tokens")
                                : t.t("Tokens History")
                        }
                        <Underline />
                      </h3>
                      <p>{String(data[typedKey])} Giga Tokens</p>
                    </div>
                  )
                }
                return null
              })}
            </div>
          </div>
        </div>
        <div className="mt-8 max-w-6xl bg-white rounded">
          <h2 className="text-ivtcolor2 font-bold text-2xl ml-4 translate-y-4 mb-4">{t.t("History")}</h2>
          {renderTransactions()}
        </div>
      </div>
    </>
  )
}

export default Transactions