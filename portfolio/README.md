# Abdullah Shahid – Portfolio (Next.js + NestJS)

Migration of the original Flutter web portfolio to a Next.js frontend + NestJS backend monorepo.

## Structure

```
portfolio/
├── apps/
│   ├── frontend/   # Next.js 14 (static export → GitHub Pages)
│   └── backend/    # NestJS REST API
├── .github/
│   └── workflows/
│       ├── deploy-frontend.yml   # builds & deploys to GitHub Pages
│       └── ci-backend.yml        # lint + build + test backend
└── package.json    # npm workspaces root
```

## Quick Start

```bash
# Install all deps
npm install

# Run both in separate terminals
npm run dev:backend    # http://localhost:4000
npm run dev:frontend   # http://localhost:3000
```

## API Endpoints (NestJS)

| Method | Path                      | Description              |
|--------|---------------------------|--------------------------|
| GET    | /api/portfolio            | All portfolio data       |
| GET    | /api/portfolio/projects   | Projects list            |
| GET    | /api/portfolio/skills     | Skills list              |
| GET    | /api/portfolio/experiences| Experiences list         |
| POST   | /api/contact              | Submit contact form      |

## Deployment

### Frontend → GitHub Pages
Push to `main`. The `deploy-frontend.yml` workflow builds a static export and
publishes it to the `gh-pages` branch automatically.

Set the `NEXT_PUBLIC_API_URL` secret in your repo settings to point at your
deployed backend URL.

### Backend → Railway / Render / Fly.io
1. Connect your repo to Railway (or any Node host).
2. Set root directory to `apps/backend`.
3. Build command: `npm run build`
4. Start command: `npm run start:prod`
5. Set `FRONTEND_URL` env var to your GitHub Pages URL.

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Next.js 14, React 18, Tailwind CSS  |
| Animations| Framer Motion, react-type-animation |
| Backend   | NestJS 10, class-validator          |
| CI/CD     | GitHub Actions                      |
| Hosting   | GitHub Pages (FE) + Railway (BE)    |
