# 🚀 Collaboration - Quick Reference Card

## ⚡ Quick Start (30 seconds)

```
1. You & Friend: Open revit → Login with GitHub
2. Both: Select SAME repository (e.g., "alice/my-project")
3. Type in one browser → See in other instantly! ✨
```

---

## 👥 What You'll See

### When Someone Joins:
```
👥 Active Collaborators (1)
┌──────────────────────┐
│ 🟣 Bob              │
└──────────────────────┘
```

### When They're Typing:
```
👥 Active Collaborators (1)
┌──────────────────────┐
│ 🟣 Bob    typing...  │
└──────────────────────┘
```

---

## 🎯 Key Rules

| ✅ DO | ❌ DON'T |
|-------|----------|
| Select SAME repository | Select different repos |
| Both login with GitHub | Try as guest |
| Communicate on chat | Edit same line simultaneously |
| Save/push frequently | Make massive changes at once |

---

## 🔧 Troubleshooting

### Not seeing others?
```
✓ Both logged in? (Check top-right corner)
✓ Same repository selected? (Must match exactly)
✓ Console shows "✅ Socket connected"?
✓ Internet working? (Check connection)
```

### Changes not syncing?
```
1. Press Ctrl+F5 (hard refresh)
2. Check browser console for errors
3. Verify backend is running (Railway/localhost)
4. Re-select the repository
```

---

## 📂 Files Changed

**Backend:** `backend/src/index.ts` - Added room system, events, broadcasting

**Frontend:** `frontend/src/components/EditorPage.tsx` - Added collaborators UI, socket events

**Styles:** `frontend/src/components/EditorPage.module.css` - Added panel styles

**Docs:** 
- `COLLABORATION_GUIDE.md` - Full documentation
- `COLLABORATION_QUICKSTART.md` - Visual guide
- `COLLABORATION_IMPLEMENTATION.md` - Technical details

---

## 🎮 Test Commands

### Local Test:
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm start

# Browser 1: Chrome → localhost:3000
# Browser 2: Firefox → localhost:3000
# Login → Select same repo → Type → Watch magic!
```

### Production Test:
```bash
# Browser 1: Your computer
https://your-app.vercel.app

# Browser 2: Friend's computer/phone
https://your-app.vercel.app

# Both: Login → Same repo → Collaborate!
```

---

## 💡 Pro Tips

1. **Use Different Browsers** for local testing (Chrome + Firefox)
2. **Share Screen** while coding for better coordination
3. **Use Chat** (Discord/Slack) alongside editor
4. **Create Branches** before experimenting
5. **Push Frequently** to save collaborative work

---

## 🎨 Color System

Each collaborator gets a unique color:
- 🔴 Red (`#FF6B6B`)
- 🔵 Blue (`#4ECDC4`)
- 🟣 Purple (`#BB8FCE`)
- 🟢 Green (`#52B788`)
- 🟡 Yellow (`#F7DC6F`)
- 🟠 Orange (`#F8B739`)
- 💙 Cyan (`#85C1E2`)
- 💚 Teal (`#98D8C8`)
- 🧡 Orange Light (`#FFA07A`)
- 💜 Purple Light (`#45B7D1`)

---

## 📊 Connection Status

### ✅ Good Connection:
```javascript
// Browser Console (F12)
✅ Socket connected: abc123
👥 Room users updated: 2
👤 User joined: Alice
```

### ❌ Connection Issues:
```javascript
// Browser Console (F12)
❌ Socket connection error: ...
⚠️ Disconnected from server
```

**Fix:** Refresh page, check internet, verify backend is running

---

## 🔢 Socket Events (Technical)

### You Send:
- `joinRoom` - Enter a repository room
- `leaveRoom` - Exit a room
- `codeChange` - Code was edited
- `cursorMove` - Cursor moved (position tracking)
- `typing` - Started/stopped typing

### You Receive:
- `roomUsers` - List of active users
- `userJoined` - New user entered
- `userLeft` - User exited
- `codeChange` - Someone edited code
- `userTyping` - Someone is typing

---

## 🎯 Common Scenarios

### Scenario: Can't see collaborators
```
Check:
1. Both users in same repository?
2. Panel only shows if others are present
3. Console shows "Room users updated"?
```

### Scenario: Code not syncing
```
Check:
1. Internet connected?
2. Backend running (Railway)?
3. Socket connected (check console)?
4. Try refresh (Ctrl+F5)
```

### Scenario: Typing but nothing happens
```
Check:
1. Editor has focus (click inside)?
2. Not in read-only mode?
3. JavaScript errors (F12 console)?
```

---

## 🌐 URLs to Remember

**Local Development:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Test API: http://localhost:5000/api/test

**Production:**
- Frontend: https://your-app.vercel.app
- Backend: https://your-backend.railway.app
- Test API: https://your-backend.railway.app/api/test

---

## 📚 Full Documentation

- **Quick Visual Guide**: `COLLABORATION_QUICKSTART.md`
- **Complete Manual**: `COLLABORATION_GUIDE.md`
- **Implementation Details**: `COLLABORATION_IMPLEMENTATION.md`
- **Deployment**: `STEP_BY_STEP_DEPLOYMENT.md`

---

## ✨ Feature Checklist

- [x] Real-time code sync
- [x] User presence tracking
- [x] Typing indicators
- [x] Color-coded users
- [x] Avatar display
- [x] Room isolation
- [x] Join/leave notifications
- [x] Responsive panel
- [ ] Visual cursors (coming soon)
- [ ] In-app chat (coming soon)
- [ ] Voice/video (future)

---

## 🎉 You're Ready!

**Start collaborating in 3 steps:**
1. Login with GitHub
2. Select a repository
3. Share the URL with a friend!

**Questions?** Check `COLLABORATION_GUIDE.md`

**Happy Coding Together! 🚀**
