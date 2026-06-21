# 🐙 OctoFit Tracker

A modern multi-tier fitness tracking application built with GitHub Copilot Agent Mode.

## Architecture

| Tier | Technology | Port |
|------|-----------|------|
| Frontend | React 19 + Vite + TypeScript | 5173 |
| Backend | Node.js + Express + TypeScript | 8000 |
| Database | MongoDB + Mongoose | 27017 |

## Project Structure

```
octofit-tracker/
├── frontend/          # React 19 + Vite app
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── App.css
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
└── backend/           # Express + TypeScript API
    ├── src/
    │   └── index.ts
    ├── tsconfig.json
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running on port 27017

### Frontend
```bash
cd octofit-tracker/frontend
npm install
npm run dev        # http://localhost:5173
```

### Backend
```bash
cd octofit-tracker/backend
npm install
npm run dev        # http://localhost:8000
```

### API Endpoints
- `GET /api/health` — Health check
