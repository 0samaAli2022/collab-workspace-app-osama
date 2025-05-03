import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useBoardsStore } from "../store/useBoardsStore";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBoardModal = ({ isOpen, onClose }: Props) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { workspaceId } = useParams();
  const { user } = useAuthStore();
  const { createBoard } = useBoardsStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !workspaceId) return;

    try {
      await createBoard(workspaceId, name, user.uid);
      onClose();
      setName("");
    } catch (err) {
      console.error(err);
      setError("Failed to create board.");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-8 text-left align-middle shadow-2xl transition-all border dark:border-gray-700">
                <Dialog.Title className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  📋 Create New Board
                </Dialog.Title>

                {error && <p className="text-red-500 mb-2">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Board Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter board title"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateBoardModal;
