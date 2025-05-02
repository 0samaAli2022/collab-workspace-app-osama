import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWorkspacesStore } from "../store/useWorkspacesStore";
import Spinner from "../componenets/Spinner";
import { Menu } from "@headlessui/react";
import { Bars3Icon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { useAuthStore } from "../store/useAuthStore";
import EmptyState from "../componenets/EmptyState"; // make sure path is correct
import CreateWorkspaceModal from "../componenets/CreateWorkspaceModal";


const WorkspaceDashboard = () => {
  const { workspaces, isLoading, error, fetchWorkspaces } = useWorkspacesStore();
  const { user, logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.uid) {
      fetchWorkspaces(user.uid);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const handleCreateWorkspace = () => {
    setIsModalOpen(true)
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-8 py-4 shadow bg-white dark:bg-gray-800">
        <h1 className="text-xl font-bold">MyWorkspaceApp</h1>
        <div className="flex items-center space-x-4">
          <img
            src={user?.photoURL || "https://i.pravatar.cc/40?img=3"}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
          <span className="font-medium hidden sm:block">{user?.displayName || "Anonymous"}</span>
          <Menu as="div" className="relative">
            <Menu.Button className="inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <Bars3Icon className="w-6 h-6 text-gray-800 dark:text-white" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-10">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-2 ${active ? "bg-gray-100 dark:bg-gray-700" : ""
                      }`}
                  >
                    Log Out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </header>

      <div className="flex justify-between items-center p-8">
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
      <main className="p-8">
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
        <CreateWorkspaceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </main>
    </div>
  );
};

export default WorkspaceDashboard;
