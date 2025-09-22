import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import EditorPage from './components/EditorPage';
import Home from './components/Home';
import axios from 'axios';
import styles from './components/Navbar.module.css';

interface User {
  githubId: string;
  username: string;
  avatarUrl?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch user data on mount
    axios.get('http://localhost:5000/api/user', { withCredentials: true })
      .then((response) => setUser(response.data))
      .catch(() => setUser(null));

    // Handle scroll effect for navbar
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    axios.get('http://localhost:5000/logout', { withCredentials: true })
      .then(() => {
        setUser(null);
        navigate('/');
      });
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <>
      <nav className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ''}`}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>RV</div>
          Revit
        </Link>
        
        <div className={styles.navLinks}>
          <Link 
            to="/" 
            className={`${styles.navLink} ${isActiveRoute('/') ? styles.navLinkActive : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/editor" 
            className={`${styles.navLink} ${isActiveRoute('/editor') ? styles.navLinkActive : ''}`}
          >
            Editor
          </Link>
        </div>

        <div className={styles.userSection}>
          {user ? (
            <div className={styles.userInfo}>
              {user.avatarUrl && (
                <img 
                  src={user.avatarUrl} 
                  alt={user.username}
                  className={styles.userAvatar}
                />
              )}
              <span className={styles.userName}>Welcome, {user.username}!</span>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </div>
          ) : (
            <a href="http://localhost:5000/auth/github" className={styles.loginButton}>
              <svg className={styles.buttonIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              Login with GitHub
            </a>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </>
  );
}

export default App;