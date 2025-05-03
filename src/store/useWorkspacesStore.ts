import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import User from "../types/user";

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
  currentWorkspace: Workspace | null;
  currentWorkspaceUsers: User[];
  isLoading: boolean;
  error: string | null;
  fetchWorkspaces: (userId: string) => Promise<void>;
  fetchWorkspaceUsers: (workspaceId: string) => Promise<void>;
  createWorkspace: (name: string, description: string, userId: string) => Promise<void>;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useWorkspacesStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      workspaces: [],
      currentWorkspace: null,
      currentWorkspaceUsers: [],
      isLoading: false,
      error: null,

      fetchWorkspaceUsers: async (workspaceId: string) => {
        try {
          const wsDoc = await getDoc(doc(db, "workspaces", workspaceId));
          if (!wsDoc.exists()) return;

          const members = wsDoc.data().members || [];
          if (!Array.isArray(members) || members.length === 0) {
            set({ currentWorkspaceUsers: [] });
            return;
          }

          const q = query(
            collection(db, "users"),
            where("__name__", "in", members.slice(0, 10))
          );

          const snapshot = await getDocs(q);
          const users = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              uid: doc.id,
              name: data.name || "",
              email: data.email || "",
              photoURL: data.photoURL || "",
            } as User;
          });

          set({ currentWorkspaceUsers: users });
        } catch (error) {
          console.error("Error fetching workspace users:", error);
        }
      },

      setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),

      fetchWorkspaces: async (userId: string) => {
        set({ isLoading: true });
        try {
          const workspacesCollection = collection(db, "workspaces");
          const q = query(workspacesCollection, where("members", "array-contains", userId));
          const workspaceSnapshot = await getDocs(q);

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
    }),
    {
      name: "workspaces-store", // name for localStorage key
      partialize: (state) => ({
        currentWorkspaceUsers: state.currentWorkspaceUsers,
        currentWorkspace: state.currentWorkspace,
      }),
    }
  )
);
