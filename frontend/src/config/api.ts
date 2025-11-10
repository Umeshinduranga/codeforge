// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  USER_INFO: `${API_URL}/api/user`,
  REPOSITORIES: `${API_URL}/api/github/repos`,
  CREATE_BRANCH: `${API_URL}/api/github/create-branch`,
  PUSH_CODE: `${API_URL}/api/github/push`,
  FILE_CONTENT: `${API_URL}/api/github/file`,
  REPO_CONTENTS: `${API_URL}/api/github/repos`,
  ANALYZE_CODE: `${API_URL}/api/analyze`,
  EXECUTE_CODE: `${API_URL}/api/execute`,
  GITHUB_AUTH: `${API_URL}/auth/github`,
};

// Helper function to check if running in production
export const isProduction = process.env.NODE_ENV === 'production';
