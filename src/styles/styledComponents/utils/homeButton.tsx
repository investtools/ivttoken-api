import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import HomeIcon from '../icons/homeIcon'

const HomeButton: React.FC = () => {
  return (
    <div className="flex items-center justify-start">
      <Link href={'/'}>
        <span className='drop-shadow-2xl hover:opacity-[.85] md:grid-cols-2'>
          <div className="bg-white p-2 rounded drop-shadow-2xl flex items-center">
            <div className="flex items-center border-r border-ivtcolor2">
              <HomeIcon />&nbsp;
            </div>
            &nbsp;&nbsp;<Image src="/images/logo.svg" alt="InvestTools Logo" width={150} height={50} />
          </div>
        </span>
      </Link>
    </div>
  )
}

export default HomeButton
