const columns = {
    "To Do": [
      { id: "1", title: "Set up Firebase", assignedTo: "Ali" },
      { id: "2", title: "Design mockup", assignedTo: "Lina" },
    ],
    "In Progress": [{ id: "3", title: "Auth flow", assignedTo: "Osama" }],
    "Done": [],
  };
  
  export default function BoardDetails() {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Board: Q3 Roadmap</h1>
        <div className="flex gap-6 overflow-auto">
          {Object.entries(columns).map(([status, cards]) => (
            <div key={status} className="w-72 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow">
              <h2 className="font-semibold mb-2">{status}</h2>
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white dark:bg-gray-700 p-3 mb-3 rounded shadow text-sm"
                >
                  <p className="font-medium">{card.title}</p>
                  <p className="text-gray-500">Assigned to {card.assignedTo}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
  