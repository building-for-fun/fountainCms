# Headless CMS Monorepo

This repository is organized as a monorepo for the Headless CMS ecosystem, containing both frontend (React) and backend (Node.js/Express) codebases.

## Structure

```
headless-cms/
├── frontend/      # React + Vite frontend app
│   ├── src/
│   ├── public/
│   ├── vite.config.ts
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
├── backend/        # Node.js/Express backend
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── package.json   # Monorepo root (workspaces)
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v7+ recommended for workspaces)

### Install dependencies
At the root of the repository, run:

```sh
npm install
```
This will install dependencies for both frontend and backend using npm workspaces.

### Running the Frontend

```
cd frontend
npm run dev
```

### Running the Backend

```
cd backend
npm run dev
```

## Notes
- All shared configuration (linting, formatting, etc.) should be placed at the root.
- Each package (frontend, backend) manages its own dependencies and scripts.

---

Feel free to add more details as your project evolves.
