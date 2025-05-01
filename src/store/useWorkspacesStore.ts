import {create} from "zustand";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

type Workspace = {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdAt: Date;
  createdBy: string;
};

type WorkspaceStore = {
  workspaces: Workspace[];
  isLoading: boolean;
  error: string | null;
  fetchWorkspaces: () => Promise<void>;
  createWorkspace: (name: string, description: string, userId: string) => Promise<void>;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useWorkspacesStore = create<WorkspaceStore>(
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
              createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
              createdBy: data.createdBy || "",
            };
          });
          
          set({ workspaces: workspaceList });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },
      createWorkspace: async (name, description, userId) => {
        try {
          const docRef = await addDoc(collection(db, "workspaces"), {
            name,
            description,
            members: [userId],
            createdAt: new Date(),
            createdBy: userId,
          });
    
          // Update local state
          set((state) => ({
            workspaces: [
              ...state.workspaces,
              {
                id: docRef.id,
                name,
                description,
                members: [userId],
                createdAt: new Date(),
                createdBy: userId,
              },
            ],
          }));
        } catch (error: any) {
          set({ error: error.message });
        }
      },
      setWorkspaces: (workspaces) => set({ workspaces }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    })
);
