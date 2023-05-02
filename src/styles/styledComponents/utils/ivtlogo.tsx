import React from 'react'
import Image from 'next/image'

const IvtLogo: React.FC = () => {
  return (
    <div className="flex justify-start w-full h-full">
      <span className="drop-shadow-2xl">
        <div className="bg-white p-2 rounded drop-shadow-2xl flex justify-start">
          <Image src="/images/logo.svg" alt="InvestTools Logo" width={150} height={50} />
        </div>
      </span>
    </div>
  )
}

export default IvtLogo