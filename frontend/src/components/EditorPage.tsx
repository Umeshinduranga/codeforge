import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const EditorPage = () => {
  const [code, setCode] = useState('// Write your code here');
  const [repo, setRepo] = useState('Umeshinduranga/codeforge-test');
  const [filePath, setFilePath] = useState('index.js');
  const [lastEditor, setLastEditor] = useState('Anonymous');
  const [username, setUsername] = useState('Umeshinduranga'); // Simple username for now
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    socketRef.current = io('http://localhost:5000', { withCredentials: true });
    const socket = socketRef.current;

    socket.on('codeChange', (data) => {
      setCode(data.code);
      setLastEditor(data.user || 'Anonymous');
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []); // Empty array is fine since socket URL is static

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
    if (socketRef.current) {
      socketRef.current.emit('codeChange', { code: value || '', user: username });
    }
  };

  const handlePush = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/github/push', { repo, filePath, content: code }, { withCredentials: true });
      alert(response.data.message || 'Code pushed successfully!');
    } catch (error: any) {
      alert(`Push failed: ${error.response?.data?.error || 'Unknown error'} (Status: ${error.response?.status})`);
    }
  };

  const handleAnalyze = async () => {
    const response = await axios.post('http://localhost:5000/api/analyze', { code });
    alert(response.data.warning || response.data.message);
  };

  return (
    <div>
      <h1>Code Editor</h1>
      <input
        type="text"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
        placeholder="Repository (e.g., Umeshinduranga/codeforge-test)"
      />
      <input
        type="text"
        value={filePath}
        onChange={(e) => setFilePath(e.target.value)}
        placeholder="File Path (e.g., index.js)"
      />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Your Username"
      />
      <Editor
        height="500px"
        defaultLanguage="javascript"
        value={code}
        onChange={handleEditorChange}
      />
      <div>Last edit by: {lastEditor}</div>
      <button onClick={handlePush}>Push to GitHub</button>
      <button onClick={handleAnalyze}>Analyze Code</button>
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default EditorPage;