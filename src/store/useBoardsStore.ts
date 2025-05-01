// src/store/useBoardsStore.ts
import {create} from "zustand";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

type Board = {
  id: string;
  name: string;
  workspaceId: string;
};

type BoardStore = {
  boards: Board[];
  isLoading: boolean;
  error: string | null;
  fetchBoards: (workspaceId: string) => Promise<void>;
  setBoards: (boards: Board[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useBoardsStore = create<BoardStore>((set) => ({
  boards: [],
  isLoading: false,
  error: null,
  fetchBoards: async (workspaceId) => {
    set({ isLoading: true });
    try {
      const boardsCollection = collection(db, "boards");
      const q = query(boardsCollection, where("workspaceId", "==", workspaceId));
      const boardSnapshot = await getDocs(q);
      const boardList = boardSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Board, "id">),
      }));
      set({ boards: boardList });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "An unknown error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },
  setBoards: (boards) => set({ boards }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
