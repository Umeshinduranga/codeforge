import React from 'react';
import Editor from '@monaco-editor/react';

function EditorPage() {
  return (
    <div>
      <h2>Code Editor</h2>
      <Editor
        height="500px"
        defaultLanguage="javascript"
        defaultValue="// Write your code here"
        theme="vs-dark"
      />
    </div>
  );
}

export default EditorPage;