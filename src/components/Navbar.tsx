import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
        Komorebi
      </div>
      <div className="navbar-links">
        <button onClick={() => navigate('/dashboard')}>Dashboard</button>
        {user?.role === 'ROLE_ADMIN' && (
          <>
            <button onClick={() => navigate('/schools/new')}>+ School</button>
            <button onClick={() => navigate('/projects/new')}>+ Project</button>
          </>
        )}
      </div>
      <div className="navbar-user">
        <span>{user?.username} ({user?.role === 'ROLE_ADMIN' ? 'Admin' : 'User'})</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}