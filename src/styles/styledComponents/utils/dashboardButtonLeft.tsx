import Link from "next/link"
import React from "react"

type DashboardButtonProps = {
  title: string
  link: string
  RightIcon: React.ComponentType
}

const DashboardButtonLeft: React.FC<DashboardButtonProps> = ({ title, link, RightIcon }) => {
  return  (
    <Link href={link}>
      <button className="bg-ivtcolor2 hover:bg-ivtcolor2hover text-white font-bold py-6 px-6 rounded-lg transition-all w-full h-40 drop-shadow-xl flex items-center justify-center slide-in-blurred-left">
        <div className="flex flex-col items-center justify-center space-y-2">
          <RightIcon />
          <span className="text-xl">{title}</span>
        </div>
      </button>
    </Link>
  )
}

export default DashboardButtonLeft
