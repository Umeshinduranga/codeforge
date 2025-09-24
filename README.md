# revit - AI-Powered Code Review Platform

[![GitHub Repo stars](https://img.shields.io/github/stars/Umeshinduranga/code-review?style=social)](https://github.com/Umeshinduranga/code-review)
[![GitHub issues](https://img.shields.io/github/issues/Umeshinduranga/code-review)](https://github.com/Umeshinduranga/code-review/issues)
[![GitHub license](https://img.shields.io/github/license/Umeshinduranga/code-review)](https://github.com/Umeshinduranga/code-review/blob/main/LICENSE)

**AI-powered code review with real-time collaboration and bug prediction 📌**

## 🚀 Quick Start (30 seconds)

```bash
git clone https://github.com/Umeshinduranga/revit.git
cd revit/frontend
npm install
npm start
```

Then open **http://localhost:3000** in your browser!

This is a web-based platform designed to revolutionize how developers collaborate on code reviews. It builds on traditional tools like GitHub Pull Requests by integrating machine learning for proactive bug detection, real-time editing, and privacy-focused federated learning. Whether you're a team debugging a complex merge or a solo developer simulating runtime errors, CodeForge saves time and reduces errors.

## Features
- **Real-Time Collaborative Editing**: Edit code simultaneously with teammates using Monaco Editor (the same as VS Code) and Socket.io for instant syncing.
- **GitHub Integration**: Log in with GitHub OAuth and push code directly to your repositories.
- **Bug Prediction (Planned)**: AI models (using TensorFlow.js) simulate code execution to forecast issues like memory leaks or race conditions.
- **Federated Learning**: Anonymized review data improves AI suggestions without central storage, ensuring privacy.
- **AR-Enhanced Diff Views (Future)**: Visualize code changes in 3D using WebAR for intuitive merges.

## Tech Stack
- **Frontend**: React.js with TypeScript, Monaco Editor, Socket.io-client, Axios, React Router.
- **Backend**: Node.js/Express with TypeScript, Passport.js for OAuth, Socket.io, Octokit for GitHub API.
- **Database**: MongoDB with Mongoose (configurable for PostgreSQL).
- **Other**: Docker for containerization, GitHub Actions for CI/CD.

## Prerequisites
- Node.js (v18+)
- Yarn (recommended for package management)
- GitHub account (for OAuth and testing pushes)
- MongoDB (local or Atlas for cloud)

## Quick Start (Merged Setup)

> **⚡ NEW: Both frontend and backend now run from a single command!**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Umeshinduranga/revit.git
   cd revit
   ```

2. **Navigate to Frontend Directory**:
   ```bash
   cd frontend
   ```

3. **Install All Dependencies** (frontend + backend):
   ```bash
   npm install
   ```

4. **Start Both Servers**:
   ```bash
   npm start
   ```
   This single command will start:
   - **Backend server** on http://localhost:5000
   - **Frontend development server** on http://localhost:3000

5. **Open Your Browser**:
   - Visit http://localhost:3000 to use the application
   - Backend API available at http://localhost:5000

## Environment Setup

The `.env` file is already configured in the `frontend/` directory with:
```env
REACT_APP_PORT=3000
SERVER_PORT=5000
MONGODB_URI=mongodb://localhost:27017/codeforge
SESSION_SECRET=mysecretkey123
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback
GITHUB_PERSONAL_ACCESS_TOKEN=your_pat_here
```

**To set up GitHub OAuth**:
1. Go to https://github.com/settings/applications > New OAuth App
2. Homepage URL: `http://localhost:3000`
3. Authorization callback URL: `http://localhost:5000/auth/github/callback`
4. Copy Client ID and Secret to the `.env` file

## Available Scripts

From the `frontend/` directory:

- `npm start` - **Runs both frontend and backend servers**
- `npm run client` - Runs only the React development server
- `npm run server` - Runs only the backend server
- `npm run build` - Builds the frontend for production
- `npm run build-server` - Builds the backend TypeScript files

5. **Database Setup** (Optional for MVP):
   - Install MongoDB locally or use MongoDB Atlas (free tier).
   - Update `MONGODB_URI` in `.env` if using Atlas.

## How to Run

### Step-by-Step:

1. **Clone and Setup**:
   ```bash
   git clone https://github.com/Umeshinduranga/revit.git
   cd revit/frontend
   npm install
   ```

2. **Start the Application**:
   ```bash
   npm start
   ```

3. **Access the Application**:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000

### Development Features:
- ✅ **Hot Reloading**: Both frontend and backend restart automatically on file changes
- ✅ **Real-time Collaboration**: Multiple users can edit simultaneously
- ✅ **GitHub Integration**: Login with GitHub OAuth and push code directly
- ✅ **Socket.io**: Instant synchronization between users

## Usage
1. **Login**: Visit http://localhost:3000 and click "Login with GitHub".
2. **Collaborate**: Navigate to "Code Editor" to start editing. Open multiple tabs for real-time sync.
3. **Push to GitHub**: Enter your repo (e.g., `Umeshinduranga/codeforge-test`), file path (e.g., `index.js`), and click "Push to GitHub".
4. **Analyze Code** (Future Feature): Use the "Analyze Code" button for AI bug checks.

### Example Workflow
- Log in and open the editor.
- Type: `console.log('Hello World');`
- In another tab, see the change instantly.
- Push to `Umeshinduranga/test-repo`—check GitHub for the new `index.js` file.

## Project Structure (Merged Setup)
```
revit/
├── backend/                  # Legacy backend (deprecated)
├── frontend/                 # Main development directory
│   ├── src/
│   │   ├── backend/          # Express server & API
│   │   │   ├── index.ts      # Main server with routes and Socket.io
│   │   │   └── models/       # User schemas (MongoDB)
│   │   ├── components/
│   │   │   └── EditorPage.tsx # Code editor with push and analyze
│   │   ├── App.tsx           # Main app with routing
│   │   └── index.tsx         # React entry point
│   ├── .env                  # Environment variables
│   ├── package.json          # Combined frontend + backend dependencies
│   ├── tsconfig.json         # Frontend TypeScript config
│   └── tsconfig.backend.json # Backend TypeScript config
├── docs/                     # Documentation
└── README.md                 # This file
```

## Contributing
1. Fork the repository.
2. Create a branch (`git checkout -b feature/amazing-feature`).
3. Commit changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
- Repository: [https://github.com/Umeshinduranga/code-review](https://github.com/Umeshinduranga/code-review)
- Issues: [Create a new issue](https://github.com/Umeshinduranga/code-review/issues/new)

---

**⭐ Star this repo if it helps you!** 🚀
