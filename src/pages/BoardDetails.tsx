import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Task, useTasksStore } from "../store/useTasksStore";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { ArrowLeftIcon } from "lucide-react";
import TaskColumn from "../componenets/TaskColumn";
import TaskModal from "../componenets/TaskModal";

const columns = ["To Do", "In Progress", "Done"];

export default function BoardDetailsPage() {
  const { boardId, workspaceId } = useParams<{ boardId: string, workspaceId: string }>();
  const { tasks, fetchTasks, moveTask } = useTasksStore();
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const navigator = useNavigate();

  useEffect(() => {
    if (boardId) {
      fetchTasks(boardId);
    }
  }, [boardId, fetchTasks]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as "To Do" | "In Progress" | "Done";
    moveTask(draggableId, newStatus);
  };

  const groupedTasks = columns.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigator("/workspace/" + workspaceId)}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition hover:cursor-pointer"
      >
        <ArrowLeftIcon className="w-5 h-5" />
      </button>
      <h1 className="text-2xl font-bold">Board Tasks</h1>

      <button
        onClick={() => setIsCreateTaskOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Create Task
      </button>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((status) => (
            <TaskColumn
              key={status}
              status={status as "To Do" | "In Progress" | "Done"}
              tasks={groupedTasks[status]}
              onTaskClick={(task) => {
                setEditTask(task);  // Set the task to edit
                setIsCreateTaskOpen(true);  // Open the modal
              }}
            />
          ))}
        </div>
      </DragDropContext>

      {/* Create Task Modal */}
      <TaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => {
          setIsCreateTaskOpen(false);
          setEditTask(null);  // Clear the edit task when closing
        }}
        editTask={editTask}  // Pass the editTask to the modal
      />
    </div>
  );
}
