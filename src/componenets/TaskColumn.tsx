import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Task } from "../store/useTasksStore";
import TaskCard from "./TaskCard";

type TaskColumnProps = {
  status: "To Do" | "In Progress" | "Done";
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
};

export default function TaskColumn({ status, tasks, onTaskClick }: TaskColumnProps) {
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-sm p-4 min-h-[400px] transition hover:shadow-md"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {status}
          </h2>

          <div className="space-y-4">
            {tasks.map((task, index) => (
              <Draggable draggableId={task.id} index={index} key={task.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="rounded-lg"
                  >
                    <TaskCard
                      task={task}
                      onClick={() => onTaskClick?.(task)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}
