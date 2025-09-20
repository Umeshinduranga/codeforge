# revit - AI-Powered Code Review Platform

[![GitHub Repo stars](https://img.shields.io/github/stars/Umeshinduranga/code-review?style=social)](https://github.com/Umeshinduranga/code-review)
[![GitHub issues](https://img.shields.io/github/issues/Umeshinduranga/code-review)](https://github.com/Umeshinduranga/code-review/issues)
[![GitHub license](https://img.shields.io/github/license/Umeshinduranga/code-review)](https://github.com/Umeshinduranga/code-review/blob/main/LICENSE)

**AI-powered code review with real-time collaboration and bug prediction 📌**

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

## Installation
1. **Clone the Repository**:
   ```
   https://github.com/Umeshinduranga/revit.git
   cd revit
   ```

2. **Backend Setup**:
   ```
   cd backend
   yarn install
   ```
   - Create a `.env` file in `backend/`:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/codeforge
     SESSION_SECRET=your_random_secret_string  # Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
     GITHUB_CLIENT_ID=your_github_client_id
     GITHUB_CLIENT_SECRET=your_github_client_secret
     GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback
     GITHUB_PERSONAL_ACCESS_TOKEN=your_pat_here  # Optional fallback for pushes
     ```
   - Set up GitHub OAuth App:
     - Go to https://github.com/settings/applications > New OAuth App.
     - Homepage URL: `http://localhost:3000`
     - Authorization callback URL: `http://localhost:5000/auth/github/callback`
     - Copy Client ID and Secret to `.env`.

3. **Frontend Setup**:
   ```
   cd ../frontend
   yarn install
   ```

4. **Start the Servers**:
   - Backend: `cd backend && yarn start` (runs on http://localhost:5000).
   - Frontend: `cd frontend && yarn start` (runs on http://localhost:3000).

5. **Database Setup** (Optional for MVP):
   - Install MongoDB locally or use MongoDB Atlas (free tier).
   - Update `MONGODB_URI` in `.env` if using Atlas.

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

## Project Structure
```
revit/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Main server with routes and Socket.io
│   │   └── models/           # User schemas (MongoDB)
│   ├── .env                  # Environment variables
│   └── package.json          # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── EditorPage.tsx # Code editor with push and analyze
│   │   ├── App.tsx           # Main app with routing
│   │   └── index.tsx         # React entry point
│   └── package.json          # Frontend dependencies
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
