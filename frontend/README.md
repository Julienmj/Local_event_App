# Local Event Organizer — Frontend

Built with **Vue 3 + Vite**, this is the frontend of the Local Event Organizer App — a platform for discovering, attending, and managing local community events.

🌐 **Live Demo:** https://group12-dotnet-project.vercel.app

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Vue 3 | UI framework |
| Vite | Build tool & dev server |
| Vue Router | Page navigation |
| Pinia | State management (auth) |
| Axios | HTTP requests to backend API |
| Inter (Google Fonts) | Typography |

---

## Getting Started

### Prerequisites
- Node.js v18 or higher → https://nodejs.org

### Installation
```bash
# 1. Clone the repo
git clone https://github.com/Julienmj/Group12-Dotnet-project-
cd Group12-Dotnet-project-

# 2. Switch to your branch
git checkout Mugishajulien26967-workspace   # Julien
git checkout Niyigenaclaire26693-workspace  # Claire

# 3. Install dependencies
cd frontend
npm install

# 4. Start dev server
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Project Structure

```
frontend/
├── public/              → static assets
├── src/
│   ├── assets/          → images and icons
│   ├── components/      → reusable components
│   │   ├── AppLayout.vue    → main shell (nav + sidebar)
│   │   └── EventCard.vue    → event card component
│   ├── pages/           → one file per route/page
│   │   ├── HomePage.vue
│   │   ├── EventsPage.vue
│   │   ├── EventDetailPage.vue
│   │   ├── LoginPage.vue
│   │   ├── RegisterPage.vue
│   │   ├── OrganizerDashboard.vue
│   │   └── AdminDashboard.vue
│   ├── router/
│   │   └── index.js     → all app routes
│   ├── stores/
│   │   └── auth.js      → JWT token & user state (Pinia)
│   ├── App.vue          → root component
│   ├── api.js           → axios base URL config
│   ├── main.js          → app entry point
│   └── styles.css       → global design system
├── index.html
├── package.json
├── vite.config.js
└── vercel.json          → Vercel deployment config
```

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | HomePage | Hero, stats, category grid |
| `/events` | EventsPage | 3-column event grid with sections |
| `/events/:id` | EventDetailPage | Full event info + join/save |
| `/login` | LoginPage | JWT login form |
| `/register` | RegisterPage | Register with role selection |
| `/organizer` | OrganizerDashboard | Create/edit/delete events |
| `/admin` | AdminDashboard | Manage all users and events |

---

## Components

### AppLayout.vue
The main shell that wraps every page. Contains:
- **Left sidebar** — navigation links, user avatar, login/logout
- **Main content area** — where each page renders via `<slot />`
- **Right sidebar** — location filter, date pills, category list with counts

### EventCard.vue
Reusable card used in the events grid. Contains:
- 16:9 event image with category badge
- Date in blue, bold title, location and attendee count
- Stacked friend avatars with "X friends going"
- Three action buttons — ✓ attend, ♡ save, ✕ dismiss

---

## Design System

Defined in `src/styles.css` using CSS variables:

| Variable | Value | Usage |
|----------|-------|-------|
| `--blue` | `#1D9BF0` | CTAs, active states, links |
| `--white` | `#ffffff` | Card backgrounds |
| `--bg` | `#f5f7fa` | Page background |
| `--border` | `#e4e6ea` | Dividers, input borders |
| `--text` | `#0f1419` | Primary text |
| `--muted` | `#6b7280` | Secondary text, metadata |
| `--card-radius` | `14px` | Card border radius |
| `--shadow` | `0 2px 12px rgba(0,0,0,0.08)` | Card shadows |

---

## State Management (Pinia)

`src/stores/auth.js` manages:
- `token` — JWT token stored in localStorage
- `user` — logged in user object (username, role)
- `isLoggedIn` — computed boolean
- `setAuth(data)` — saves token + user after login
- `logout()` — clears token + user

---

## API Configuration

`src/api.js` sets the base URL for all backend requests:
```js
baseURL: 'http://localhost:5000/api'  // development
```

When backend is deployed, update this to the production URL.

---

## User Roles

| Role | Access |
|------|--------|
| Attendee | Browse events, attend, save |
| Organizer | Above + create/edit/delete own events via `/organizer` |
| Admin | Above + manage all users and events via `/admin` |

---

## Available Scripts

```bash
npm run dev      # start development server (localhost:5173)
npm run build    # build for production (outputs to dist/)
npm run preview  # preview production build locally
```

---

## Known Issues & Pending Tasks

| Task | Status |
|------|--------|
| Connect Login/Register to backend JWT | ⏳ Pending |
| Connect Events page to real API | ⏳ Pending |
| Connect Organizer dashboard to real API | ⏳ Pending |
| Connect Admin dashboard to real API | ⏳ Pending |
| Re-enable auth route guards after backend is connected | ⏳ Pending |

---

## Deployment

The frontend is deployed on **Vercel** and auto-deploys on every push to `main`.

| Setting | Value |
|---------|-------|
| Platform | Vercel |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Branch | `main` |

To trigger a manual redeploy go to Vercel dashboard → Deployments → Redeploy.

---

## Mock Data

All pages include mock data fallback so the app works without the backend running. Mock data is defined inside each page's `onMounted` catch block.

Once the backend is connected, real data will automatically replace the mock data — no extra changes needed.

---

## Git Workflow for Frontend Team

```bash
# Before starting work — always sync first
git pull origin FRONT-END

# Work on your changes
git add .
git commit -m "describe what you did"
git push origin your-branch-name

# When task is done — open a Pull Request on GitHub
# Target: FRONT-END branch
```

> Never push directly to `main` or `FRONT-END`

---

## Backend API Endpoints Used

| Page | Method | Endpoint |
|------|--------|----------|
| LoginPage | POST | `/api/auth/login` |
| RegisterPage | POST | `/api/auth/register` |
| EventsPage | GET | `/api/events` |
| EventDetailPage | GET | `/api/events/:id` |
| EventDetailPage | POST | `/api/events/:id/attend` |
| OrganizerDashboard | GET | `/api/events/my` |
| OrganizerDashboard | POST | `/api/events` |
| OrganizerDashboard | PUT | `/api/events/:id` |
| OrganizerDashboard | DELETE | `/api/events/:id` |
| AdminDashboard | GET | `/api/users` |
| AdminDashboard | PUT | `/api/users/:id/role` |
| AdminDashboard | DELETE | `/api/users/:id` |

---

## Responsive Design

The app is fully responsive across all screen sizes:

| Screen | Behavior |
|--------|----------|
| Desktop (1280px+) | 3-column event grid, left nav + right sidebar visible |
| Tablet (1024px) | 2-column event grid, right sidebar hidden |
| Mobile (640px) | 1-column grid, left nav hidden |

---

## Environment Variables

Create a `.env` file inside the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Then update `src/api.js` to use it:
```js
baseURL: import.meta.env.VITE_API_URL
```

---

## Connecting to Backend

All pages use mock data fallback while the backend is being connected. Once the backend is running:

1. Update `src/api.js` base URL to match the backend URL
2. The app will automatically use real data from the API

Backend API runs on `http://localhost:5000` — Swagger docs at `http://localhost:5000/swagger`
