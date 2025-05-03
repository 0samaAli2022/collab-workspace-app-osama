import { Link, useParams, useNavigate } from "react-router-dom";
import { useBoardsStore } from "../store/useBoardsStore";
import { useEffect, useState } from "react";
import Spinner from "../componenets/Spinner";
import { PlusCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import EmptyState from "../componenets/EmptyState";
import CreateBoardModal from "../componenets/CreateBoardModal";
import { useWorkspacesStore } from "../store/useWorkspacesStore";

export default function WorkspaceDetails() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { boards, isLoading, error, fetchBoards } = useBoardsStore();
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const { workspaces, setCurrentWorkspace, fetchWorkspaceUsers } = useWorkspacesStore();


  useEffect(() => {
    if (workspaceId) {
      
      fetchBoards(workspaceId);
      const currentWorkspace = workspaces.find((ws) => ws.id === workspaceId) || null;
      setCurrentWorkspace(currentWorkspace);

      fetchWorkspaceUsers(workspaceId);

    }
  }, [workspaceId, fetchBoards]);

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition hover:cursor-pointer"
      >
        <ArrowLeftIcon className="w-5 h-5" />
      </button>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workspace Boards</h1>
        <button
          onClick={() => setIsCreateBoardOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Create Board
        </button>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : boards.length === 0 ? (
        <EmptyState
          message="No boards found in this workspace."
          icon={<PlusCircleIcon className="w-12 h-12 text-indigo-400" />}
          action={
            <button
              onClick={() => setIsCreateBoardOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Create Board
            </button>
          }
        />
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <Link
              to={`/workspace/${workspaceId}/board/${board.id}`}
              key={board.id}
              className="block bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold">{board.title}</h2>
            </Link>
          ))}
        </div>
      )}

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={isCreateBoardOpen}
        onClose={() => setIsCreateBoardOpen(false)}
      />
    </div>
  );
}
