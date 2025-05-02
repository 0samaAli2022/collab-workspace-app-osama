import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import NotFoundPage from './pages/NotFoundPage'
import WorkspaceDashboard from './pages/WorkspaceDashboard'
import WorkspaceDetails from './pages/WorkspaceDetails'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<WorkspaceDashboard />} />
        <Route path="/workspace/:workspaceId" element={<WorkspaceDetails />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App
