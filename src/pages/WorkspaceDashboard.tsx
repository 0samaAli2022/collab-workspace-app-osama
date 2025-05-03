import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWorkspacesStore } from "../store/useWorkspacesStore";
import { useAuthStore } from "../store/useAuthStore";
import Spinner from "../componenets/Spinner";
import EmptyState from "../componenets/EmptyState";
import CreateWorkspaceModal from "../componenets/CreateWorkspaceModal";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

const WorkspaceDashboard = () => {
  const { workspaces, isLoading, error, fetchWorkspaces } = useWorkspacesStore();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      fetchWorkspaces(user.uid);
    }
  }, [user]);

  const handleCreateWorkspace = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Workspaces</h2>
        <button
          onClick={handleCreateWorkspace}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Create Workspace
        </button>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : (
        <>
          {error && <p className="text-red-500">{error}</p>}
          {workspaces.length === 0 ? (
            <EmptyState
              message="You don’t have any workspaces yet."
              icon={<PlusCircleIcon className="w-12 h-12 text-indigo-400" />}
            />
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {workspaces.map((ws) => (
                <Link
                  to={`/workspace/${ws.id}`}
                  key={ws.id}
                  className="block bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold">{ws.name}</h3>
                  <p className="text-sm text-gray-500">{ws.description}</p>
                  <p className="mt-2 text-sm text-gray-400">
                    {ws.members.length} member(s)
                  </p>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <CreateWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default WorkspaceDashboard;
