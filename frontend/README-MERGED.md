# CodeForge - Merged Frontend & Backend

This project has been merged so that both the frontend and backend run from a single command from the frontend directory.

## Quick Start

1. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```

2. Install all dependencies (both frontend and backend):
   ```powershell
   npm install
   ```

3. Start both servers concurrently:
   ```powershell
   npm start
   ```

This will start:
- **Backend server** on `http://localhost:5000`
- **Frontend development server** on `http://localhost:3000`

## Available Scripts

In the frontend directory, you can run:

- `npm start` - Runs both frontend and backend servers concurrently
- `npm run client` - Runs only the React development server
- `npm run server` - Runs only the backend server
- `npm run build` - Builds the frontend for production
- `npm run build-server` - Builds the backend TypeScript files
- `npm test` - Runs the frontend tests

## Project Structure

```
frontend/
├── src/
│   ├── backend/           # Backend source code
│   │   ├── index.ts       # Express server
│   │   └── models/        # Database models
│   ├── components/        # React components
│   └── ...               # Other frontend files
├── .env                  # Environment variables
├── package.json          # Contains both frontend and backend dependencies
├── tsconfig.json         # Frontend TypeScript config
└── tsconfig.backend.json # Backend TypeScript config
```

## Environment Variables

The `.env` file contains:
- `PORT` - Backend server port (default: 5000)
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `GITHUB_CALLBACK_URL` - GitHub OAuth callback URL
- `GITHUB_PERSONAL_ACCESS_TOKEN` - GitHub personal access token
- `SESSION_SECRET` - Session encryption secret
- `MONGODB_URI` - MongoDB connection string

## Features

- **GitHub OAuth Authentication**
- **Real-time collaborative editing** with Socket.io
- **Repository management** 
- **Code editor** with Monaco Editor
- **Git integration** for pushing code to GitHub

## Development

Both servers support hot reloading:
- Frontend changes will automatically refresh the browser
- Backend changes will automatically restart the server (via nodemon)

## Production Build

To build for production:
1. `npm run build` - Builds the frontend
2. `npm run build-server` - Builds the backend
3. Deploy the built files to your hosting platform