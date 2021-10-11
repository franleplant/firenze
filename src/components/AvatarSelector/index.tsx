import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Selector from "./Selector";

export default function AvatarSelectorModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Fragment>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-300 rounded-md p-2"
      >
        Select Avatar
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => {}}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-100" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block max-w-7xl w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Select your avatar
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    This is a list of your current NFTs
                  </p>
                  <div className="flex flex-row flex-wrap">
                    <div className="max-w-lg p-5">
                      <div>Controls</div>
                      <div>Save</div>
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={() => setIsOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                    <div className="flex-1 max-h-96 overflow-y-auto">
                      <Selector />
                    </div>
                  </div>
                </div>

                <div className="mt-4"></div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Fragment>
  );
}
