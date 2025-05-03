import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Task, useTasksStore } from "../store/useTasksStore";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useWorkspacesStore } from "../store/useWorkspacesStore";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    editTask?: Task | null;
}

const TaskModal = ({ isOpen, onClose, editTask }: Props) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<"To Do" | "In Progress" | "Done">("To Do");
    const [dueDate, setDueDate] = useState("");
    const [error, setError] = useState("");
    const [assignedTo, setAssignedTo] = useState("");

    const { boardId } = useParams();
    const { user } = useAuthStore();
    const { createTask, updateTask } = useTasksStore();
    const { currentWorkspaceUsers } = useWorkspacesStore();

    useEffect(() => {
        if (!isOpen) {
            setTitle("");
            setDescription("");
            setAssignedTo("");
            setError("");
        } else if (editTask) {
            // If it's edit mode, pre-fill the form fields
            setTitle(editTask.title);
            setDescription(editTask.description);
            setStatus(editTask.status);
            setAssignedTo(editTask.assignedTo);
            setDueDate(editTask.dueDate || "");
        }
    }, [isOpen, editTask]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !boardId) return;

        const taskData = { title, description, status, assignedTo, dueDate };

        try {
            if (editTask) {
                // If it's edit mode, update the task
                await updateTask({taskId:editTask.id, ...taskData});
            } else {
                // If it's create mode, create a new task
                await createTask(taskData);
            }
            onClose();
            setTitle("");
            setDescription("");
        } catch (err) {
            console.error(err);
            setError("Failed to save task.");
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
                                    {editTask ? "✏️ Edit Task" : "📝 Create New Task"}
                                </Dialog.Title>

                                {error && <p className="text-red-500 mb-2">{error}</p>}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Task Title
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter task title"
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Description
                                        </label>
                                        <textarea
                                            placeholder="Enter task description"
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={4}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Assign To
                                        </label>
                                        <select
                                            value={assignedTo}
                                            onChange={(e) => setAssignedTo(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition text-gray-900 dark:text-gray-100"
                                        >
                                            <option value="">Select user</option>
                                            {currentWorkspaceUsers?.map((member) => (
                                                <option key={member.uid} value={member.uid}>
                                                    {member.name || member.uid}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Due Date
                                        </label>
                                        <input
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Status
                                        </label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value as "To Do" | "In Progress" | "Done")}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition text-gray-900 dark:text-gray-100"
                                        >
                                            <option value="To Do">To Do</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Done">Done</option>
                                        </select>
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
                                            {editTask ? "Update" : "Create"}
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

export default TaskModal;
