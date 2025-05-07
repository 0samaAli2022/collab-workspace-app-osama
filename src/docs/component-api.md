# Collab Workspace App - Component and API Documentation

This document provides detailed information about the components and APIs used in the Collab Workspace App.

## Table of Contents

1. [Components](#components)
   - [Layout Components](#layout-components)
   - [Page Components](#page-components)
   - [UI Components](#ui-components)
2. [Zustand Stores](#zustand-stores)
3. [Firebase API Integration](#firebase-api-integration)
4. [Type Definitions](#type-definitions)

## Components

### Layout Components

#### Layout.tsx

The main layout component that wraps all pages and provides common UI elements.

**Props:**
```typescript
interface LayoutProps {
  children: React.ReactNode;
}
```

**Usage:**
```tsx
<Layout>
  <YourPageComponent />
</Layout>
```

**Key Features:**
- Navigation bar with user profile
- Sidebar navigation (when authenticated)
- Responsive design for mobile and desktop

### Page Components

#### Auth.tsx

Authentication page that handles user login and registration.

**Key Features:**
- Email/password authentication
- Form validation
- Error handling
- Redirect to dashboard after successful authentication

**Usage:**
```tsx
<Auth />
```

#### WorkspaceDashboard.tsx

Dashboard page that displays all workspaces the user belongs to.

**Key Features:**
- List of workspaces
- Create new workspace functionality
- Workspace filtering and sorting

**Usage:**
```tsx
<WorkspaceDashboard />
```

#### WorkspaceDetails.tsx

Page that displays details of a specific workspace and its boards.

**Props:**
```typescript
// Uses React Router parameters
// Access workspaceId via useParams hook
```

**Key Features:**
- Workspace information
- List of boards
- Create new board functionality
- Member management

**Usage:**
```tsx
<WorkspaceDetails />
```

#### BoardDetails.tsx

Kanban board page that displays tasks organized by status.

**Props:**
```typescript
// Uses React Router parameters
// Access boardId via useParams hook
```

**Key Features:**
- Drag-and-drop Kanban board
- Task creation and editing
- Task assignment
- Status updates

**Usage:**
```tsx
<BoardDetails />
```

#### NotFoundPage.tsx

404 page displayed when a route is not found.

**Key Features:**
- Error message
- Navigation back to dashboard

**Usage:**
```tsx
<NotFoundPage />
```

### UI Components

#### CreateWorkspaceModal.tsx

Modal for creating a new workspace.

**Props:**
```typescript
interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWorkspace: (workspace: WorkspaceInput) => void;
}
```

**Usage:**
```tsx
<CreateWorkspaceModal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
  onCreateWorkspace={handleCreateWorkspace} 
/>
```

#### CreateBoardModal.tsx

Modal for creating a new board within a workspace.

**Props:**
```typescript
interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  onCreateBoard: (board: BoardInput) => void;
}
```

**Usage:**
```tsx
<CreateBoardModal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
  workspaceId={workspaceId}
  onCreateBoard={handleCreateBoard} 
/>
```

#### TaskColumn.tsx

Column component for the Kanban board.

**Props:**
```typescript
interface TaskColumnProps {
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  tasks: Task[];
  onAddTask?: () => void;
}
```

**Usage:**
```tsx
<TaskColumn 
  title="To Do" 
  status="todo" 
  tasks={todoTasks} 
  onAddTask={handleAddTask} 
/>
```

#### TaskCard.tsx

Card component for individual tasks.

**Props:**
```typescript
interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}
```

**Usage:**
```tsx
<TaskCard task={task} onClick={() => handleTaskClick(task.id)} />
```

#### TaskModal.tsx

Modal for creating or editing tasks.

**Props:**
```typescript
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task; // If provided, edit mode; otherwise, create mode
  boardId: string;
  onSave: (task: TaskInput) => void;
}
```

**Usage:**
```tsx
<TaskModal 
  isOpen={isTaskModalOpen} 
  onClose={() => setIsTaskModalOpen(false)} 
  task={selectedTask} 
  boardId={boardId}
  onSave={handleSaveTask} 
/>
```

#### EmptyState.tsx

Component displayed when there is no data to show.

**Props:**
```typescript
interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}
```

**Usage:**
```tsx
<EmptyState 
  title="No workspaces found" 
  description="Create your first workspace to get started" 
  actionLabel="Create Workspace" 
  onAction={handleCreateWorkspace} 
  icon={<FolderIcon className="w-12 h-12" />} 
/>
```

#### Spinner.tsx

Loading spinner component.

**Props:**
```typescript
interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}
```

**Usage:**
```tsx
<Spinner size="medium" color="#4F46E5" />
```

## Zustand Stores

### useAuthStore.ts

Store for managing authentication state.

**State:**
```typescript
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetError: () => void;
}
```

**Usage:**
```tsx
const { user, isLoading, error, login, logout } = useAuthStore();
```

### useWorkspacesStore.ts

Store for managing workspaces data.

**State:**
```typescript
interface WorkspacesState {
  workspaces: Workspace[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchWorkspaces: () => Promise<void>;
  createWorkspace: (workspace: WorkspaceInput) => Promise<string>;
  updateWorkspace: (id: string, workspace: Partial<WorkspaceInput>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  resetError: () => void;
}
```

**Usage:**
```tsx
const { workspaces, isLoading, createWorkspace } = useWorkspacesStore();
```

### useBoardsStore.ts

Store for managing boards data.

**State:**
```typescript
interface BoardsState {
  boards: Board[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchBoards: (workspaceId: string) => Promise<void>;
  createBoard: (board: BoardInput) => Promise<string>;
  updateBoard: (id: string, board: Partial<BoardInput>) => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
  resetError: () => void;
}
```

**Usage:**
```tsx
const { boards, isLoading, fetchBoards, createBoard } = useBoardsStore();
```

### useTasksStore.ts

Store for managing tasks data.

**State:**
```typescript
interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTasks: (boardId: string) => Promise<void>;
  createTask: (task: TaskInput) => Promise<string>;
  updateTask: (id: string, task: Partial<TaskInput>) => Promise<void>;
  updateTaskStatus: (id: string, status: 'todo' | 'in-progress' | 'done') => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  resetError: () => void;
}
```

**Usage:**
```tsx
const { tasks, isLoading, createTask, updateTaskStatus } = useTasksStore();
```

## Firebase API Integration

### Authentication

**Login:**
```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};
```

**Register:**
```typescript
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';

const register = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};
```

**Logout:**
```typescript
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};
```

### Firestore

**Fetch Documents:**
```typescript
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

const fetchWorkspaces = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'workspaces'),
      where('members', 'array-contains', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};
```

**Create Document:**
```typescript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const createWorkspace = async (workspace) => {
  try {
    const docRef = await addDoc(collection(db, 'workspaces'), workspace);
    return docRef.id;
  } catch (error) {
    throw error;
  }
};
```

**Update Document:**
```typescript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const updateWorkspace = async (id, data) => {
  try {
    const docRef = doc(db, 'workspaces', id);
    await updateDoc(docRef, data);
  } catch (error) {
    throw error;
  }
};
```

**Delete Document:**
```typescript
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const deleteWorkspace = async (id) => {
  try {
    const docRef = doc(db, 'workspaces', id);
    await deleteDoc(docRef);
  } catch (error) {
    throw error;
  }
};
```

## Type Definitions

### User Types

```typescript
// src/types/user.ts

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  displayName: string;
}
```

### Workspace Types

```typescript
// src/types/workspace.ts

import { Timestamp } from 'firebase/firestore';

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdBy: string; // User ID
  members: string[]; // Array of User IDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WorkspaceInput {
  name: string;
  description?: string;
  members?: string[];
}
```

### Board Types

```typescript
// src/types/board.ts

import { Timestamp } from 'firebase/firestore';

export interface Board {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  createdBy: string; // User ID
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BoardInput {
  name: string;
  description?: string;
  workspaceId: string;
}
```

### Task Types

```typescript
// src/types/task.ts

import { Timestamp } from 'firebase/firestore';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  boardId: string;
  assignedTo?: string; // User ID
  createdBy: string; // User ID
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TaskInput {
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  boardId: string;
  assignedTo?: string;
}
```