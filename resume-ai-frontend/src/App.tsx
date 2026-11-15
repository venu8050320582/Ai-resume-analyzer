import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import JobForm from './pages/JobForm'
import JobDetails from './pages/JobDetails'
import UploadResume from './pages/UploadResume'
import Results from './pages/Results'
import ResultDetails from './pages/ResultDetails'

function AppRoutes() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/new" element={<JobForm />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/:id/edit" element={<JobForm />} />
        <Route path="/upload" element={<UploadResume />} />
        <Route path="/results" element={<Results />} />
        <Route path="/results/:id" element={<ResultDetails />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>
}
