import HomeButton from "./homeButton"
import { FaExclamationTriangle } from 'react-icons/fa'
import React from 'react'
import { Translate } from "translate"

interface ErrorMessageProps {
  locale: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({locale}) => {
  const t = new Translate(locale)

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
          <FaExclamationTriangle className="text-red-500 text-3xl flex justify-center" />
        </div>
        <span className="ml-4 text-2xl font-semibold text-ivtcolor2 flex justify-center">
          {t.t("Oops! Something went wrong :(")}
        </span>
      </div>
      <span className="text-lg font-medium text-ivtcolor2">
        {t.t("We could not access the data you were looking for.")}
      </span>
    </div>
  )
}

const ErrorMessageComponent: React.FC<ErrorMessageProps> = ({locale}) => {
  return (
    <>
      <div className="p-8 relative min-h-screen">
        <HomeButton />
        <ErrorMessage locale={locale} />
      </div>
    </>
  )
}

export default ErrorMessageComponent