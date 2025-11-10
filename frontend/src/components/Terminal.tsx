import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from './Terminal.module.css';
import { API_ENDPOINTS } from '../config/api';

interface TerminalProps {
  code: string;
  language: string;
  onClose?: () => void;
}

interface OutputLine {
  type: 'output' | 'error' | 'info' | 'success';
  content: string;
  timestamp: number;
}

const Terminal: React.FC<TerminalProps> = ({ code, language, onClose }) => {
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [input, setInput] = useState('');
  const outputEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Debounced auto-scroll to prevent ResizeObserver errors
    const timer = setTimeout(() => {
      outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [output]);

  const addOutput = (content: string, type: OutputLine['type'] = 'output') => {
    setOutput(prev => [...prev, { type, content, timestamp: Date.now() }]);
  };

  const clearOutput = () => {
    setOutput([]);
  };

  const executeCode = async () => {
    if (!code.trim()) {
      addOutput('No code to execute', 'error');
      return;
    }

    setIsRunning(true);
    addOutput(`▶ Running ${language} code...`, 'info');

    try {
      // Send code to backend for execution
      const response = await axios.post(
        `${API_ENDPOINTS.EXECUTE_CODE}`,
        {
          code,
          language: language.toLowerCase(),
          input: input || '',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        if (response.data.output) {
          addOutput(response.data.output, 'output');
        }
        if (response.data.executionTime) {
          addOutput(`✓ Executed in ${response.data.executionTime}ms`, 'success');
        }
      } else {
        addOutput(response.data.error || 'Execution failed', 'error');
      }
    } catch (error: any) {
      console.error('Code execution error:', error);
      if (error.response?.data?.error) {
        addOutput(error.response.data.error, 'error');
      } else if (error.message) {
        addOutput(`Error: ${error.message}`, 'error');
      } else {
        addOutput('Failed to execute code. Server may be unavailable.', 'error');
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = input.trim();
      if (command) {
        addOutput(`$ ${command}`, 'info');
        
        // Handle special commands
        if (command === 'clear' || command === 'cls') {
          clearOutput();
        } else if (command === 'run') {
          executeCode();
        } else if (command === 'help') {
          addOutput('Available commands:', 'info');
          addOutput('  run   - Execute the current code', 'output');
          addOutput('  clear - Clear terminal output', 'output');
          addOutput('  help  - Show this help message', 'output');
        } else {
          addOutput(`Command not found: ${command}`, 'error');
          addOutput('Type "help" for available commands', 'info');
        }
        
        setInput('');
      }
    }
  };

  const getLanguageIcon = (lang: string) => {
    const icons: { [key: string]: string } = {
      javascript: '🟨',
      typescript: '🔷',
      python: '🐍',
      java: '☕',
      cpp: '⚙️',
      c: '⚙️',
      go: '🐹',
      rust: '🦀',
      php: '🐘',
      ruby: '💎',
      swift: '🍎',
      kotlin: '🟣',
    };
    return icons[lang.toLowerCase()] || '📄';
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.terminal}>
      <div className={styles.terminalHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.terminalIcon}>⚡</span>
          <span className={styles.terminalTitle}>
            Terminal {getLanguageIcon(language)} {language}
          </span>
        </div>
        <div className={styles.headerRight}>
          <button
            onClick={executeCode}
            disabled={isRunning}
            className={styles.runButton}
            title="Run code (or type 'run')"
          >
            {isRunning ? (
              <>
                <span className={styles.spinner}>⟳</span> Running...
              </>
            ) : (
              <>
                <span className={styles.playIcon}>▶</span> Run
              </>
            )}
          </button>
          <button
            onClick={clearOutput}
            className={styles.clearButton}
            title="Clear output"
          >
            🗑️ Clear
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className={styles.closeButton}
              title="Close terminal"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className={styles.terminalBody}>
        <div className={styles.outputContainer}>
          {output.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>💻</div>
              <div className={styles.emptyText}>
                Terminal ready. Click "Run" or type "run" to execute code.
              </div>
              <div className={styles.emptyHint}>
                Type "help" for available commands
              </div>
            </div>
          ) : (
            output.map((line, index) => (
              <div key={index} className={`${styles.outputLine} ${styles[line.type]}`}>
                <span className={styles.timestamp}>[{formatTimestamp(line.timestamp)}]</span>
                <span className={styles.content}>{line.content}</span>
              </div>
            ))
          )}
          <div ref={outputEndRef} />
        </div>

        <div className={styles.inputContainer}>
          <span className={styles.prompt}>$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type 'run' to execute code, 'help' for commands..."
            className={styles.terminalInput}
            disabled={isRunning}
          />
        </div>
      </div>

      <div className={styles.terminalFooter}>
        <div className={styles.footerInfo}>
          <span className={styles.footerItem}>
            📊 Output lines: {output.length}
          </span>
          <span className={styles.footerItem}>
            {isRunning ? '🔴 Running' : '🟢 Ready'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
