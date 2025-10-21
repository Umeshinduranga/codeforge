import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.homePage}>
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroBackground}>
            <div className={styles.heroGlow}></div>
            <div className={styles.heroGrid}></div>
          </div>
          
          <div className={styles.heroContent}>
            <div className={styles.heroLabel}>
              <span className={styles.labelIcon}>⚡</span>
              Next-Gen Code Editor
              <span className={styles.labelBadge}>Pro</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              <span className={styles.titleMain}>CodeForge</span>
              <span className={styles.titleGradient}>Revolution</span>
            </h1>
            
            <p className={styles.heroSubtitle}>
              Transform your coding experience with <strong>real-time collaboration</strong>, 
              intelligent <strong>AI analysis</strong>, and seamless <strong>GitHub integration</strong>. 
              Join thousands of developers building the future, one line at a time.
            </p>
            
            <div className={styles.heroTags}>
              <span className={styles.heroTag}>
                <svg className={styles.tagIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free & Open Source
              </span>
              <span className={styles.heroTag}>
                <svg className={styles.tagIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Lightning Fast
              </span>
              <span className={styles.heroTag}>
                <svg className={styles.tagIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Enterprise Security
              </span>
            </div>
            
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <div className={styles.statIcon}>👥</div>
                <span className={styles.statNumber}>15K+</span>
                <span className={styles.statLabel}>Active Developers</span>
              </div>
              <div className={styles.stat}>
                <div className={styles.statIcon}>🚀</div>
                <span className={styles.statNumber}>100K+</span>
                <span className={styles.statLabel}>Projects Built</span>
              </div>
              <div className={styles.stat}>
                <div className={styles.statIcon}>⚡</div>
                <span className={styles.statNumber}>99.9%</span>
                <span className={styles.statLabel}>Uptime SLA</span>
              </div>
              <div className={styles.stat}>
                <div className={styles.statIcon}>⭐</div>
                <span className={styles.statNumber}>4.9/5</span>
                <span className={styles.statLabel}>User Rating</span>
              </div>
            </div>
            
            <div className={styles.heroButtons}>
              <Link to="/editor" className={styles.primaryButton}>
                <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span>Start Building</span>
                <svg className={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <a 
                href="https://github.com/Umeshinduranga/revit" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.secondaryButton}
              >
                <svg className={styles.buttonIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                <span>View Source</span>
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.featuresTitle}>
              Powerful Features
              <span className={styles.titleAccent}>for Modern Developers</span>
            </h2>
            <p className={styles.featuresSubtitle}>
              Everything you need to build, collaborate, and deploy amazing projects
            </p>
          </div>
          
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureCardGlow}></div>
              <div className={styles.featureIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Real-time Collaboration</h3>
              <p className={styles.featureDescription}>
                Work together in real-time with live cursor tracking, instant synchronization, and seamless conflict resolution.
              </p>
              <div className={styles.featureBadge}>
                <span className={styles.badgeIcon}>🚀</span>
                Live
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureCardGlow}></div>
              <div className={styles.featureIcon}>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>GitHub Integration</h3>
              <p className={styles.featureDescription}>
                Seamlessly connect with GitHub repositories, create branches, and push changes directly from the editor.
              </p>
              <div className={styles.featureBadge}>
                <span className={styles.badgeIcon}>🔗</span>
                Connected
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureCardGlow}></div>
              <div className={styles.featureIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>AI-Powered Analysis</h3>
              <p className={styles.featureDescription}>
                Get intelligent code suggestions, bug detection, and performance insights powered by advanced AI algorithms.
              </p>
              <div className={styles.featureBadge}>
                <span className={styles.badgeIcon}>🤖</span>
                Smart
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureCardGlow}></div>
              <div className={styles.featureIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Monaco Editor</h3>
              <p className={styles.featureDescription}>
                Built on VS Code's Monaco editor with syntax highlighting, IntelliSense, and advanced editing features.
              </p>
              <div className={styles.featureBadge}>
                <span className={styles.badgeIcon}>⚡</span>
                Powered
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureCardGlow}></div>
              <div className={styles.featureIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Secure & Private</h3>
              <p className={styles.featureDescription}>
                Your code is protected with enterprise-grade security, OAuth authentication, and encrypted connections.
              </p>
              <div className={styles.featureBadge}>
                <span className={styles.badgeIcon}>🔒</span>
                Secure
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureCardGlow}></div>
              <div className={styles.featureIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Developer Friendly</h3>
              <p className={styles.featureDescription}>
                Built by developers, for developers. Clean interface, keyboard shortcuts, and extensible architecture.
              </p>
              <div className={styles.featureBadge}>
                <span className={styles.badgeIcon}>❤️</span>
                Loved
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <div className={styles.ctaBackground}>
            <div className={styles.ctaGlow}></div>
          </div>
          <div className={styles.ctaContent}>
            <div className={styles.ctaBadge}>
              <span className={styles.ctaBadgeIcon}>🎉</span>
              <span>No Credit Card Required</span>
            </div>
            <h2 className={styles.ctaTitle}>
              Ready to <span className={styles.ctaGradient}>Supercharge</span> Your Coding?
            </h2>
            <p className={styles.ctaSubtitle}>
              Join 15,000+ developers building incredible projects with CodeForge. 
              Start coding in seconds, no setup required. Free forever for individuals.
            </p>
            <div className={styles.ctaFeatures}>
              <span className={styles.ctaFeature}>✓ Real-time Collaboration</span>
              <span className={styles.ctaFeature}>✓ AI Code Analysis</span>
              <span className={styles.ctaFeature}>✓ GitHub Integration</span>
              <span className={styles.ctaFeature}>✓ 24/7 Support</span>
            </div>
            <div className={styles.ctaButtons}>
              <Link to="/editor" className={styles.ctaButton}>
                <span>Get Started Free</span>
                <svg className={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a 
                href="https://github.com/Umeshinduranga/revit" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.ctaSecondaryButton}
              >
                <svg className={styles.buttonIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                <span>View Documentation</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;