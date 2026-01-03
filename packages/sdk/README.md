# @fountaincms/sdk

Official JavaScript / TypeScript SDK for integrating with **FountainCMS**.

The SDK provides a simple, typed, and consistent way to interact with the FountainCMS API from frontend or backend applications.

> ⚠️ Status: **Active Development (Pre-v1)**
>
> The SDK API may change before version `1.0.0`.

---

## ✨ Features

- TypeScript-first API
- Simple client initialization
- Authentication helpers
- Content CRUD helpers
- Works in:
  - Browser
  - Node.js
  - React / Next.js
  - Any JS runtime with fetch/HTTP support

---

## 📦 Installation

```bash
npm install @fountaincms/sdk

or

pnpm add @fountaincms/sdk

or

yarn add @fountaincms/sdk
```

🚀 Getting Started
Create a client

```typescript
import { FountainClient } from '@fountaincms/sdk';

const client = new FountainClient({
  baseURL: 'http://localhost:3000',
});
```

🔐 Authentication
Login

```typescript
await client.auth.login('admin@example.com', 'password');
```

Logout

```typescript
await client.auth.logout();
```

Authentication tokens are managed internally by the client instance.

📚 Content API

Fetch multiple items

```typescript
const posts = await client.content.getMany('posts');
```

Fetch a single item

```typescript
const post = await client.content.getOne('posts', 'post-id');
```

Create an item

```typescript
const newPost = await client.content.create('posts', {
  title: 'Hello World',
  status: 'draft',
});
```

Update an item

```typescript
await client.content.update('posts', 'post-id', {
  title: 'Updated title',
});
```

Delete an item

```typescript
await client.content.remove('posts', 'post-id');
```

⚙️ Client Configuration

```typescript
const client = new FountainClient({
  baseURL: 'https://api.mycms.com',
  token: 'optional-static-token',
});
```

|         |        |                            |
| ------- | ------ | -------------------------- |
| Option  | Type   | Description                |
| baseURL | string | FountainCMS API base URL   |
| token   | string | Optional static auth token |

🧠 Design Philosophy

- Thin SDK – minimal abstraction over HTTP
- Predictable APIs – no magic behavior
- Framework agnostic – works everywhere
- Progressively enhanced – advanced features come later

🧪 Stability & Versioning

The SDK follows Semantic Versioning:

- `0.x` → APIs may change
- `1.0.0` → Stable public API
- Patch/minor releases will not introduce breaking changes post-v1

See CHANGELOG.md
for details.

🗺️ Roadmap

- Typed collections from schema
- React hooks & Vue composables
- Caching & optimistic updates
- Plugin & middleware system

🤝 Contributing

Contributions are welcome!

If you're working in the main FountainCMS monorepo:

- SDK lives in packages/sdk
- Keep SDK independent of frontend frameworks
- Avoid tight coupling with backend internals
