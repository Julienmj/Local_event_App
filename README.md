# Local Event Organizer App

## Project Overview
The Local Event Organizer App is a full-stack application built with **Vue.js** (frontend) and **C# .NET** (backend), designed to help local communities manage and coordinate events efficiently.

### Problem Statement
Local event organizers often struggle with:
- Fragmented event management processes
- Inefficient participant registration systems
- Limited communication channels with attendees
- Difficulty in tracking event logistics and resources
- Lack of centralized platform for event coordination

---

## Team Members & Roles

| # | Student Name | Student ID | Role |
|---|--------------|------------|------|
| 1 | Mugisha Julien | 26967 | Frontend Lead |
| 2 | Ntwari Ashimwe Fiacre | 27438 | Backend Lead |
| 3 | Ndahiriwe Bienfait | 25959 | Backend Developer |
| 4 | Niyigena Claire | 26693 | Frontend Developer |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue.js 3 + Vite |
| Backend | C# .NET 8 + ASP.NET Core |
| Database | PostgreSQL |
| Authentication | JWT (JSON Web Tokens) |
| State Management | Pinia |
| Deployment | Vercel (Frontend) + Render (Backend) |
| Version Control | Git & GitHub |

---

## Branch Strategy

```
main                 → production-ready code (merged from frontend-b)
├── frontend-b       → deployed frontend (Vercel)
├── FRONT-END        → stable frontend code (Vue.js)
├── BACK-END         → stable backend code (C# .NET)
├── Mugishajulien26967-workspace      (Julien)
├── ntwarifiacre27438-workspace       (Fiacre)
├── Ndahiriwebienfait25959-workspace  (Bienfait)
└── Niyigenaclaire26693-workspace     (Claire)
```

---

## How We Work (Git Workflow)

### 1. Clone the repo (do this once)
```bash
git clone https://github.com/Julienmj/Group12-Dotnet-project-
cd Group12-Dotnet-project-
```

### 2. Switch to your personal branch
```bash
git checkout yourname+id-workspace
```

### 3. Daily workflow
```bash
# Sync before starting work
git pull origin frontend-b   # frontend team (deployed branch)
git pull origin BACK-END     # backend team

# After making changes
git add .
git commit -m "brief description of what you did"
git push origin yourname+id-workspace
```

### 4. When a task is done
- Go to GitHub → open a **Pull Request**
- Target branch: `FRONT-END` or `frontend-b` (frontend team) or `BACK-END` (backend team)
- **Never push directly to `main`, `frontend-b`, `FRONT-END`, or `BACK-END`**
- Wait for your lead to review and merge

### 5. Deployment
- **Frontend**: Vercel auto-deploys from `frontend-b` branch
- **Backend**: Render deploys from `BACK-END` branch
- Merges to these branches trigger automatic deployments

---

## Team Responsibilities

### Frontend Team (Vue.js)
| Member | Branch |
|--------|--------|
| Julien (Lead) | `Mugishajulien26967-workspace` |
| Claire | `Niyigenaclaire26693-workspace` |

### Backend Team (C# .NET)
| Member | Branch |
|--------|--------|
| Fiacre (Lead) | `ntwarifiacre27438-workspace` |
| Bienfait | `Ndahiriwebienfait25959-workspace` |

---

## Project Repository
https://github.com/Julienmj/Group12-Dotnet-project-

---

## Getting Started

### Prerequisites
| Tool | Purpose | Download |
|------|---------|----------|
| Git | Version control | https://git-scm.com |
| Node.js (v18+) | Frontend | https://nodejs.org |
| .NET SDK (v8+) | Backend | https://dotnet.microsoft.com/download |

---

### Frontend Setup (Vue.js) — Claire & Julien

```bash
# 1. Clone the repo
git clone https://github.com/Julienmj/Group12-Dotnet-project-
cd Group12-Dotnet-project-

# 2. Switch to your branch
git checkout Niyigenaclaire26693-workspace  # Claire
git checkout Mugishajulien26967-workspace   # Julien

# 3. Install dependencies (once)
cd frontend
npm install

# 4. Start dev server
npm run dev
```
Open http://localhost:5173 in your browser.

All frontend code lives inside `frontend/src/`:
```
frontend/src/
├── views/
│   ├── app/      → Dashboard, BrowseEvents, CreateEvent, MyEvents, etc.
│   ├── Auth.vue  → Login & Register
│   └── Landing.vue
├── components/
│   ├── landing/  → Landing page sections
│   ├── EventCard.vue
│   ├── EventModal.vue
│   ├── SidebarNav.vue
│   ├── AiCopilot.vue
│   └── AppToast.vue
├── stores/       → Pinia stores (auth, events)
├── composables/  → useApi.js, useToast.js
├── router/       → index.js
├── data/         → demo.js (fallback data)
└── assets/styles → main.css (global design system)
```

---

### Backend Setup (C# .NET) — Fiacre & Bienfait

```bash
# 1. Clone the repo
git clone https://github.com/Julienmj/Group12-Dotnet-project-
cd Group12-Dotnet-project-

# 2. Switch to your branch
git checkout ntwarifiacre27438-workspace     # Fiacre
git checkout Ndahiriwebienfait25959-workspace # Bienfait

# 3. Restore dependencies
cd backend/LocalEventOrganizer
dotnet restore

# 4. Run the API
dotnet run --project LocalEventOrganizer
```
API runs on http://localhost:5000 — Swagger UI available at http://localhost:5000/swagger

---

## API Endpoints (35+ endpoints)

For complete API documentation, see [API_MIGRATION.md](frontend/API_MIGRATION.md) or visit the [Swagger UI](https://localeventorganizer.onrender.com/swagger).

### Quick Reference

**Authentication:**
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password with token

**Events:**
- `GET /api/v1/events` - List all events
- `POST /api/v1/events` - Create event (Organizer)
- `GET /api/v1/events/{id}` - Get event details
- `PUT /api/v1/events/{id}` - Update event
- `DELETE /api/v1/events/{id}` - Delete event

**Users, Venues, Categories, Registrations, Reviews, Notifications, Analytics** - See full documentation.

---

## User Roles & Access

| Role | Permissions |
|------|-------------|
| **Attendee** | Browse events, register for events, leave reviews, manage profile |
| **Organizer** | All Attendee permissions + Create/edit/delete own events, view analytics |
| **Admin** | Full access - Manage all users, events, categories, venues |

### Creating Admin Account

1. Visit: https://local-event-app.vercel.app/
2. Click "Create account"
3. Select "Admin access (full control)" from role dropdown
4. Complete registration

---

---

## Live Deployment

| Service | URL | Branch |
|---------|-----|--------|
| **Frontend** | https://local-event-app.vercel.app | `frontend-b` |
| **Backend API** | https://localeventorganizer.onrender.com/api/v1 | `BACK-END` |
| **API Documentation** | https://localeventorganizer.onrender.com/swagger | `BACK-END` |

---

**Phase 1 Complete** ✅ — Project description, problem statement, and team formation established.  
**Phase 2 Complete** ✅ — Project setup, branch strategy, and team workflow defined.  
**Phase 3 Complete** ✅ — Frontend and backend implementation finished and deployed.

---

## Progress Tracker

### Backend (C# .NET) — Fiacre & Bienfait
| Feature | Status |
|---------|--------|
| ASP.NET Core Web API setup | ✅ Done |
| JWT Authentication (Login/Register) | ✅ Done |
| Password Reset (Forgot/Reset) | ✅ Done |
| User roles (Attendee, Organizer, Admin) | ✅ Done |
| Users CRUD endpoints | ✅ Done |
| Events CRUD endpoints | ✅ Done |
| Categories CRUD endpoints | ✅ Done |
| Venues CRUD endpoints | ✅ Done |
| Registrations endpoints | ✅ Done |
| Reviews & Ratings endpoints | ✅ Done |
| Notifications endpoints | ✅ Done |
| Analytics endpoints | ✅ Done |
| Database schema (PostgreSQL + EF Core) | ✅ Done |
| CORS configuration | ✅ Done |
| SignalR real-time events | ✅ Done |
| Deployed to Render | ✅ Done |

### Frontend (Vue.js) — Julien & Claire
| Feature | Status |
|---------|--------|
| Vue.js 3 + Vite project setup | ✅ Done |
| Global design system & styles | ✅ Done |
| Landing page (Hero, Features, Pricing) | ✅ Done |
| Authentication (Login/Register/Password Reset) | ✅ Done |
| Role-based routing (Attendee/Organizer/Admin) | ✅ Done |
| App layout (nav + sidebar + filters) | ✅ Done |
| Browse Events page (grid + search) | ✅ Done |
| Event detail modal with reviews | ✅ Done |
| Event card component | ✅ Done |
| Create/Edit Event form | ✅ Done |
| Image upload & URL support | ✅ Done |
| Venue management with map picker | ✅ Done |
| Category management | ✅ Done |
| Organizer dashboard (My Events CRUD) | ✅ Done |
| Analytics dashboard | ✅ Done |
| Admin dashboard (users + events management) | ✅ Done |
| Notifications system | ✅ Done |
| User profile management | ✅ Done |
| Star rating system | ✅ Done |
| Connected to backend API | ✅ Done |
| Deployed to Vercel | ✅ Done |
