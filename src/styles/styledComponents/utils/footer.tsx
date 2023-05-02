import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Translate } from 'translate'

const Footer: React.FC = () => {
  const router = useRouter()
  const locale = router.locale === undefined ? 'en' : router.locale
  const t = new Translate(locale)

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="w-full h-1 gradient-animation mb-6"></div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">{t.t("Follow Us!")}</h3>
            <hr className="border-gray-300 border-t w-16 mx-auto mb-4" />
            <ul className="space-y-2">
              <li>
                <a href="https://investtools.com.br/en" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                  InvestTools
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/investtools/mycompany/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/investtools_/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@investtools283/videos" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center space-y-8 ">
            <Image src="/images/assinaturawhite.svg" width={150} height={50} alt="InvestTools" />
            <Image src="/uniceflogo.png" width={150} height={50} alt="Unicef" />
            <Image src="/giga.png" width={100} height={50} alt="Unicef" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer