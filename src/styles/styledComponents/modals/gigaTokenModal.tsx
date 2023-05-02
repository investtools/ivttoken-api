import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { Translate } from 'translate'

interface GigaTokenModalProps {
  closeModal: () => void
  locale: string
}


export default function GigaTokenModal({ closeModal, locale }: GigaTokenModalProps) {
  const t = new Translate(locale)
  const [isOpen] = useState(true)

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  >
                    Giga Token
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 text-center">
                      {t.t("Giga Token is a social impact project in partnership with UNICEF that aims to bridge the digital divide by connecting underprivileged schools to the internet.")}<br />
                      {t.t("The project uses a blockchain-based token, GigaToken (GIGA), to incentivize internet service providers (ISPs) to connect schools to the internet.")}<br />
                      {t.t("ISPs can earn GigaTokens by connecting schools to the internet and ensuring the quality of the connection.")}<br />
                      {t.t("These tokens can then be exchanged for tax incentives or other rewards.")}<br />
                      {t.t("The project is designed to improve educational opportunities for underprivileged students by providing access to online resources and promoting digital inclusion.")}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-ivtcolor2 px-4 py-2 text-sm font-medium text-white hover:bg-ivtcolor2hover focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      {t.t("Got it!")}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
