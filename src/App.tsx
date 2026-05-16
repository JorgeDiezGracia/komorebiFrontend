import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SchoolForm from './pages/SchoolForm';
import ProjectForm from './pages/ProjectForm';
import { useAuth } from './context/AuthContext';


function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/schools/new" element={
        <PrivateRoute>
          <SchoolForm />
        </PrivateRoute>
      } />
      <Route path="/schools/edit/:id" element={
        <PrivateRoute>
          <SchoolForm />
        </PrivateRoute>
      } />
      <Route path="/projects/new" element={
        <PrivateRoute>
          <ProjectForm />
        </PrivateRoute>
      } />
      <Route path="/projects/edit/:id" element={
        <PrivateRoute>
          <ProjectForm />
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default App;