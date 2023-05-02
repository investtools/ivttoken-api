import { useState } from "react"
import GigaTokenModal from "../modals/gigaTokenModal"
import React from 'react'
import Image from 'next/image'

interface LocaleProps {
  locale: string
}

const GigaTokenTitle: React.FC<LocaleProps> = ({locale}) => {
  const [gigaTokenModalIsOpen, setGigaTokenModalIsOpen] = useState(false)

  const handleClick = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setGigaTokenModalIsOpen(true)
  }

  return (
    <>
      {gigaTokenModalIsOpen && (
        <GigaTokenModal closeModal={() => setGigaTokenModalIsOpen(false)} locale={locale} />
      )}
      <button
        onClick={handleClick}
      >
        <div className="flex items-center justify-start">
          <span>
            <div className="bg-white p-2 rounded hover:opacity-[.85]">
              <Image src="/images/logo.svg" alt="InvestTools Logo" width={250} height={50} />
            </div>
          </span>
        </div>
      </button>
    </>
  )
}

export default GigaTokenTitle
