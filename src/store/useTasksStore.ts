// src/store/useTasksStore.ts
import {create} from "zustand";
import { collection, getDocs, query, where } from "firebase/firestore";
import {db} from "../config/firebase";

type Task = {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  assignedTo: string;
};

type TaskStore = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (boardId: string) => Promise<void>;
  setTasks: (tasks: Task[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useTasksStore = create<TaskStore>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,
  fetchTasks: async (boardId) => {
    set({ isLoading: true });
    try {
      const tasksCollection = collection(db, "tasks");
      const q = query(tasksCollection, where("boardId", "==", boardId));
      const taskSnapshot = await getDocs(q);
      const taskList = taskSnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        status: doc.data().status,
        assignedTo: doc.data().assignedTo,
      } as Task));
      set({ tasks: taskList });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "An unknown error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },
  setTasks: (tasks) => set({ tasks }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
