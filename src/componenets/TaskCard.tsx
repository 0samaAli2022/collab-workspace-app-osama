import { Task } from "../store/useTasksStore";
import { useWorkspacesStore } from "../store/useWorkspacesStore";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const { currentWorkspaceUsers } = useWorkspacesStore();

  const assignee = task.assignedTo
    ? currentWorkspaceUsers.find((u) => u.uid === task.assignedTo)
    : null;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white dark:bg-gray-700 p-4 mb-2 rounded-xl shadow hover:shadow-lg border border-gray-200 dark:border-gray-600 transition space-y-2"
    >
      <h3 className="font-semibold text-md text-gray-900 dark:text-white truncate">
        {task.title}
      </h3>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        {assignee ? (
          <div className="flex items-center gap-2">
            {assignee.photoURL && (
              <img
                src={assignee.photoURL}
                alt={assignee.name}
                className="w-5 h-5 rounded-full object-cover"
              />
            )}
            <span>{assignee.name}</span>
          </div>
        ) : (
          <span className="italic text-xs">Unassigned</span>
        )}
        {task.dueDate && (
          <span className="text-xs">
            {format(new Date(task.dueDate), "MMM d")}
          </span>
        )}
      </div>
    </div>
  );
}
