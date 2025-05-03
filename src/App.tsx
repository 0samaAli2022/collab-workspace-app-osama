import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import NotFoundPage from './pages/NotFoundPage'
import WorkspaceDashboard from './pages/WorkspaceDashboard'
import WorkspaceDetails from './pages/WorkspaceDetails'
import Layout from './layouts/Layout'
import BoardDetailsPage from './pages/BoardDetails'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<WorkspaceDashboard />} />
          <Route path="/workspace/:workspaceId" element={<WorkspaceDetails />} />
          <Route path="/workspace/:workspaceId/board/:boardId" element={<BoardDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
