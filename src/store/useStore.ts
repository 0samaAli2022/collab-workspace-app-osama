// src/store/useStore.ts
import { useWorkspacesStore } from "./useWorkspacesStore";
import { useBoardsStore } from "./useBoardsStore";
import { useTasksStore } from "./useTasksStore";

export const useStore = {
  workspaces: useWorkspacesStore,
  boards: useBoardsStore,
  tasks: useTasksStore,
};
