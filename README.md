# FountainCMS Monorepo

This repository is organized as a monorepo for the FountainCMS ecosystem, containing both frontend (React) and backend (Node.js/Express) codebases.

## Structure

```
fountaincms/
├── frontend/      # React + Vite frontend app
│   ├── src/
│   │   └── app.css
│   ├── public/
│   ├── vite.config.ts
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
├── backend/        # Node.js/Express backend
│   ├── src/
│   │   └── __tests__/
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── swagger (API docs at /api-docs)
├── package.json   # Monorepo root (workspaces)
├── .gitmessage    # Conventional Commits template
├── .husky/        # Git hooks (commit-msg, pre-commit)
├── lint-staged.config.js
├── commitlint.config.js
├── SECURITY.md
├── CONTRIBUTING.md
├── .github/       # Issue/PR templates, workflows
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

### Running the whole project (frontend + backend)

```sh
npm run dev
```
This will start both the frontend and backend in parallel using `concurrently`.

### Running the Frontend only

```
npm run dev:frontend
```

### Running the Backend only

```
npm run dev:backend
```

### API Documentation (Swagger)

Once the backend is running, visit:
```
http://localhost:4000/api-docs
```
for interactive API docs.

## Git Commit Message Template

To help you write consistent commit messages, a template is provided in `.gitmessage` following the Conventional Commits standard.

### Set up the default commit message template:

```sh
git config --local commit.template .gitmessage
```

This will prompt you with the template when you run `git commit`.

## Linting, Formatting, and Testing
- Linting and formatting are enforced via Husky and lint-staged for both frontend and backend.
- Run all tests for both frontend and backend:
  ```sh
  npm test
  ```
- Pre-commit hooks will block commits if linting, formatting, or tests fail.

## Contributing & Security
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.
- See [SECURITY.md](./SECURITY.md) for security policy and reporting vulnerabilities.

## Notes
- All shared configuration (linting, formatting, etc.) should be placed at the root.
- Each package (frontend, backend) manages its own dependencies and scripts.

---

GitHub: https://github.com/building-for-fun/fountainCms

Feel free to add more details as your project evolves.
