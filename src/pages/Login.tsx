import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { saveSession } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(username, password);
      saveSession(response.data);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('User or password incorrect');
      } else {
        setError("Error: can't connect to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Komorebi</h1>
        <h2>Login</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>User</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Enter'}
          </button>
        </form>

        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}