import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import EditorPage from './components/EditorPage';
import axios from 'axios';

interface User {
  githubId: string;
  username: string;
  avatarUrl?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data on mount
    axios.get('http://localhost:5000/api/user', { withCredentials: true })
      .then((response) => setUser(response.data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    axios.get('http://localhost:5000/logout', { withCredentials: true })
      .then(() => {
        setUser(null);
        navigate('/');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <nav>
        <Link to="/">Home</Link> | <Link to="/editor">Code Editor</Link>
        {user ? (
          <span>
            Welcome, {user.username}! <button onClick={handleLogout}>Logout</button>
          </span>
        ) : (
          <a href="http://localhost:5000/auth/github">Login with GitHub</a>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<h1>Welcome to CodeForge</h1>} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </div>
  );
}

export default App;