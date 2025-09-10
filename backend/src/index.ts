import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2'; // Explicitly import Strategy
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { Octokit } from '@octokit/rest';

// Define User interface to include custom properties
interface User {
  githubId: string;
  username: string;
  avatarUrl?: string;
  accessToken: string;
}

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
    },
    (accessToken: string, refreshToken: string, profile: any, done: any) => {
      const user: User = {
        githubId: profile.id,
        username: profile.username,
        avatarUrl: profile.photos?.[0]?.value,
        accessToken,
      };
      return done(null, user);
    }
  )
);

// Serialize user to store only the githubId in the session
passport.serializeUser((user: any, done) => {
  done(null, (user as User).githubId); // Cast to User to access githubId
});

// Deserialize user from session ID, rehydrate with full user data (simplified)
passport.deserializeUser((id: string, done) => {
  // In a real app, fetch from a database; here, we simulate with minimal data
  const user: User = { githubId: id, username: 'temp', accessToken: '', avatarUrl: '' } as User;
  // Note: In production, fetch the full user (including accessToken) from a store
  done(null, user);
});

// Routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email', 'repo'] }));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    res.redirect('http://localhost:3000');
  }
);

app.get('/api/user', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('http://localhost:3000');
  });
});

app.get('/', (req, res) => {
  res.send('CodeForge Backend Running');
});

// GitHub API Endpoint
app.post('/api/github/push', async (req, res) => {
  console.log('Push request received:', req.body);
  if (!req.user || !(req.user as User).accessToken) {
    console.log('Authentication failed - user or accessToken missing:', req.user);
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { repo, filePath, content } = req.body;
  const patToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  const oauthToken = (req.user as User).accessToken;
  console.log('PAT available:', patToken ? 'Yes' : 'No');
  console.log('OAuth token available:', oauthToken ? 'Yes' : 'No');
  const usedToken = patToken || oauthToken;
  console.log('Using token source:', patToken ? 'PAT' : 'OAuth');

  const octokit = new Octokit({
    auth: usedToken,
  });

  try {
    const [owner, repoName] = repo.split('/');
    console.log(`Attempting to push to ${owner}/${repoName}/${filePath}`);
    await octokit.repos.getContent({
      owner,
      repo: repoName,
      path: filePath,
    }).catch(async () => {
      console.log(`Creating/updating file ${filePath}`);
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo: repoName,
        path: filePath,
        message: 'Update code from CodeForge',
        content: Buffer.from(content).toString('base64'),
        author: {
          name: (req.user as User).username || 'Unknown',
          email: `${(req.user as User).githubId || 'unknown'}@users.noreply.github.com`,
        },
      });
    });
    res.json({ message: 'Code pushed to GitHub successfully' });
  } catch (error: any) {
    console.error('GitHub push error:', error.message, error.response?.data);
    res.status(500).json({ message: 'Failed to push to GitHub', error: error.message });
  }
});

// Socket.io Setup
const server = require('http').createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('codeChange', (data) => {
    socket.broadcast.emit('codeChange', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with Socket.io`);
});