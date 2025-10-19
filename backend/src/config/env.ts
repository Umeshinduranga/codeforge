// Environment Variable Validator
// Add this to backend/src/config/env.ts

export const validateEnv = () => {
  const required = [
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'GITHUB_CALLBACK_URL',
    'SESSION_SECRET',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`  - ${key}`));
    process.exit(1);
  }

  console.log('✅ All required environment variables are set');
};

// Validate environment on startup
validateEnv();
