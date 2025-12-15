# Batwa Trip

Monorepo-style layout with a React/Vite frontend in `client` and an Express/Mongo backend in `server`.

## Getting started

### Frontend
```powershell
cd client
npm install
npm run dev
```

### Backend
```powershell
cd server
npm install
npm run dev
```

Uploads and static assets are served from `client/public/images` and are reachable at `/images/...` from both the app and API responses.
