import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import axios from 'axios';

function EditorPage() {
  const [code, setCode] = useState('// Write your code here');
  const [repo, setRepo] = useState('umeshdurang/codeforge-test'); // Default repo
  const [filePath, setFilePath] = useState('index.js'); // Default file path
  const editorRef = useRef<any>(null);
  const socket = io('http://localhost:5000');

  useEffect(() => {
    socket.on('codeChange', (data) => {
      if (editorRef.current && data.code !== code) {
        setCode(data.code);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [code]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && value !== code) {
      setCode(value);
      socket.emit('codeChange', { code: value });
    }
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handlePushToGitHub = async () => {
    try {
      await axios.post('http://localhost:5000/api/github/push', {
        repo,
        filePath,
        content: code,
      }, { withCredentials: true });
      alert('Code pushed to GitHub!');
    } catch (error) {
      console.error('Push error:', error);
      alert('Failed to push to GitHub');
    }
  };

  return (
    <div>
      <h2>Code Editor</h2>
      <div>
        <input
          type="text"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="Repository (e.g., umeshdurang/codeforge-test)"
        />
        <input
          type="text"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
          placeholder="File Path (e.g., index.js)"
        />
        <button onClick={handlePushToGitHub}>Push to GitHub</button>
      </div>
      <Editor
        height="500px"
        defaultLanguage="javascript"
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
      />
    </div>
  );
}

export default EditorPage;