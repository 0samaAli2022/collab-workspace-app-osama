import {create} from "zustand";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
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
  fetchWorkspaces: (userId: string) => Promise<void>;
  createWorkspace: (name: string, description: string, userId: string) => Promise<void>;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useWorkspacesStore = create<WorkspaceStore>(
    (set) => ({
      workspaces: [],
      isLoading: false,
      error: null,
      fetchWorkspaces: async (userId: string) => {
        set({ isLoading: true });
        try {
          const workspacesCollection = collection(db, "workspaces");
          const q = query(workspacesCollection, where("members", "array-contains", userId));

          const workspaceSnapshot = await getDocs(q);
          
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
          console.log("Fetched workspaces:", workspaceList);
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
