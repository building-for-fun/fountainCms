# <img src="assets/logo.png" alt="FountainCMS Logo" width="48" height="48" style="vertical-align:middle;"> FountainCMS Monorepo

This repository is organized as a monorepo for the FountainCMS ecosystem, containing both frontend (React) and backend (NestJS) codebases.

## Structure

```
fountaincms/
├── frontend/      # React + Vite frontend app
│   ├── src/
│   ├── public/
│   ├── vite.config.ts
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
├── backend/       # NestJS backend (TypeScript)
│   ├── src/
│   │   ├── content/
│   │   ├── roles/
│   │   ├── user/
│   │   └── ...
│   ├── test/
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── README.md
├── package.json   # Monorepo root (workspaces)
├── .gitmessage    # Conventional Commits template
├── .husky/        # Git hooks (commit-msg, pre-commit)
├── lint-staged.config.js
├── commitlint.config.js
├── SECURITY.md
├── CONTRIBUTING.md
├── .github/       # Issue/PR templates, workflows
├── .nvmrc         # Node.js version for development (v22.13.1)
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (**v22.13.1** required, see `.nvmrc`)
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

```sh
npm run dev:frontend
```

### Running the Backend only

```sh
npm run dev:backend
```

### API Documentation (Swagger) (Available after task completion [#20](https://github.com/building-for-fun/fountainCms/issues/20))

Once the backend is running, visit:

```
http://localhost:4000/api-docs
```

for interactive API docs (NestJS Swagger).

## Git Commit Message Template

To help you write consistent commit messages, a template is provided in `.gitmessage` following the Conventional Commits
standard.

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

## Release Management & Changelog

This project uses [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### Tagging a Release

1. Update `CHANGELOG.md` with changes for the new version.
2. Commit your changes:
   ```sh
   git add CHANGELOG.md
   git commit -m "chore(release): update changelog for vX.Y.Z"
   ```
3. Tag the release:
   ```sh
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```
4. Push your branch and tags:
   ```sh
   git push --follow-tags
   ```

### Example Changelog Entry

See [CHANGELOG.md](./CHANGELOG.md) for the latest changes and release history.

## Contributing & Security

- See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.
- See [SECURITY.md](./SECURITY.md) for security policy and reporting vulnerabilities.

## Community & Announcements

### 🚀 Migration Complete!

FountainCMS backend has been successfully migrated from Node.js/Express to NestJS for improved scalability, modularity,
and type safety.

- All API endpoints are now powered by NestJS.
- Documentation and developer experience have been enhanced.
- Release management and changelog are now in place for transparency.

### 🤝 Get Involved!

We welcome contributors of all experience levels:

- Help us build new features and integrations
- Report and fix bugs
- Improve documentation and developer experience
- Review and test code

**How to join:**

- Check [GitHub Issues](https://github.com/building-for-fun/fountainCms/issues) for open tasks and feature requests
- Start or join discussions in [GitHub Discussions](https://github.com/building-for-fun/fountainCms/discussions)
- Submit pull requests for improvements

**Connect with us:**

- Star the repo to show your support
- Share feedback and ideas
- Join our open source journey!

---

GitHub: https://github.com/building-for-fun/fountainCms

Feel free to add more details as your project evolves.

<hr>
<h2 align = "center">Our Contributors ❤️</h2>
<div align = "center">
 <h3>Thank you for contributing to our repository</h3>

<p><a href="https://github.com/building-for-fun/RepoStore/contributors">
  <img src="https://contributors-img.web.app/image?repo=building-for-fun/fountainCMS" />
</a></p>
