# TaskFlow

A precision task-management workspace for teams who treat planning as engineering — not paperwork. Built on the MERN stack with a deliberately minimal, monospace-accented design language.

> _"Operate at the speed of thought."_

![TaskFlow](https://github.com/user-attachments/assets/29504f31-2506-4a77-a485-4231ec091969)

---

## Live Demo

- **App:** [https://mern-todo-flow.vercel.app](https://mern-todo-flow.vercel.app)
- **Frontend:** deployed on Vercel
- **Backend:** deployed on Railway

> Register a new account, or use the in-app signup flow to spin up a workspace in seconds.

---

## What's Inside

### Authentication
- Email + password registration and login
- JWT with 7-day expiry, auto-logout on `401` via Axios interceptor
- Forgot password → emailed reset link (cryptographically hashed token, 1h expiry)
- Reset password page with token validation
- Server-side `express-validator` on all auth routes
- `express-rate-limit` on `/api/auth` (20 req / 15 min)
- Bcrypt password hashing, 6-character minimum

### Tasks
- Full CRUD with title, description, status, priority, due date
- Multi-assignee support
- **Subtasks** with completion toggles + progress bar
- **Comments** thread with timestamps and author
- **Attachments** scaffold (Cloudinary-ready)
- **Archive** workflow
- **Recurrence** field (daily / weekly / monthly)
- Server-side **pagination** (`?page=&limit=`)
- Server-side **filtering** by status, priority, assignee
- **Bulk delete** with selection
- **CSV export** of current task list

### Views
- **Table view** — sortable columns, row selection, inline actions
- **Kanban view** — drag-and-drop columns via `@hello-pangea/dnd`, status updates via drop target
- **Filters** — combine status / priority / assignee filters

### Dashboard
- **Bento-grid layout** with asymmetric tiles
- Hero metric: total tasks tracked with completion percentage
- Status distribution (donut chart)
- Priority breakdown (bar chart)
- Due-within-72-hours list
- Overdue alert tile with red emphasis

### Analytics
- 6-week creation + completion trend (line chart)
- Team productivity (assigned vs. completed per user)
- Priority split (bar chart)
- Top performer card with completion rate
- Stat cards: total / completion rate / overdue / team size
- CSV export of full dataset

### Notifications
- In-app **notification bell** with unread count badge
- Polled every 30 seconds (Socket.io ready)
- Backend fires on task assignment, comment, and status change
- Mark individual or all-as-read
- Color-coded by type with mono timestamp

### Profile
- Edit display name (token-rotated; UI updates everywhere instantly)
- Change password with current-password verification
- Role badge (admin / user)

### Realtime + PWA
- Socket.io server scaffold for live updates
- Installable PWA via `manifest.json`

---

## Design System

The interface is built around a single design intent: **a precision instrument, not a dashboard**.

| Token | Value | Use |
| --- | --- | --- |
| Accent | `#d4ff3a` (electric lime) | Active states, primary buttons, focus |
| Dark background | `#0a0a0d` | Near-black canvas |
| Dark paper | `#111114` | Tile surfaces |
| Light background | `#f7f7f5` | Warm off-white canvas |
| Border radius | `2px` | Sharp corners throughout |
| Display font | Space Grotesk | Page titles (-0.04em tracking) |
| Mono font | JetBrains Mono | Numbers, labels, status tags |
| Body font | Inter | Body text |

**Structural signatures**

- **60px icon-rail sidebar** with active-state lime fill + tooltips
- **Hero page headers** — mono section index (`01`), breadcrumb, 64px display title
- **Mono status tags** — `[ACTIVE]`, `[HIGH]`, `[DONE]` with colored leading dots
- **Dot-grid background** — subtle radial-gradient texture on all canvases
- **Tabular-nums** for every numeric display

---

## Tech Stack

### Frontend
- React 18 + React Router 6
- Material-UI 5 (heavily themed)
- `@hello-pangea/dnd` for Kanban drag-and-drop
- Recharts for analytics
- Axios with global 401 interceptor
- `react-hot-toast` for notifications
- Socket.io-client (real-time scaffold)

### Backend
- Node.js + Express 4
- Mongoose 8 (MongoDB Atlas)
- JWT + bcryptjs for auth
- `express-validator` + `express-rate-limit` for safety
- Nodemailer for reset emails
- Socket.io for realtime events
- Multer + Cloudinary scaffold for attachments

---

## Project Structure

```
MERN-Todo-App/
├── backend/
│   ├── server.js              ← Entry point, MongoDB, Socket.io
│   ├── app.js                 ← Express setup, middleware, routes
│   ├── middleware/auth.js     ← JWT verification
│   ├── routes/
│   │   ├── auth.js            ← register, login, forgot/reset password
│   │   ├── task.js            ← CRUD, subtasks, comments, archive
│   │   ├── user.js            ← list users, update profile, change password
│   │   └── notification.js    ← list, mark-read, mark-all
│   └── models/
│       ├── User.js
│       ├── Task.js
│       ├── Notification.js
│       └── AuditLog.js
└── frontend/
    ├── src/
    │   ├── theme/theme.js           ← Design tokens (accent, fonts, shape)
    │   ├── context/AuthContext.jsx  ← Token + decoded user state
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   └── useNotifications.js
    │   ├── pages/
    │   │   ├── Login.jsx / Register.jsx
    │   │   ├── ForgotPassword.jsx / ResetPassword.jsx
    │   │   ├── Home.jsx             ← Shell with sidebar + main
    │   │   ├── Tasks.jsx / Analytics.jsx / Profile.jsx
    │   └── components/
    │       ├── layout/
    │       │   ├── Sidebar.jsx      ← 60px icon rail
    │       │   ├── Topbar.jsx       ← Mobile menu
    │       │   └── PageHeader.jsx   ← Hero header for every page
    │       ├── Dashboard.jsx        ← Bento grid
    │       ├── TaskTable.jsx
    │       ├── TaskFormDialog.jsx / TaskDetailsDialog.jsx
    │       ├── tasks/
    │       │   ├── TaskKanban.jsx
    │       │   └── TaskFilterBar.jsx
    │       ├── notifications/NotificationBell.jsx
    │       └── ui/SkeletonLoader.jsx / EmptyState.jsx
    └── public/manifest.json   ← PWA config
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB)

### 1. Clone
```bash
git clone https://github.com/owaisraza01/MERN-Todo-App.git
cd MERN-Todo-App
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MONGO_URI, JWT_SECRET, etc.
npm run dev     # nodemon on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000 for local dev
npm start       # opens http://localhost:3000
```

The frontend proxies `/api/*` to `localhost:5000` in development.

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/taskflow
JWT_SECRET=<long-random-string>
CLIENT_URL=https://your-vercel-app.vercel.app

# Email (optional — forgot password works in dev without this)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=<sendgrid-api-key>

# Cloudinary (optional — for attachments)
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
```

### Frontend (`frontend/.env`)
```env
REACT_APP_API_URL=https://your-railway-app.up.railway.app
REACT_APP_SOCKET_URL=https://your-railway-app.up.railway.app
```

---

## Deployment

### Backend → Railway
1. Connect this repo to Railway, set the root directory to `/backend`
2. Add all backend env vars in the Railway dashboard
3. Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access (Railway uses dynamic IPs)
4. Railway auto-detects Node.js and runs `node server.js`

### Frontend → Vercel
1. Connect this repo to Vercel, set the root directory to `/frontend`
2. Set `REACT_APP_API_URL` to your Railway backend URL (include `https://`)
3. Build command: `npm run build`
4. Output directory: `build`

---

## Scripts

| Location | Command | What it does |
| --- | --- | --- |
| `/backend` | `npm run dev` | Nodemon on port 5000 |
| `/backend` | `npm start` | Production server |
| `/frontend` | `npm start` | CRA dev server with proxy |
| `/frontend` | `npm run build` | Production build |

---

## Architecture Notes

- **Auth state** lives in a single `AuthContext` — components read `user` and `authHeader` via `useAuth()` rather than touching `localStorage` directly
- **Token rotation** — when the user updates their name, the backend reissues a fresh JWT so the displayed identity stays in sync with the database
- **Notifications** — backend `notify()` helper fires on every relevant task event; frontend polls every 30s as a holdover until full Socket.io rollout
- **CSV export** is fully client-side — no backend endpoint needed
- **Analytics** is derived from existing `/api/tasks` data — no separate analytics endpoint

---

## License

MIT — see [LICENSE](LICENSE) if present, otherwise feel free to fork and adapt.

---

Designed and built by [Muhammad Owais Raza](https://github.com/owaisraza01).
