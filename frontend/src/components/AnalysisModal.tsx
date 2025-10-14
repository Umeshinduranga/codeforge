import React from 'react';
import styles from './AnalysisModal.module.css';

interface Issue {
  type: string;
  severity: 'error' | 'warning' | 'info';
  line: number;
  message: string;
  suggestion: string;
}

interface Suggestion {
  type: string;
  priority: string;
  message: string;
  impact: string;
}

interface AnalysisResult {
  metrics: {
    linesOfCode: number;
    nonEmptyLines: number;
    comments: number;
    commentRatio: number;
    averageLineLength: number;
    language: string;
  };
  issues: Issue[];
  suggestions: Suggestion[];
  score: number;
  complexity: {
    cyclomatic: number;
    functions: number;
    maxNesting: number;
    complexity: string;
  };
  summary: {
    quality: string;
    score: number;
    totalIssues: number;
    breakdown: {
      errors: number;
      warnings: number;
      info: number;
    };
    recommendation: string;
  };
}

interface Props {
  analysis: AnalysisResult;
  onClose: () => void;
}

const AnalysisModal: React.FC<Props> = ({ analysis, onClose }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '🔵';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return styles.scoreExcellent;
    if (score >= 60) return styles.scoreGood;
    if (score >= 40) return styles.scoreFair;
    return styles.scorePoor;
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <span className={styles.titleIcon}>🔍</span>
            Code Analysis Results
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Overall Score */}
          <div className={styles.scoreSection}>
            <div className={styles.scoreCard}>
              <div className={`${styles.scoreCircle} ${getScoreColor(analysis.score)}`}>
                <span className={styles.scoreNumber}>{analysis.score}</span>
                <span className={styles.scoreLabel}>Score</span>
              </div>
              <div className={styles.scoreDetails}>
                <h3 className={styles.qualityTitle}>Quality: {analysis.summary.quality}</h3>
                <p className={styles.recommendation}>{analysis.summary.recommendation}</p>
                <div className={styles.issueBreakdown}>
                  <span className={styles.issueCount}>
                    🚨 {analysis.summary.breakdown.errors} Errors
                  </span>
                  <span className={styles.issueCount}>
                    ⚠️ {analysis.summary.breakdown.warnings} Warnings
                  </span>
                  <span className={styles.issueCount}>
                    ℹ️ {analysis.summary.breakdown.info} Info
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Code Metrics */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              📊 Code Metrics
            </h3>
            <div className={styles.metricsGrid}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Language</span>
                <span className={styles.metricValue}>{analysis.metrics.language}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Lines of Code</span>
                <span className={styles.metricValue}>{analysis.metrics.linesOfCode}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Non-Empty Lines</span>
                <span className={styles.metricValue}>{analysis.metrics.nonEmptyLines}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Comments</span>
                <span className={styles.metricValue}>{analysis.metrics.comments}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Comment Ratio</span>
                <span className={styles.metricValue}>{(analysis.metrics.commentRatio * 100).toFixed(1)}%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Avg Line Length</span>
                <span className={styles.metricValue}>{analysis.metrics.averageLineLength.toFixed(1)} chars</span>
              </div>
            </div>
          </div>

          {/* Complexity Analysis */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              🧮 Complexity Analysis
            </h3>
            <div className={styles.complexityGrid}>
              <div className={styles.complexityCard}>
                <span className={styles.complexityLabel}>Cyclomatic Complexity</span>
                <span className={`${styles.complexityValue} ${
                  analysis.complexity.cyclomatic <= 10 ? styles.complexityLow :
                  analysis.complexity.cyclomatic <= 20 ? styles.complexityMedium : styles.complexityHigh
                }`}>
                  {analysis.complexity.cyclomatic}
                </span>
                <span className={styles.complexityDescription}>
                  {analysis.complexity.complexity} Complexity
                </span>
              </div>
              <div className={styles.complexityCard}>
                <span className={styles.complexityLabel}>Functions</span>
                <span className={styles.complexityValue}>{analysis.complexity.functions}</span>
                <span className={styles.complexityDescription}>Function Count</span>
              </div>
              <div className={styles.complexityCard}>
                <span className={styles.complexityLabel}>Max Nesting</span>
                <span className={`${styles.complexityValue} ${
                  analysis.complexity.maxNesting <= 3 ? styles.complexityLow :
                  analysis.complexity.maxNesting <= 5 ? styles.complexityMedium : styles.complexityHigh
                }`}>
                  {analysis.complexity.maxNesting}
                </span>
                <span className={styles.complexityDescription}>Nesting Levels</span>
              </div>
            </div>
          </div>

          {/* Issues */}
          {analysis.issues.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                🚨 Issues Found ({analysis.issues.length})
              </h3>
              <div className={styles.issuesList}>
                {analysis.issues.map((issue, index) => (
                  <div key={index} className={`${styles.issue} ${styles[`issue${issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}`]}`}>
                    <div className={styles.issueHeader}>
                      <span className={styles.issueIcon}>
                        {getSeverityIcon(issue.severity)}
                      </span>
                      <span className={styles.issueTitle}>
                        Line {issue.line}: {issue.message}
                      </span>
                      <span className={styles.issueType}>{issue.type}</span>
                    </div>
                    <p className={styles.issueSuggestion}>
                      💡 {issue.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                💡 Improvement Suggestions ({analysis.suggestions.length})
              </h3>
              <div className={styles.suggestionsList}>
                {analysis.suggestions.map((suggestion, index) => (
                  <div key={index} className={styles.suggestion}>
                    <div className={styles.suggestionHeader}>
                      <span className={styles.suggestionIcon}>
                        {getPriorityIcon(suggestion.priority)}
                      </span>
                      <span className={styles.suggestionTitle}>
                        {suggestion.message}
                      </span>
                      <span className={styles.suggestionPriority}>
                        {suggestion.priority} priority
                      </span>
                    </div>
                    <p className={styles.suggestionImpact}>
                      📈 Impact: {suggestion.impact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.closeModalButton}>
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;