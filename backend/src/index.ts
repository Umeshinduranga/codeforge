import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { Octokit } from '@octokit/rest';

// Define User interface
interface User {
  githubId: string;
  username: string;
  avatarUrl?: string;
  accessToken: string;
}

// In-memory user store (use database in production)
const userStore: Map<string, User> = new Map();

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Session middleware with in-memory store
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  },
});

// Middleware
app.use(cors({ 
  origin: 'http://localhost:3000', 
  credentials: true 
}));
app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Debug middleware to log session info
app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('User in session:', req.user ? (req.user as User).username : 'None');
  next();
});

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
      
      // Store user in memory
      userStore.set(profile.id, user);
      console.log('User stored:', { githubId: profile.id, username: profile.username, hasToken: !!accessToken });
      
      return done(null, user);
    }
  )
);

// Serialize user to store only the githubId in the session
passport.serializeUser((user: any, done) => {
  console.log('Serializing user:', (user as User).githubId);
  done(null, (user as User).githubId);
});

// Deserialize user from session ID, retrieve full user data from store
passport.deserializeUser((id: string, done) => {
  console.log('Deserializing user ID:', id);
  const user = userStore.get(id);
  if (user) {
    console.log('User deserialized successfully:', { githubId: id, username: user.username });
    done(null, user);
  } else {
    console.log('User not found in store:', id);
    done(new Error('User not found'), null);
  }
});

// Authentication check middleware
const requireAuth = (req: any, res: any, next: any) => {
  console.log('Auth check - User:', req.user ? (req.user as User).username : 'None');
  if (req.user) {
    next();
  } else {
    res.status(401).json({ 
      message: 'Not authenticated. Please login with GitHub first.',
      redirectUrl: '/auth/github'
    });
  }
};

// Routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email', 'repo'] }));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    console.log('GitHub callback successful, user:', req.user);
    res.redirect('http://localhost:3000/editor');
  }
);

app.get('/api/user', (req, res) => {
  console.log('User info request - Session ID:', req.sessionID);
  console.log('User in request:', req.user);
  
  if (req.user) {
    const user = req.user as User;
    console.log('User info requested:', { githubId: user.githubId, hasToken: !!user.accessToken });
    res.json({
      githubId: user.githubId,
      username: user.username,
      avatarUrl: user.avatarUrl,
      isAuthenticated: true
    });
  } else {
    res.status(401).json({ 
      message: 'Not authenticated',
      isAuthenticated: false
    });
  }
});

app.get('/logout', (req, res, next) => {
  const userId = req.user ? (req.user as User).githubId : null;
  req.logout((err) => {
    if (err) return next(err);
    
    // Remove user from store on logout
    if (userId) {
      userStore.delete(userId);
      console.log('User removed from store:', userId);
    }
    
    // Destroy session
    req.session.destroy((err: any) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.redirect('http://localhost:3000');
    });
  });
});

app.get('/', (req, res) => {
  res.send('CodeForge Backend Running');
});

// GitHub API Endpoints with authentication middleware

// List user repositories
app.get('/api/github/repos', requireAuth, async (req, res) => {
  console.log('Repository list requested');
  
  const user = req.user as User;
  console.log('Authenticated user for repo list:', { 
    githubId: user.githubId, 
    username: user.username, 
    hasAccessToken: !!user.accessToken 
  });

  if (!user.accessToken) {
    console.log('Authentication failed - user accessToken missing');
    return res.status(401).json({ message: 'Access token not available' });
  }

  try {
    const octokit = new Octokit({
      auth: user.accessToken,
    });
    
    // Get repositories for the authenticated user
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100
    });
    
    // Map the response to include only needed fields
    const repoList = repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      default_branch: repo.default_branch,
      owner: {
        login: repo.owner.login,
        avatar_url: repo.owner.avatar_url
      }
    }));

    console.log(`Retrieved ${repoList.length} repositories for user`);
    res.json(repoList);
  } catch (error: any) {
    console.error('Error fetching repositories:', error.message);
    res.status(500).json({ 
      message: 'Failed to fetch repositories',
      error: error.message 
    });
  }
});

app.post('/api/github/push', requireAuth, async (req, res) => {
  console.log('Push request received:', req.body);

  const user = req.user as User;
  console.log('Authenticated user for push:', { 
    githubId: user.githubId, 
    username: user.username, 
    hasAccessToken: !!user.accessToken 
  });

  if (!user.accessToken) {
    console.log('Authentication failed - user accessToken missing');
    return res.status(401).json({ message: 'Access token not available' });
  }

  const { repo, filePath, content, branch } = req.body;
  
  // Validate required fields
  if (!repo || !filePath || content === undefined) {
    return res.status(400).json({ message: 'Missing required fields: repo, filePath, content' });
  }

  const patToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  const oauthToken = user.accessToken;
  
  console.log('PAT available:', patToken ? 'Yes' : 'No');
  console.log('OAuth token available:', oauthToken ? 'Yes' : 'No');
  
  const usedToken = patToken || oauthToken;
  console.log('Using token source:', patToken ? 'PAT' : 'OAuth');

  const octokit = new Octokit({
    auth: usedToken,
  });

  try {
    const [owner, repoName] = repo.split('/');
    
    if (!owner || !repoName) {
      return res.status(400).json({ message: 'Invalid repo format. Expected: owner/repo' });
    }

    console.log(`Attempting to push to ${owner}/${repoName}/${filePath}`);
    
    let sha: string | undefined;
    
    try {
      // Try to get existing file
      const { data } = await octokit.repos.getContent({
        owner,
        repo: repoName,
        path: filePath,
      });
      
      if ('sha' in data) {
        sha = data.sha;
        console.log('Existing file found, will update');
      }
    } catch (error) {
      console.log('File does not exist, will create new file');
    }

    // Create or update file
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo: repoName,
      path: filePath,
      message: `Update ${filePath} from CodeForge`,
      content: Buffer.from(content).toString('base64'),
      branch: branch || 'main', // Use specified branch or default to main
      sha, // Include sha if updating existing file
      author: {
        name: user.username || 'CodeForge User',
        email: `${user.githubId}@users.noreply.github.com`,
      },
    });

    console.log('Successfully pushed to GitHub');
    res.json({ message: 'Code pushed to GitHub successfully' });
    
  } catch (error: any) {
    console.error('GitHub push error:', {
      message: error.message,
      status: error.status,
      response: error.response?.data
    });
    const errorDetails = error.response?.data?.message || error.message || 'Unknown error';
    res.status(500).json({
      message: 'Failed to push to GitHub',
      error: errorDetails,
      status: error.status
    });
  }
});

// Create a new 'revit' branch in selected repository
app.post('/api/github/create-branch', requireAuth, async (req, res) => {
  console.log('Branch creation request received:', req.body);
  
  const user = req.user as User;
  console.log('Authenticated user for branch creation:', { 
    username: user.username, 
    hasAccessToken: !!user.accessToken 
  });

  if (!user.accessToken) {
    console.log('Authentication failed - user accessToken missing');
    return res.status(401).json({ message: 'Access token not available' });
  }

  const { repo } = req.body;
  
  // Validate required fields
  if (!repo) {
    return res.status(400).json({ message: 'Missing required field: repo' });
  }

  const octokit = new Octokit({
    auth: user.accessToken,
  });

  try {
    const [owner, repoName] = repo.split('/');
    
    if (!owner || !repoName) {
      return res.status(400).json({ message: 'Invalid repo format. Expected: owner/repo' });
    }

    console.log(`Creating 'revit' branch in ${owner}/${repoName}`);
    
    // Get the default branch reference
    const { data: repoData } = await octokit.repos.get({
      owner,
      repo: repoName
    });
    
    const defaultBranch = repoData.default_branch;
    console.log(`Default branch for ${repoName} is ${defaultBranch}`);
    
    // Get the SHA of the latest commit on the default branch
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo: repoName,
      ref: `heads/${defaultBranch}`,
    });
    
    const sha = refData.object.sha;
    console.log(`Latest commit SHA: ${sha}`);
    
    try {
      // Check if the branch already exists
      await octokit.git.getRef({
        owner,
        repo: repoName,
        ref: 'heads/revit',
      });
      
      console.log('Branch "revit" already exists');
      return res.json({ 
        message: 'Branch "revit" already exists',
        branchName: 'revit',
        fullRepo: repo,
        defaultBranch
      });
    } catch (error) {
      // Branch doesn't exist, so create it
      await octokit.git.createRef({
        owner,
        repo: repoName,
        ref: 'refs/heads/revit',
        sha,
      });
      
      console.log('Successfully created "revit" branch');
      res.json({ 
        message: 'Branch "revit" created successfully', 
        branchName: 'revit',
        fullRepo: repo,
        defaultBranch
      });
    }
  } catch (error: any) {
    console.error('GitHub branch creation error:', {
      message: error.message,
      status: error.status,
      response: error.response?.data
    });
    const errorDetails = error.response?.data?.message || error.message || 'Unknown error';
    res.status(500).json({
      message: 'Failed to create branch',
      error: errorDetails,
      status: error.status
    });
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

// Share session with Socket.IO
io.use((socket, next) => {
  sessionMiddleware(socket.request as any, {} as any, next as any);
});

// Authenticate Socket.IO connection
io.use((socket, next) => {
  const req = socket.request as any;
  console.log('Socket auth check - Session:', req.session?.passport?.user);
  
  if (req.session && req.session.passport && req.session.passport.user) {
    const user = userStore.get(req.session.passport.user);
    if (user) {
      socket.data.user = user;
      console.log('Socket authenticated for user:', user.username);
      return next();
    }
  }
  
  // Allow connection even if not authenticated
  console.log('Socket connection without authentication');
  next();
});

io.on('connection', (socket) => {
  const user = socket.data.user;
  console.log('Socket connected:', user ? user.username : 'Anonymous', 'ID:', socket.id);

  socket.on('codeChange', (data) => {
    console.log('Code change from:', user ? user.username : 'Anonymous');
    // Add user info to the broadcast
    socket.broadcast.emit('codeChange', {
      ...data,
      user: user ? user.username : 'Anonymous'
    });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', user ? user.username : 'Anonymous');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with Socket.io`);
  console.log('Required environment variables:');
  console.log('- GITHUB_CLIENT_ID:', process.env.GITHUB_CLIENT_ID ? 'Set' : 'Missing');
  console.log('- GITHUB_CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET ? 'Set' : 'Missing');
  console.log('- GITHUB_CALLBACK_URL:', process.env.GITHUB_CALLBACK_URL ? 'Set' : 'Missing');
  console.log('- SESSION_SECRET:', process.env.SESSION_SECRET ? 'Set' : 'Using default');
});