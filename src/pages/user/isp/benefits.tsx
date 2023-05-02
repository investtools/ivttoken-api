import { api } from "~/utils/api"
import HomeButton from "~/styles/styledComponents/utils/homeButton"
import ErrorMessageComponent from "~/styles/styledComponents/utils/errorMessage"
import LoadingComponent from "~/styles/styledComponents/utils/loading"
import PageHeader from "~/styles/styledComponents/utils/pageHeader"
import { benefitPriceByName, benefits } from "~/utils/functions/benefitsFunctions"
import { mapBenefits } from "~/utils/functions/ispFunctions"
import { useState } from "react"
import ConfirmPurchaseModal from "~/styles/styledComponents/modals/confirmPurchase"
import PurchasedBenefitModal from "~/styles/styledComponents/modals/purchasedBenefitModal"
import NotEnoughTokensModal from "~/styles/styledComponents/modals/notEnoughTokensModal"
import { useRouter } from "next/router"
import { Translate } from "translate"
import Underline from "~/styles/styledComponents/utils/underline"
import CardsHeader from "~/styles/styledComponents/utils/cardsHeader"

const Benefits: React.FC = () => {
  const [purchasedBenefitModalIsOpen, setPurchasedBenefitModalIsOpen] = useState(false)
  const [notEnoughTokensModalIsOpen, setNotEnoughTokensModalIsOpen] = useState(false)
  const [confirmPurchaseModalIsOpen, setConfirmPurchaseModal] = useState(false)
  const [selectedBenefit, setSelectedBenefit] = useState<string | null>(null)

  const router = useRouter()
  const locale = router.locale === undefined ? 'en' : router.locale
  const t = new Translate(locale)

  const purchase = api.internetServiceProviders.buyBenefits.useMutation()
  const isIsp = api.internetServiceProviders.isIsp.useQuery()
  const { data, isLoading } = api.internetServiceProviders.getIspData.useQuery()
  const ispUnlockedTokens = api.internetServiceProviders.ispUnlockedTokens.useQuery()

  if (isIsp.isLoading) return <LoadingComponent locale={locale} />
  if (isLoading) return <LoadingComponent locale={locale} />
  if (purchase.isLoading) return <LoadingComponent locale={locale} />
  if (ispUnlockedTokens.isLoading) return <LoadingComponent locale={locale} />

  if (isIsp.data == false) return <ErrorMessageComponent locale={locale} />
  if (!data) return <ErrorMessageComponent locale={locale} />

  const confirmPurchase = () => {
    if (selectedBenefit) {
      purchase.mutate({ selectedBenefit })
      setPurchasedBenefitModalIsOpen(true)
    }
  }

  const handleSelectBenefit = (benefit: string) => {
    setSelectedBenefit(benefit)
    if (Number(ispUnlockedTokens.data) >= Number(benefitPriceByName(benefit))) {
      setConfirmPurchaseModal(true)
    } else {
      setNotEnoughTokensModalIsOpen(true)
    }
  }

  return (
    <>
      {notEnoughTokensModalIsOpen && (
        <NotEnoughTokensModal closeModal={() => setNotEnoughTokensModalIsOpen(false)} locale={locale} />
      )}
      {purchasedBenefitModalIsOpen && (
        <PurchasedBenefitModal closeModal={() => setPurchasedBenefitModalIsOpen(false)} locale={locale} />
      )}
      {confirmPurchaseModalIsOpen && (
        <ConfirmPurchaseModal closeModal={() => setConfirmPurchaseModal(false)} onConfirm={() => confirmPurchase()} locale={locale} />
      )}
      <PageHeader title={t.t("Benefits")} />
      <div className="p-8">
        <HomeButton />
        <div className="mt-8 max-w-6xl">
          <div className="bg-white p-4 my-4 rounded shadow">
            <CardsHeader title={t.t("Benefits")} />
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
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mt-8 max-w-6xl">
          <div className="overflow-x-auto">
            <table className="mx-auto min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-white">
                  <th className="p-2 text-ivtcolor2 font-bold text-2xl text-justify" colSpan={3}>{t.t("Benefits")}</th>
                </tr>
                <tr className="text-center bg-gray-200">
                  <th className="p-2 border text-ivtcolor2">{t.t("Benefit")}</th>
                  <th className="p-2 border text-ivtcolor2">{t.t("Price")}</th>
                  <th className="p-2 border text-ivtcolor2">{t.t("Exchange")}</th>
                </tr>
              </thead>
              <tbody>
                {[...benefits]?.map((benefits) => (
                  <tr key={benefits.benefit} className="bg-white text-center">
                    <td className="p-2 border text-ivtcolor2">{t.t(mapBenefits(benefits.benefit))}</td>
                    <td className="p-2 border text-ivtcolor2">{benefits.benefitPrice} Giga Tokens</td>
                    <td className="p-2 border text-ivtcolor2">
                      <button
                        onClick={() => handleSelectBenefit(benefits.benefit)}
                        className="bg-ivtcolor hover:bg-hover text-white font-bold py-2 px-4 rounded-full"
                      >
                        {t.t("Exchange")}
                      </button>
                    </td>
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

export default Benefits
