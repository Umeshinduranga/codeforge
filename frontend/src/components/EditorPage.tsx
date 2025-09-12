import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

interface User {
  githubId: string;
  username: string;
  avatarUrl?: string;
  isAuthenticated: boolean;
}

const EditorPage = () => {
  const [code, setCode] = useState('// Write your code here');
  const [repo, setRepo] = useState('Umeshinduranga/codeforge-test');
  const [filePath, setFilePath] = useState('index.js');
  const [lastEditor, setLastEditor] = useState('Anonymous');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (user?.isAuthenticated) {
      initializeSocket();
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user', { 
        withCredentials: true 
      });
      setUser(response.data);
    } catch (error) {
      console.log('User not authenticated');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeSocket = () => {
    socketRef.current = io('http://localhost:5000', { 
      withCredentials: true 
    });
    
    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('codeChange', (data) => {
      setCode(data.code);
      setLastEditor(data.user || 'Anonymous');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    
    if (socketRef.current && user) {
      socketRef.current.emit('codeChange', { 
        code: newCode, 
        user: user.username 
      });
    }
  };

  const handleLogin = () => {
    // Redirect to GitHub OAuth
    window.location.href = 'http://localhost:5000/auth/github';
  };

  const handleLogout = () => {
    // Redirect to logout endpoint
    window.location.href = 'http://localhost:5000/logout';
  };

  const handlePush = async () => {
    if (!user?.isAuthenticated) {
      alert('Please login with GitHub first to push code');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/github/push', 
        { repo, filePath, content: code }, 
        { withCredentials: true }
      );
      alert(response.data.message || 'Code pushed successfully!');
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert('Authentication required. Please login with GitHub first.');
        handleLogin();
      } else {
        alert(`Push failed: ${error.response?.data?.error || error.response?.data?.message || 'Unknown error'} (Status: ${error.response?.status})`);
      }
      console.error('Push error:', error.response?.data);
    }
  };

  const handleAnalyze = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/analyze', { code });
      alert(response.data.warning || response.data.message);
    } catch (error) {
      alert('Analysis service not available');
    }
  };

  if (isLoading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h1>Code Editor</h1>
        
        {user?.isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
            <span>Welcome, {user.username}!</span>
            {user.avatarUrl && (
              <img 
                src={user.avatarUrl} 
                alt="Avatar" 
                style={{ width: '30px', height: '30px', borderRadius: '50%' }} 
              />
            )}
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={handleLogin} style={{ 
              backgroundColor: '#238636', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              Login with GitHub
            </button>
          </div>
        )}
      </div>

      {!user?.isAuthenticated && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '4px', 
          padding: '10px', 
          marginBottom: '20px' 
        }}>
          <strong>Notice:</strong> You need to login with GitHub to push code to repositories.
        </div>
      )}

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="Repository (e.g., Umeshinduranga/codeforge-test)"
          style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input
          type="text"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
          placeholder="File Path (e.g., index.js)"
          style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <Editor
        height="500px"
        defaultLanguage="javascript"
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
      />
      
      <div style={{ 
        marginTop: '10px', 
        marginBottom: '10px', 
        fontSize: '14px', 
        color: '#666' 
      }}>
        Last edit by: {lastEditor}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button 
          onClick={handlePush}
          disabled={!user?.isAuthenticated}
          style={{ 
            backgroundColor: user?.isAuthenticated ? '#238636' : '#ccc', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '6px',
            cursor: user?.isAuthenticated ? 'pointer' : 'not-allowed'
          }}
        >
          Push to GitHub
        </button>
        <button 
          onClick={handleAnalyze}
          style={{ 
            backgroundColor: '#0969da', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Analyze Code
        </button>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default EditorPage;