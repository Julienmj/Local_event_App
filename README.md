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
| Frontend | Vue.js |
| Backend | C# .NET |
| Version Control | Git & GitHub |

---

## Branch Strategy

```
main
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
git pull origin FRONT-END    # frontend team
git pull origin BACK-END     # backend team

# After making changes
git add .
git commit -m "brief description of what you did"
git push origin yourname+id-workspace
```

### 4. When a task is done
- Go to GitHub → open a **Pull Request**
- Target branch: `FRONT-END` (frontend team) or `BACK-END` (backend team)
- **Never push directly to `main`, `FRONT-END`, or `BACK-END`**
- Wait for your lead to review and merge

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

**Phase 1 Complete** — Project description, problem statement, and team formation established.  
**Phase 2 Complete** — Project setup, branch strategy, and team workflow defined.  
**Phase 3 In Progress** — Frontend and backend implementation underway.

---

## Progress Tracker

### Backend (C# .NET) — Fiacre & Bienfait
| Feature | Status |
|---------|--------|
| ASP.NET Core Web API setup | ✅ Done |
| JWT Authentication | ✅ Done |
| User roles (Attendee, Organizer, Admin) | ✅ Done |
| Users endpoints | ✅ Done |
| Events endpoints | ✅ Done |
| Categories endpoints | ✅ Done |
| Database context (EF Core) | ✅ Done |
| Connect frontend to backend | ⏳ Pending |

### Frontend (Vue.js) — Julien & Claire
| Feature | Status |
|---------|--------|
| Vue.js + Vite project setup | ✅ Done |
| Global design system & styles | ✅ Done |
| App layout (nav + sidebar + filters) | ✅ Done |
| Home page | ✅ Done |
| Events page (3-col grid + sections) | ✅ Done |
| Event card component | ✅ Done |
| Event detail page | ✅ Done |
| Login page | ✅ Done |
| Register page | ✅ Done |
| Organizer dashboard (CRUD) | ✅ Done |
| Admin dashboard (users + events) | ✅ Done |
| Connect frontend to backend API | 🔄 In Progress |
