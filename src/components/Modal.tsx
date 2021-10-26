import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, ReactNode } from "react";

interface IProps {
  title?: string | ReactNode | (() => ReactNode);
  children: string | ReactNode | (() => ReactNode);
  primaryButtonText: string | ReactNode | (() => ReactNode);
  onPrimaryClick: () => void;
  secondaryButtonText?: string;
  onSecondaryClick?: () => void;
  // onSecondaryClick?: any;
  isDanger?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Reusable Modal Infrastructure 
 * Usage:
 * 
   <Modal
          title={"Are you sure you want to do X?"}  Optional
      
          primaryButtonText={"Okey"}
          secondaryButtonText={"Cancel"}        Optional
          isOpen={isOpen}                       -> react useState for handling opening and closing.
          isDanger={true}                       optional, if true main button will change 
          onClose={() => setIsOpen(false)} 
          onPrimaryClick={onClickFunction}      Main button onClick function
          onSecondaryClick={onClickFunction}    Secondary button onClick function, optional, defaults to close modal
        > 
       
        Main content 
       
         <Modal/>
 *
 *
 */

const Modal: FC<IProps> = (props) => {
  return (
    <>
      <Transition appear show={props.isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto "
          onClose={props.onClose}
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
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left top-0 transition-all transform bg-black shadow-xl rounded-2xl">
                {props.title && (
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-50"
                  >
                    {props.title}
                  </Dialog.Title>
                )}
                <div className="mt-2 text-gray-300">
                  {/* <p className='text-sm text-gray-300'>{props.children}</p> */}
                  {props.children}
                </div>

                <div className="mt-4 space-x-2 flex justify-end">
                  {props.secondaryButtonText && (
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-gray-50 bg-gray-800 border border-transparent rounded-md hover:bg-gray-700"
                      onClick={
                        props.onSecondaryClick
                          ? () => {
                              props.onSecondaryClick!();
                              props.onClose();
                            }
                          : () => props.onClose()
                      }
                    >
                      {props.secondaryButtonText}
                    </button>
                  )}
                  <button
                    type="button"
                    className={`inline-flex justify-center px-4 py-2 text-sm font-medium border border-transparent rounded-md ${
                      props.isDanger
                        ? " text-red-800 bg-red-100 hover:bg-red-200 focus-visible:ring-red-500 "
                        : " text-blue-800 bg-blue-100  hover:bg-blue-200 focus-visible:ring-blue-500 "
                    } `}
                    onClick={() => {
                      props.onPrimaryClick();
                      props.onClose();
                    }}
                  >
                    {props.primaryButtonText}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
