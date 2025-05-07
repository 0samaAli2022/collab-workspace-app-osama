# Collab Workspace App

A modern collaborative workspace application built with React and Firebase, designed to help teams organize tasks and projects efficiently through a Kanban-style interface.

![Collab Workspace App](https://via.placeholder.com/800x400?text=Collab+Workspace+App)

## Features

| Feature                 | Description                                                            |
|------------------------|------------------------------------------------------------------------|
| Auth                   | Sign up, login, logout using Firebase Auth                             |
| Workspace Dashboard    | View list of workspaces you belong to                                  |
| Workspace Details      | View and create boards within a workspace                              |
| Board Details          | Drag-and-drop Kanban board (To-Do, In Progress, Done)                  |
| Task Assignment        | Assign tasks to users in the same workspace                            |
| Notifications          | Simulate notification when a task is moved to "Done"                   |
| Offline Support        | Enable local caching using Firestore offline mode                      |

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Drag and Drop**: DND Kit
- **Backend**: Firebase (Authentication, Firestore)
- **Routing**: React Router v7
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd collab-workspace-app-osama
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up Firebase
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Add your Firebase configuration to `src/config/firebase.ts`

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── componenets/       # Reusable UI components
├── config/            # Configuration files (Firebase, etc.)
├── docs/              # Project documentation
├── layouts/           # Layout components
├── pages/             # Page components
├── store/             # Zustand store definitions
├── types/             # TypeScript type definitions
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Deployment

Build the application for production:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

