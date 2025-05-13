import { create } from "zustand";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  assignedTo: string;
  dueDate?: string;
  boardId: string;
};

type NewTask = Omit<Task, "id">;

type TaskStore = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (boardId: string) => Promise<void>;
  createTask: (task: NewTask) => Promise<void>;
  moveTask: (taskId: string, newStatus: Task["status"]) => Promise<void>;
  updateTask: (updated: {
    taskId: string;
    title: string;
    description: string;
    assignedTo: string;
    dueDate?: string;
    status: Task["status"];
  }) => Promise<void>;
  setTasks: (tasks: Task[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useTasksStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (boardId) => {
    set({ isLoading: true });
    try {
      const tasksCollection = collection(db, "tasks");
      const q = query(tasksCollection, where("boardId", "==", boardId));
      const taskSnapshot = await getDocs(q);
      const taskList = taskSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Task)
      );
      set({ tasks: taskList });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createTask: async (task) => {
    try {
      const tasksCollection = collection(db, "tasks");
      const docRef = await addDoc(tasksCollection, task);
      const newTask: Task = { id: docRef.id, ...task };
      set({ tasks: [...get().tasks, newTask] });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  },

  moveTask: async (taskId, newStatus) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      updateDoc(taskRef, { status: newStatus }); // no await here, as we don't need to wait for the update to complete

      const updatedTasks = get().tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      set({ tasks: updatedTasks });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to move task",
      });
    }
  },

  updateTask: async ({
    taskId,
    title,
    description,
    assignedTo,
    dueDate,
    status,
  }) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        title,
        description,
        assignedTo,
        dueDate,
        status,
      });

      const updatedTasks = get().tasks.map((task) =>
        task.id === taskId
          ? { ...task, title, description, assignedTo, dueDate, status }
          : task
      );
      set({ tasks: updatedTasks });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update task",
      });
    }
  },

  setTasks: (tasks) => set({ tasks }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
