# CLAUDE.md — TaskFlow (MERN Todo App)

## Project Overview

**TaskFlow** is a full-stack task management dashboard built with the MERN stack. It allows teams to create, assign, track, and collaborate on tasks with role-based access, real-time updates, and rich analytics.

- **Developer:** Muhammad Owais Raza (owaisharoon00@gmail.com)
- **Repo:** D:\Personal\MERN-Todo-App
- **Live URL (old):** https://mern-todo-app-moyn.onrender.com (being migrated)
- **New Deployment:** Frontend → Vercel | Backend → Railway

---

## Tech Stack

### Frontend
- React 18.2.0
- Material-UI (MUI) 5.x
- React Router DOM 6.x
- Axios (HTTP client — use exclusively, no fetch())
- Recharts (charts)
- react-hot-toast (notifications — replacing alert())
- Socket.io-client (real-time)
- @fontsource/inter

### Backend
- Node.js + Express 4.x
- Mongoose 8.x (MongoDB ODM)
- JWT (jsonwebtoken) — 7d expiry
- bcryptjs (password hashing)
- express-validator (input sanitization)
- express-rate-limit (auth route protection)
- Socket.io (real-time)
- Nodemailer or SendGrid (email notifications)
- Multer + Cloudinary (file attachments)
- CORS

### Database
- MongoDB Atlas (cloud)

### Deployment
- Frontend: Vercel (`vercel.json` in /frontend)
- Backend: Railway (`railway.json` in /backend)

---

## Project Structure

```
MERN-Todo-App/
├── CLAUDE.md              ← AI assistant context (this file)
├── PLAN.md                ← Feature roadmap and progress tracker
├── README.md
├── .gitignore
├── backend/
│   ├── server.js          ← Entry point, MongoDB connect, Socket.io init
│   ├── app.js             ← Express setup, middleware, routes
│   ├── railway.json       ← Railway deployment config
│   ├── .env.example       ← Environment variable template
│   ├── middleware/
│   │   ├── auth.js        ← JWT verification
│   │   └── validate.js    ← express-validator error handler
│   ├── routes/
│   │   ├── auth.js        ← POST /register, POST /login, POST /forgot-password, POST /reset-password
│   │   ├── task.js        ← CRUD + subtasks + comments + attachments + pagination
│   │   ├── user.js        ← GET /users, PUT /profile, PUT /avatar
│   │   └── notification.js ← GET /notifications, PUT /notifications/:id/read
│   └── models/
│       ├── User.js        ← name, email, password, role, avatar, organization
│       ├── Task.js        ← title, desc, status, priority, dueDate, assignedTo, subtasks, comments, attachments, recurrence, isArchived
│       ├── Notification.js ← user, message, type, read, link
│       └── AuditLog.js    ← task, user, action, oldValue, newValue, timestamp
└── frontend/
    ├── vercel.json        ← Vercel deployment config
    ├── .env.example       ← REACT_APP_API_URL template
    ├── public/
    │   ├── index.html
    │   └── logo.png
    └── src/
        ├── index.js       ← React root, Axios baseURL, Socket.io init
        ├── App.jsx        ← Router, ThemeProvider, AuthGuard
        ├── theme/
        │   └── theme.js   ← MUI theme factory (light/dark)
        ├── context/
        │   ├── AuthContext.jsx      ← Auth state, token, user
        │   └── SocketContext.jsx    ← Socket.io connection
        ├── hooks/
        │   ├── useAuth.js
        │   ├── useTasks.js
        │   └── useNotifications.js
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── ForgotPassword.jsx
        │   ├── ResetPassword.jsx
        │   └── Home.jsx            ← Main shell with sidebar
        ├── components/
        │   ├── layout/
        │   │   ├── Sidebar.jsx
        │   │   └── Topbar.jsx
        │   ├── dashboard/
        │   │   ├── Dashboard.jsx
        │   │   ├── StatsCards.jsx
        │   │   └── Charts.jsx
        │   ├── tasks/
        │   │   ├── TaskTable.jsx
        │   │   ├── TaskKanban.jsx       ← Drag-and-drop Kanban board
        │   │   ├── TaskCalendar.jsx     ← Calendar view
        │   │   ├── TaskFormDialog.jsx
        │   │   ├── TaskDetailsDialog.jsx
        │   │   ├── TaskFilterBar.jsx
        │   │   ├── SubtaskList.jsx
        │   │   └── CommentThread.jsx
        │   ├── notifications/
        │   │   └── NotificationBell.jsx
        │   ├── search/
        │   │   └── GlobalSearch.jsx
        │   └── ui/
        │       ├── ThemeToggle.jsx
        │       ├── SkeletonLoader.jsx
        │       └── EmptyState.jsx
        └── assets/                  ← Fixed from "assests"
            └── images/
```

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /register | No | Register with email verification |
| POST | /login | No | Login, returns JWT (7d) |
| POST | /forgot-password | No | Send reset email |
| POST | /reset-password/:token | No | Reset password |

### Tasks (`/api/tasks`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | / | Yes | All tasks (paginated, filterable) |
| POST | / | Yes | Create task |
| GET | /:id | Yes | Single task |
| PUT | /:id | Yes | Update task |
| DELETE | /:id | Admin | Delete task |
| POST | /:id/comments | Yes | Add comment |
| POST | /:id/subtasks | Yes | Add subtask |
| PUT | /:id/subtasks/:sid | Yes | Toggle subtask |
| POST | /:id/attachments | Yes | Upload attachment |
| PUT | /:id/archive | Yes | Archive task |

### Users (`/api/users`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | / | Yes | List all users |
| PUT | /profile | Yes | Update own profile |
| PUT | /avatar | Yes | Upload avatar |

### Notifications (`/api/notifications`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | / | Yes | Get user's notifications |
| PUT | /:id/read | Yes | Mark as read |
| PUT | /read-all | Yes | Mark all as read |

---

## Data Models

### User
```js
{
  name: String (required),
  email: String (unique, required),
  password: String (hashed),
  role: 'admin' | 'user' (default: 'user'),
  avatar: String (Cloudinary URL),
  organization: String,
  isEmailVerified: Boolean,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  timestamps: true
}
```

### Task
```js
{
  title: String (required),
  description: String,
  status: 'pending' | 'in-progress' | 'completed' (default: 'pending'),
  priority: 'low' | 'medium' | 'high' (default: 'medium'),
  dueDate: Date,
  assignedTo: [ObjectId → User],
  createdBy: ObjectId → User,
  organization: String,
  subtasks: [{ title, completed, createdAt }],
  comments: [{ user: ObjectId, text, createdAt }],
  attachments: [{ filename, url, uploadedBy, uploadedAt }],
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly',
  isArchived: Boolean (default: false),
  labels: [String],
  templates: Boolean,
  timestamps: true
}
```

### Notification
```js
{
  user: ObjectId → User,
  message: String,
  type: 'task_assigned' | 'comment_added' | 'task_due' | 'status_changed',
  read: Boolean (default: false),
  link: String (task ID),
  timestamps: true
}
```

### AuditLog
```js
{
  task: ObjectId → Task,
  user: ObjectId → User,
  action: String,
  oldValue: Mixed,
  newValue: Mixed,
  timestamps: true
}
```

---

## Key Conventions

- **HTTP client:** Always use **axios** — never use `fetch()` directly
- **Notifications:** Always use **react-hot-toast** — never use `alert()`, `confirm()`, or `prompt()`
- **Auth:** Token stored in `localStorage` key `token`; auto-logout on 401 response
- **Theme:** Mode stored in `localStorage` key `themeMode`
- **Role enforcement:** Check `user.role === 'admin'` on both frontend (hide UI) and backend (reject request)
- **Pagination:** Default page size = 10; use `?page=1&limit=10` query params
- **File structure:** All images/assets go in `frontend/src/assets/images/`
- **No comments in code** unless the WHY is non-obvious
- **No console.log** in production code
- **Error handling:** All async route handlers wrapped in try/catch; return structured `{ message }` JSON errors
- **Environment variables:** Never hard-code URLs, secrets, or credentials

---

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=https://your-vercel-app.vercel.app
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`frontend/.env`)
```
REACT_APP_API_URL=https://your-railway-app.railway.app
REACT_APP_SOCKET_URL=https://your-railway-app.railway.app
```

---

## Development Workflow

```bash
# Backend (from /backend)
npm install
npm run dev       # nodemon on port 5000

# Frontend (from /frontend)
npm install
npm start         # React dev server on port 3000 (proxies to 5000)

# Production build
cd frontend && npm run build
# Backend serves /frontend/build in production
```

---

## Deployment

### Railway (Backend)
1. Connect GitHub repo to Railway
2. Set root directory to `/backend`
3. Set all backend environment variables
4. Deploy — Railway auto-detects Node.js

### Vercel (Frontend)
1. Connect GitHub repo to Vercel
2. Set root directory to `/frontend`
3. Set `REACT_APP_API_URL` to Railway backend URL
4. Build command: `npm run build`
5. Output directory: `build`

---

## Known Issues / Notes
- Old Render deployment suffers cold-start sleep (15min inactivity) — being replaced by Railway + Vercel
- `assests/` folder typo is being corrected to `assets/`
- TaskFormDialog originally used `fetch()` — being standardized to axios
- "Master Motors" branding being replaced with "TaskFlow"
- Organization field in schemas exists but filtering is not fully implemented yet
