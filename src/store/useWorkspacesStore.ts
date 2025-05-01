// src/store/useWorkspacesStore.ts
import {create} from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

// Define workspace types for TypeScript
type Workspace = {
  id: string;
  name: string;
  description: string;
  members: string[];
};

type WorkspaceStore = {
  workspaces: Workspace[];
  isLoading: boolean;
  error: string | null;
  fetchWorkspaces: () => Promise<void>;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useWorkspacesStore = create<WorkspaceStore>()(
  persist(
    (set, get) => ({
      workspaces: [],
      isLoading: false,
      error: null,
      fetchWorkspaces: async () => {
        const { workspaces } = get();
        
        // Check if workspaces are cached before making the request
        if (workspaces.length > 0) return;

        set({ isLoading: true });
        try {
          const workspacesCollection = collection(db, "workspaces");
          const workspaceSnapshot = await getDocs(workspacesCollection);
          
          // Map Firebase documents to workspaces
          const workspaceList: Workspace[] = workspaceSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || "",
              description: data.description || "",
              members: data.members || [],
            };
          });
          
          set({ workspaces: workspaceList });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },
      setWorkspaces: (workspaces) => set({ workspaces }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "workspaces-storage", // Name of the persisted storage key
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    }
  )
);
