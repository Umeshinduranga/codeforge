import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './FileBrowser.module.css';

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  sha: string;
  download_url?: string;
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
}

interface FileBrowserProps {
  repository: Repository;
  onFileSelect: (filePath: string, content: string) => void;
  onClose: () => void;
}

const FileBrowser: React.FC<FileBrowserProps> = ({ repository, onFileSelect, onClose }) => {
  const [contents, setContents] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [pathHistory, setPathHistory] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContents(currentPath);
  }, [currentPath, repository]);

  const fetchContents = async (path: string) => {
    setIsLoading(true);
    setError(null);

    console.log(`Fetching contents for: ${repository.owner.login}/${repository.name}, path: "${path}"`);
    
    try {
      const url = `http://localhost:5000/api/github/contents/${repository.owner.login}/${repository.name}`;
      console.log('Request URL:', url);
      console.log('Request params:', { path });
      
      const response = await axios.get(url, { 
        params: { path },
        withCredentials: true 
      });
      
      console.log('Response received:', response.data);
      
      setContents(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error: any) {
      console.error('Failed to fetch repository contents:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      
      let errorMessage = 'Failed to load repository contents';
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 401:
            errorMessage = 'Authentication required. Please login again.';
            break;
          case 403:
            errorMessage = 'Access denied. Check repository permissions.';
            break;
          case 404:
            errorMessage = 'Repository not found or path does not exist.';
            break;
          case 500:
            errorMessage = data?.message || 'Server error occurred.';
            break;
          default:
            errorMessage = data?.message || data?.error || `HTTP ${status} error`;
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check if the backend server is running on port 5000.';
      } else {
        // Other error
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      setError(errorMessage);
      setContents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = async (item: FileItem) => {
    if (item.type === 'dir') {
      // Navigate into directory
      const newPath = item.path;
      setCurrentPath(newPath);
      setPathHistory(prev => [...prev, newPath]);
    } else {
      // Load file content
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/github/file/${repository.owner.login}/${repository.name}`,
          { 
            params: { path: item.path },
            withCredentials: true 
          }
        );
        
        onFileSelect(item.path, response.data.content || '');
        onClose();
      } catch (error: any) {
        console.error('Failed to fetch file content:', error);
        setError(error.response?.data?.message || 'Failed to load file content');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const navigateBack = () => {
    if (pathHistory.length > 1) {
      const newHistory = [...pathHistory];
      newHistory.pop(); // Remove current path
      const previousPath = newHistory[newHistory.length - 1];
      
      setPathHistory(newHistory);
      setCurrentPath(previousPath);
    }
  };

  const navigateToPath = (targetPath: string, index: number) => {
    setCurrentPath(targetPath);
    setPathHistory(prev => prev.slice(0, index + 1));
  };

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'dir') {
      return (
        <svg className={styles.folderIcon} fill="currentColor" viewBox="0 0 20 20" width="16" height="16">
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
      );
    }
    
    // Get file extension for icon
    const extension = item.name.split('.').pop()?.toLowerCase();
    
    if (['js', 'jsx', 'ts', 'tsx'].includes(extension || '')) {
      return (
        <svg className={styles.jsIcon} fill="currentColor" viewBox="0 0 20 20" width="16" height="16">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
    }
    
    return (
      <svg className={styles.fileIcon} fill="currentColor" viewBox="0 0 20 20" width="16" height="16">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const breadcrumbPaths = pathHistory.map((path, index) => ({
    name: path === '' ? repository.name : path.split('/').pop() || path,
    path: path,
    index
  }));

  return (
    <div className={styles.fileBrowserOverlay}>
      <div className={styles.fileBrowserModal}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h2 className={styles.title}>
              Browse Repository: {repository.full_name}
            </h2>
            <div className={styles.breadcrumb}>
              {breadcrumbPaths.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className={styles.breadcrumbSeparator}>/</span>}
                  <button
                    className={styles.breadcrumbItem}
                    onClick={() => navigateToPath(crumb.path, crumb.index)}
                  >
                    {crumb.name}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.toolbar}>
          {pathHistory.length > 1 && (
            <button className={styles.backButton} onClick={navigateBack}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
        </div>

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading repository contents...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>Error: {error}</p>
              <button 
                className={styles.retryButton} 
                onClick={() => fetchContents(currentPath)}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className={styles.fileList}>
              {contents.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>This directory is empty</p>
                </div>
              ) : (
                contents
                  .sort((a, b) => {
                    // Directories first, then files
                    if (a.type === 'dir' && b.type === 'file') return -1;
                    if (a.type === 'file' && b.type === 'dir') return 1;
                    return a.name.localeCompare(b.name);
                  })
                  .map((item) => (
                    <div
                      key={item.path}
                      className={styles.fileItem}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className={styles.fileInfo}>
                        {getFileIcon(item)}
                        <span className={styles.fileName}>{item.name}</span>
                        {item.type === 'dir' && (
                          <svg className={styles.chevron} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                      {item.type === 'file' && item.size && (
                        <span className={styles.fileSize}>
                          {formatFileSize(item.size)}
                        </span>
                      )}
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileBrowser;