import {create} from "zustand";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

type Board = {
  id: string;
  title: string;
  workspaceId: string;
};

type BoardStore = {
  boards: Board[];
  isLoading: boolean;
  error: string | null;
  createBoard: (workspaceId: string, title: string, userId: string) => Promise<void>;
  fetchBoards: (workspaceId: string) => Promise<void>;
  setBoards: (boards: Board[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useBoardsStore = create<BoardStore>((set) => ({
  boards: [],
  isLoading: false,
  error: null,
  createBoard: async (workspaceId, title, userId) => {
    set({ isLoading: true });
    try {
      const boardRef = await addDoc(collection(db, "boards"), {
        title: title,
        workspaceId,
        createdBy: userId,
        createdAt: new Date(),
      });
      set((state) => ({
        boards: [...state.boards, { id: boardRef.id, title: title, workspaceId }],
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "An unknown error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },
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
