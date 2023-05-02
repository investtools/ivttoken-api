import { Translate } from "translate"
import HomeButton from "./homeButton"
import styles from './Loading.module.css'
import React from 'react'

interface LoadingProps {
  locale: string
}

const Loading: React.FC<LoadingProps> = ({ locale }) => {
  const t = new Translate(locale)
  return (
    <div className="flex flex-col items-center justify-center p-80">
      <div className="flex flex-col items-center">
        <div className="loader" style={{ marginRight: "6rem"}}>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__ball"></div>
        </div>
        <span className={`text-2xl font-semibold text-ivtcolor2`}>
            <span  className={styles.loadingText}>{t.t("Loading")}</span><span className={styles.loadingDots}>.</span><span className={styles.loadingDots}>.</span><span className={styles.loadingDots}>.</span>
          </span>
        <div className="w-48 text-center" />
      </div>
    </div>
  )
}

const LoadingComponent: React.FC<LoadingProps> = ({ locale }) => {
  return (
    <>
      <div className="p-8">
        <HomeButton />
        <Loading locale={locale} />
      </div>
    </>
  )
}

export default LoadingComponent


