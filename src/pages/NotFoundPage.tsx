import { FaExclamationTriangle } from "react-icons/fa";
const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <FaExclamationTriangle className="text-6xl text-red-500 mb-4" />
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        404 - Not Found
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <a
        href="/dashboard"
        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
      >
        Go Home
      </a>
    </div>
  );
};

export default NotFoundPage;
