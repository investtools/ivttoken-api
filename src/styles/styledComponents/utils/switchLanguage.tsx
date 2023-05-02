import { useEffect, useState } from 'react'
import { Switch } from '@headlessui/react'
import { useRouter } from 'next/router'

export default function SwitchLanguage() {
  const [enabled, setEnabled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language')
    if (storedLanguage === 'pt-br') {
      setEnabled(true)
    }
  }, [])

  const handleLanguageSwitch = (isEnabled: boolean | ((prevState: boolean) => boolean)) => {
    setEnabled(isEnabled)

    if (isEnabled) {
      const currentPath = router.asPath
      void router.push(currentPath, currentPath, { locale: 'pt-br' })
      localStorage.setItem('language', 'pt-br')
    } else {
      const currentPath = router.asPath
      void router.push(currentPath, currentPath, { locale: 'en' })
      localStorage.removeItem('language')
    }
  }

  return (
    <div style={{ marginTop: "0.2rem" }}>
      <Switch
        checked={enabled}
        onChange={handleLanguageSwitch}
        className={`${enabled ? 'bg-hover' : 'bg-ivtcolor'}
          hover:opacity-[.85] relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-xhover transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Language setting</span>
        <span
          aria-hidden="true"
          className={`${enabled ? 'translate-x-9 border-l-4' : 'translate-x-0 border-r-4'}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-gray-200 border-xhover drop-shadow-xl ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  )
}
