import { Outlet, useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";

const Layout = () => {
  const { user, logout } = useAuthStore();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!user) {
        navigate("/auth", { replace: true });
      }
    }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-8 py-4 shadow bg-white dark:bg-gray-800 sticky top-0 z-50">
        <h1 className="text-xl font-bold">MyWorkspaceApp</h1>
        <div className="flex items-center space-x-4">
          <img
            src={user?.photoURL || "https://i.pravatar.cc/40?img=3"}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
          <span className="font-medium hidden sm:block">
            {user?.displayName || "Anonymous"}
          </span>
          <Menu as="div" className="relative">
            <Menu.Button className="inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <Bars3Icon className="w-6 h-6 text-gray-800 dark:text-white" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-10">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={logout}
                    className={`w-full text-left px-4 py-2 ${
                      active ? "bg-gray-100 dark:bg-gray-700" : ""
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

      {/* Outlet for child pages */}
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
