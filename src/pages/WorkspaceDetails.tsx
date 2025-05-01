// pages/WorkspaceDetails.tsx
import { Link, useParams } from "react-router-dom";

const boards = [
  { id: "board1", name: "Roadmap Q3" },
  { id: "board2", name: "Marketing Plan" },
];

export default function WorkspaceDetails() {
  const { workspaceId } = useParams();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Boards</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Create Board
        </button>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {boards.map((board) => (
          <Link
            to={`/workspace/${workspaceId}/board/${board.id}`}
            key={board.id}
            className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="font-medium">{board.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
