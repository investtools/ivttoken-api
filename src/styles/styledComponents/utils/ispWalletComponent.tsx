import React from 'react'
import WalletModal from './walletModal'
import { useState } from "react"
import ColorfulCoinIcon from '../icons/colorfulCoinIcon'
import { useRouter } from 'next/router'

const IspWalletComponent: React.FC = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  const router = useRouter()
  const locale = router.locale === undefined ? 'en' : router.locale

  const handleWalletIconClick = () => {
    setIsWalletModalOpen(!isWalletModalOpen);
  }
  return (
    <>
      <div>
        <div onClick={handleWalletIconClick} className="cursor-pointer">
          <ColorfulCoinIcon />
        </div>
        <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} locale={locale} />
      </div>
    </>
  )
}


export default IspWalletComponent