// src/pages/WorkspaceDashboard.tsx
import { useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useWorkspacesStore } from "../store/useWorkspacesStore";

const WorkspaceDashboard = () => {
  const { workspaces, isLoading, error, fetchWorkspaces } = useWorkspacesStore(
    (state) => ({
      workspaces: state.workspaces,
      isLoading: state.isLoading,
      error: state.error,
      fetchWorkspaces: state.fetchWorkspaces,
    })
  );

  // Memoizing fetchWorkspaces to prevent it from changing on every render
  const fetchWorkspacesMemoized = useCallback(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  useEffect(() => {
    fetchWorkspacesMemoized(); // Fetch workspaces when the component mounts
  }, [fetchWorkspacesMemoized, workspaces]); // Now this only triggers when fetchWorkspacesMemoized changes

  return (
    <div className="p-8">
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <h1 className="text-2xl font-bold mb-6">Your Workspaces</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((ws) => (
          <Link
            to={`/workspace/${ws.id}`}
            key={ws.id}
            className="block bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{ws.name}</h2>
            <p className="text-sm text-gray-500">{ws.description}</p>
            <p className="mt-2 text-sm text-gray-400">
              {ws.members.length} member(s)
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WorkspaceDashboard;
