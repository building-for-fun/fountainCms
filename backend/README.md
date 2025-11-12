# FountainCMS Backend

A scalable, API-first headless CMS backend built with NestJS and TypeScript. Designed for open source collaboration and JAMstack workflows.

## Features
- NestJS (TypeScript) REST API
- Modular architecture: Content, User, Roles
- CORS and JSON parsing enabled
- Ready for extension and integration

## Getting Started

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Setup
```bash
# Clone the repository
$ git clone https://github.com/building-for-fun/fountainCms
$ cd fountainCms/backend

# Install dependencies
$ npm install
```

# Copy `.env.sample` to `.env`
```bash
cp .env.sample .env
```

### Development
```bash
# Start the development server
$ npm run start:dev
# The API will be available at http://localhost:4000
```

### Production
```bash
$ npm run build
$ npm run start:prod
```

### Run Tests
```bash
$ npm run test
$ npm run test:e2e
```

## API Endpoints
- `/api/content` - Content management
- `/api/user` - User management
- `/api/roles` - Roles management

## Contributing
We welcome contributions! Please read our [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
- Fork the repo and create your branch from `main`
- Run `npm run format` before submitting PRs
- Add tests for new features

## Community & Support
- Issues and feature requests: [GitHub Issues](https://github.com/building-for-fun/fountainCms/issues)
- Discussions: [GitHub Discussions](https://github.com/building-for-fun/fountainCms/discussions)

## License
MIT
