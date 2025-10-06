import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import FileBrowser from './FileBrowser';
import styles from './EditorPage.module.css';

interface User {
  githubId: string;
  username: string;
  avatarUrl?: string;
  isAuthenticated: boolean;
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  default_branch: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const EditorPage = () => {
  const [code, setCode] = useState('// Welcome to CodeForge!\n// Start typing your code here...\n\nfunction hello() {\n  console.log("Hello, World!");\n}\n\nhello();');
  const [repo, setRepo] = useState('');
  const [filePath, setFilePath] = useState('index.js');
  const [lastEditor, setLastEditor] = useState('Anonymous');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [branch, setBranch] = useState('main');
  const [isBranchCreating, setIsBranchCreating] = useState(false);
  const [branchCreated, setBranchCreated] = useState(false);
  const [showFileBrowser, setShowFileBrowser] = useState(false);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Initialize socket connection and fetch repositories when user is authenticated
  useEffect(() => {
    if (user?.isAuthenticated) {
      initializeSocket();
      fetchRepositories();
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);
  
  // Update repo state when a repository is selected
  useEffect(() => {
    if (selectedRepo) {
      setRepo(selectedRepo.full_name);
      setBranch(selectedRepo.default_branch);
      setBranchCreated(false);
    }
  }, [selectedRepo]);

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
  
  const fetchRepositories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/github/repos', {
        withCredentials: true
      });
      setRepositories(response.data);
      console.log('Repositories fetched:', response.data.length);
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
      alert('Failed to fetch repositories. Please try again.');
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

  const createRevitBranch = async () => {
    if (!selectedRepo || !repo) {
      alert('Please select a repository first');
      return;
    }

    setIsBranchCreating(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/github/create-branch',
        { repo },
        { withCredentials: true }
      );
      
      setBranch('revit');
      setBranchCreated(true);
      alert(response.data.message || 'Branch "revit" created successfully!');
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert('Authentication required. Please login with GitHub first.');
        handleLogin();
      } else {
        alert(`Branch creation failed: ${error.response?.data?.error || error.response?.data?.message || 'Unknown error'}`);
      }
      console.error('Branch creation error:', error.response?.data);
    } finally {
      setIsBranchCreating(false);
    }
  };

  const handlePush = async () => {
    if (!user?.isAuthenticated) {
      alert('Please login with GitHub first to push code');
      return;
    }

    if (!repo) {
      alert('Please select a repository first');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/github/push', 
        { 
          repo, 
          filePath, 
          content: code,
          branch // Include the branch in the request
        }, 
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

  const handleFileSelect = (filePath: string, content: string) => {
    setFilePath(filePath);
    setCode(content);
    setShowFileBrowser(false);
  };

  const getEditorLanguage = (filePath: string) => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'py':
        return 'python';
      case 'java':
        return 'java';
      case 'cpp':
      case 'c':
        return 'cpp';
      case 'cs':
        return 'csharp';
      case 'php':
        return 'php';
      case 'rb':
        return 'ruby';
      case 'go':
        return 'go';
      case 'rs':
        return 'rust';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'scss':
        return 'scss';
      case 'json':
        return 'json';
      case 'xml':
        return 'xml';
      case 'md':
        return 'markdown';
      case 'yml':
      case 'yaml':
        return 'yaml';
      case 'sql':
        return 'sql';
      default:
        return 'javascript';
    }
  };

  const openFileBrowser = () => {
    if (!selectedRepo) {
      alert('Please select a repository first');
      return;
    }
    setShowFileBrowser(true);
  };

  if (isLoading) {
    return (
      <div className={styles.editorPage}>
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading CodeForge...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.editorPage}>
      <div className={styles.container}>
        {/* Modern Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>
              <span className={styles.titleIcon}>⚡</span>
              Code Editor
              <span className={styles.titleBadge}>Pro</span>
            </h1>
            <p className={styles.pageSubtitle}>
              Collaborative coding with real-time sync and GitHub integration
            </p>
          </div>
          {user?.isAuthenticated && (
            <div className={styles.userInfo}>
              <img 
                src={user.avatarUrl || '/default-avatar.png'} 
                alt={user.username}
                className={styles.userAvatar}
              />
              <div className={styles.userDetails}>
                <span className={styles.userName}>{user.username}</span>
                <span className={styles.userStatus}>Online</span>
              </div>
            </div>
          )}
        </div>

        {!user?.isAuthenticated && (
          <div className={styles.authRequired}>
            <span className={styles.authRequiredIcon}>🔐</span>
            <div>
              <strong className={styles.authRequiredText}>Authentication Required</strong>
              <p className={styles.authRequiredText}>
                Connect with GitHub to unlock full collaborative features and repository access.
              </p>
              <button 
                onClick={handleLogin}
                className={styles.loginButton}
              >
                <svg fill="currentColor" viewBox="0 0 20 20" className={styles.buttonIcon}>
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                Connect GitHub
              </button>
            </div>
          </div>
        )}

        <div className={styles.controlsSection}>
          {user?.isAuthenticated && repositories.length > 0 && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Select Repository
                </label>
                <select 
                  value={selectedRepo?.full_name || ''} 
                  onChange={(e) => {
                    const selected = repositories.find(r => r.full_name === e.target.value);
                    setSelectedRepo(selected || null);
                  }}
                  className={styles.select}
                >
                  <option value="">-- Select a repository --</option>
                  {repositories.map(repo => (
                    <option key={repo.id} value={repo.full_name}>
                      {repo.full_name} ({repo.default_branch})
                    </option>
                  ))}
                </select>
              </div>

              {selectedRepo && (
                <div className={styles.branchControls}>
                  <div className={styles.branchInfo}>
                    <label className={styles.label}>
                      Active Branch
                    </label>
                    <div className={styles.branchDisplay}>
                      <span className={styles.branchName}>{branch}</span>
                      {branch === 'revit' && (
                        <span className={styles.activeBadge}>
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={createRevitBranch} 
                    disabled={isBranchCreating || branch === 'revit'} 
                    className={`${styles.branchButton} ${branch === 'revit' ? styles.branchButtonActive : ''}`}
                  >
                    {isBranchCreating ? (
                      <>
                        <span className={styles.smallSpinner}></span>
                        Creating...
                      </>
                    ) : branch === 'revit' ? (
                      'Using "revit" Branch'
                    ) : (
                      'Create "revit" Branch'
                    )}
                  </button>
                </div>
              )}

              {selectedRepo && (
                <div className={styles.formGroup}>
                  <button
                    onClick={async () => {
                      try {
                        const response = await axios.get('http://localhost:5000/api/github/test', {
                          withCredentials: true
                        });
                        alert(`GitHub API Test Success: ${JSON.stringify(response.data, null, 2)}`);
                      } catch (error: any) {
                        alert(`GitHub API Test Failed: ${error.response?.data?.message || error.message}`);
                      }
                    }}
                    className={styles.testButton}
                  >
                    Test GitHub API Connection
                  </button>
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  File Path
                </label>
                <div className={styles.filePathContainer}>
                  <input
                    type="text"
                    value={filePath}
                    onChange={(e) => setFilePath(e.target.value)}
                    placeholder="e.g., src/index.js, components/App.tsx"
                    className={styles.input}
                  />
                  <button
                    onClick={openFileBrowser}
                    className={styles.browseButton}
                    disabled={!selectedRepo}
                    title="Browse repository files"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    Browse Files
                  </button>
                </div>
              </div>
            </>
          )}
          
          {!user?.isAuthenticated && (
            <div className={styles.inputRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Repository
                </label>
                <input
                  type="text"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  placeholder="e.g., username/repository-name"
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  File Path
                </label>
                <input
                  type="text"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  placeholder="e.g., index.js"
                  className={styles.input}
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles.editorContainer}>
          <div className={styles.editorWrapper}>
            <Editor
              height="500px"
              language={getEditorLanguage(filePath)}
              value={code}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                fontSize: 14,
                lineHeight: 1.6,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                padding: { top: 50, bottom: 16 },
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                folding: true,
                foldingHighlight: true,
                renderLineHighlight: 'all',
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                scrollbar: {
                  useShadows: false,
                  verticalScrollbarSize: 14,
                  horizontalScrollbarSize: 14,
                  alwaysConsumeMouseWheel: false
                }
              }}
            />
          </div>
          
          <div className={styles.lastEditor}>
            Last edit by: <strong>{lastEditor}</strong>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button 
            onClick={handlePush}
            disabled={!user?.isAuthenticated || !repo}
            className={`${styles.actionButton} ${styles.pushButton}`}
          >
            <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Push to {repo ? `${repo} (${branch})` : 'GitHub'}
          </button>
          
          <button 
            onClick={handleAnalyze}
            className={`${styles.actionButton} ${styles.analyzeButton}`}
          >
            <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Analyze Code
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className={`${styles.actionButton} ${styles.backButton}`}
          >
            <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>

        {/* File Browser Modal */}
        {showFileBrowser && selectedRepo && (
          <FileBrowser
            repository={selectedRepo}
            onFileSelect={handleFileSelect}
            onClose={() => setShowFileBrowser(false)}
          />
        )}
      </div>
    </div>
  );
};

export default EditorPage;