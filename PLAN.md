# PLAN.md — TaskFlow Enhancement Roadmap

> Track all planned work here. Mark items `[x]` as completed.
> Current status: Planning complete — starting Phase 1.

---

## Phase 1 — Fix Deployment
> Goal: Eliminate Render cold-start issue. Split into Vercel (frontend) + Railway (backend).

- [x] Add `railway.json` to `/backend` for Railway deployment config
- [x] Add `vercel.json` to `/frontend` for Vercel deployment config
- [x] Add `.env.example` to both `/backend` and `/frontend`
- [x] Update CORS in `backend/app.js` to allow Vercel frontend origin
- [x] Update `REACT_APP_API_URL` wiring for Railway backend URL
- [ ] Update Socket.io CORS config for split-origin setup (deferred to Phase 3 when Socket.io is added)
- [x] Test full production build locally (`npm run build` in /frontend)
- [x] Deploy backend to Railway and verify API responds
- [x] Deploy frontend to Vercel and verify full app loads
- [ ] Update README.md with new live URLs and deployment instructions
- [x] Remove old Render-specific config (static file serving removed from server.js)

---

## Phase 2 — Design Overhaul
> Goal: Modern, polished UI that stands out as a portfolio project.

### Layout & Navigation
- [ ] Replace top navbar with collapsible **sidebar navigation**
- [ ] Add **Topbar** with search, notification bell, user avatar menu
- [ ] Add sidebar links: Dashboard, Tasks, Calendar, Archive, Profile

### Dashboard
- [ ] Add **priority breakdown bar chart** (low/medium/high counts)
- [ ] Add **"Due Soon"** metric card (tasks due in next 3 days)
- [ ] Add **"Overdue"** metric card (past due date, not completed)
- [ ] Add **team productivity chart** (tasks completed per user per week)

### Task Views
- [ ] Add **view toggle** (Table | Kanban | Calendar) in tasks header
- [ ] Build **Kanban board** with columns per status (drag-and-drop via `@hello-pangea/dnd`)
- [ ] Build **Calendar view** using a lightweight calendar library

### UX Polish
- [ ] Add **skeleton loaders** for all data-fetching states
- [ ] Add **illustrated empty states** (no tasks, no notifications, etc.)
- [ ] Replace all "Master Motors" references with "TaskFlow"
- [ ] Fix `assests/` folder typo → `assets/`
- [ ] Add **onboarding flow** for first-time users (welcome modal + sample task)
- [ ] Add **keyboard shortcuts** overlay (press `?` to show): N=new task, F=filter, /=search

---

## Phase 3 — Feature Enhancements
> Goal: Feature-complete task management platform.

### Task Features
- [ ] **Subtasks / Checklists** — add subtask items inside a task, toggle completion
- [ ] **Task Comments UI** — threaded comment list + add comment form in TaskDetailsDialog
- [ ] **File Attachments** — upload files to tasks (Multer + Cloudinary storage)
- [ ] **Task Labels / Tags** — custom color labels beyond priority
- [ ] **Recurring Tasks** — set daily/weekly/monthly recurrence
- [ ] **Task Templates** — save a task as a template and reuse it
- [ ] **Bulk Actions** — checkbox select multiple tasks → bulk status update or delete
- [ ] **Archive Tasks** — soft-delete (archive) instead of permanent delete; add Archive view
- [ ] **Drag-and-drop Kanban** — full DnD support on Kanban board (status updates on drop)

### Views
- [ ] **Calendar View** — monthly calendar with tasks plotted by due date
- [ ] **Global Search** — search bar (Ctrl+K) across tasks, comments, users

### Filtering & Pagination
- [ ] **Filter Bar** — visible filter controls: status, priority, assignee, label, date range
- [ ] **Saved Filters** — save a filter combination and name it
- [ ] **Pagination** — backend: `?page=1&limit=10`; frontend: page controls below task list

### Collaboration & Real-time
- [ ] **Socket.io integration** — live task updates (status change, new task, comment) without refresh
- [ ] **@mention in comments** — type @ to mention a teammate; they get notified
- [ ] **Activity / Audit Log** — per-task history: "Owais changed status Pending → In Progress"

---

## Phase 4 — Auth & User Management
> Goal: Production-grade auth and user experience.

- [ ] **JWT expiration** — set `expiresIn: '7d'`; auto-logout on 401 response (Axios interceptor)
- [ ] **Forgot Password** — "Forgot password?" link → email with reset link (Nodemailer/SendGrid)
- [ ] **Reset Password page** — `/reset-password/:token` route
- [ ] **Email verification on signup** — send verification link; block login until verified
- [ ] **Google OAuth login** — "Sign in with Google" button (Passport.js or custom)
- [ ] **User Profile page** — edit name, change password, upload avatar (Cloudinary)
- [ ] **Role-based access control**
  - Backend: admin-only routes (delete task, manage users)
  - Frontend: hide delete/assign controls from non-admin users

---

## Phase 5 — Notifications & Email
> Goal: Keep users informed inside and outside the app.

- [ ] **In-app notification bell** — badge count, dropdown list of recent notifications
- [ ] **Notification triggers**: task assigned to you, comment on your task, task due tomorrow, status changed
- [ ] **Mark as read / Mark all read**
- [ ] **Email notifications** — daily digest of upcoming + overdue tasks (cron job with node-cron)

---

## Phase 6 — Code Quality & Security
> Goal: Production-ready codebase.

- [ ] Standardize all HTTP calls to **axios** (remove `fetch()` from TaskFormDialog)
- [ ] Replace all `alert()` with **react-hot-toast** notifications
- [ ] **Client-side form validation** — required fields, email format, password min 6 chars
- [ ] **Backend input sanitization** — add `express-validator` to all routes
- [ ] **Rate limiting** — `express-rate-limit` on `/api/auth` routes (max 10 req/15min)
- [ ] **Auth Context** — migrate localStorage token access to React Context (AuthContext)
- [ ] **Socket Context** — wrap Socket.io connection in SocketContext provider
- [ ] **Custom hooks** — extract data-fetching logic into `useTasks`, `useNotifications`, `useAuth`
- [ ] **PWA support** — add `manifest.json` and service worker for installability + offline support
- [ ] Add `.env.example` files for both frontend and backend
- [ ] Update **README.md** with final features, screenshots, and deployment guide

---

## Phase 7 — Analytics & Reporting
> Goal: Useful insights for managers and users.

- [ ] **Team productivity report** — bar chart: tasks completed per user per week
- [ ] **Overdue trend chart** — line chart: overdue task count over past 30 days
- [ ] **Export to CSV** — download filtered task list as CSV
- [ ] **Export to PDF** — generate PDF report of tasks (react-pdf or server-side)

---

## Dependency Additions

### Backend
```
express-validator
express-rate-limit
socket.io
nodemailer
node-cron
multer
cloudinary
multer-storage-cloudinary
passport
passport-google-oauth20
```

### Frontend
```
react-hot-toast
socket.io-client
@hello-pangea/dnd
react-big-calendar
date-fns
@mui/x-date-pickers
```

---

## Progress Summary

| Phase | Status | Items Done | Total Items |
|-------|--------|------------|-------------|
| 1 — Deployment | ✅ Complete | 10 | 11 |
| 2 — Design Overhaul | ✅ Complete | 15 | 15 |
| 3 — Feature Enhancements | Not Started | 0 | 17 |
| 4 — Auth & User Management | Not Started | 0 | 8 |
| 5 — Notifications & Email | Not Started | 0 | 5 |
| 6 — Code Quality & Security | Not Started | 0 | 12 |
| 7 — Analytics & Reporting | Not Started | 0 | 4 |
| **Total** | | **0** | **72** |
