> **FountainCMS v1.0 – MVP Release Plan (Single Tenant, SaaS-Ready Architecture)**
> No timelines. Just scope, boundaries, and definition of done.

This becomes your internal product spec.

---

# 🚀 FountainCMS v1.0 — Release Plan

## 🎯 Product Positioning

**FountainCMS** is:

> A developer-first, API-driven headless CMS built for SaaS applications.

### Target Audience

- SaaS founders
- Backend engineers
- Startup teams building content-heavy products

### Non-Goals (Important)

v1.0 is NOT:

- A blogging CMS
- A website builder
- A no-code platform
- A multi-tenant SaaS yet
- A plugin marketplace

---

# 🧱 Core Pillars of v1.0

---

## 1️⃣ Schema Engine (Foundation Layer)

### Objective

Allow developers/admins to define structured content types dynamically.

### Capabilities

- Create Content Type
- Update Content Type
- Delete Content Type
- Define fields:
  - string
  - text
  - number
  - boolean
  - enum
  - date
  - relation (1:1, 1:N)

- Required / optional
- Default values
- Unique constraint
- Basic validation rules

### Storage Strategy

- Metadata-driven schema
- Content entries stored using JSONB
- No dynamic SQL table generation

### Definition of Done

- Schema definitions stored in DB
- Content types reflected automatically in API routes
- Validation enforced during create/update

---

## 2️⃣ Content Engine

### Objective

Enable CRUD operations on dynamic content types.

### Capabilities

- Create entry
- Read single entry
- List entries
- Update entry
- Delete entry
- Pagination
- Basic filtering
- Sorting

### Definition of Done (v1 current)

- CRUD works for all dynamic content types
- Validation tied to schema
- Entries stored as JSONB per collection; admin API requires JWT

### Draft/Publish (planned)

To be added in a follow-up:

- Each entry: `status: draft | published`, `published_at` timestamp
- Draft content not exposed on public read-only API; only published content returned there

---

## 3️⃣ REST API Layer

### Objective

Provide predictable, structured API access.

### API Structure

Content is exposed under a fixed path prefix; the collection name is the dynamic segment:

```
GET    /api/content/collections/:collection
GET    /api/content/collections/:collection/:id
POST   /api/content/collections/:collection
PATCH  /api/content/collections/:collection/:id
DELETE /api/content/collections/:collection/:id
```

All content types defined in the schema are available at the same path pattern (e.g. `posts`, `pages`).

### Features (v1 current)

- JWT-based authentication for admin and content APIs (global guard; selected routes are `@Public()`)
- All content types auto-exposed via REST at the paths above
- Unauthorized access blocked for protected routes

### Planned

- API key support for public read-only access (single-tenant global key)
- Role-based route guards per content type / operation
- Swagger/OpenAPI documentation

---

## 4️⃣ Authentication & RBAC

### Objective

Provide secure access control.

### Roles (v1 minimal)

- Super Admin
- Editor
- Viewer

### Permissions

- Per content type
- Per operation:
  - create
  - read
  - update
  - delete

No field-level permissions in v1.

### Definition of Done

- Roles stored in DB
- Permissions enforceable via guards
- Admin can assign roles to users

---

## 5️⃣ Media Module (Minimal)

### Objective

Enable asset upload and attachment to content.

### Capabilities

- File upload
- File metadata storage
- Attach media to content entries
- Serve media via URL

No:

- CDN integration
- Image optimization
- Media transformations

### Definition of Done

- Upload endpoint works
- Files linked to content entries
- Secure file access

---

## 6️⃣ Admin Interface (Functional, Not Fancy)

### Objective

Provide usable internal UI for managing content.

### Capabilities

- Create content types
- Manage entries
- Manage roles
- Manage users
- Publish/unpublish entries
- Upload media

No:

- Visual page builder
- Drag-and-drop layout builder
- Custom dashboard widgets

### Definition of Done

- Admin can fully operate CMS without DB access
- UI stable and usable

---

# 🏗 Architecture Principles

Even though v1 is single-tenant, architecture must be SaaS-ready.

### Modular Core

```
Core
 ├── Schema Module
 ├── Content Module
 ├── Auth Module
 ├── RBAC Module
 ├── Media Module
 └── API Layer
```

### Design Rules

- No hardcoded content types
- No business-logic coupling to schema
- No tenant-specific assumptions
- No UI logic in backend
- Strict module separation

---

# 🗄 Database Design Principles

- All schema definitions stored in DB
- Content entries stored as JSONB
- Proper indexing on:
  - id
  - content_type
  - status
  - created_at

- Audit fields:
  - created_by
  - updated_by
  - created_at
  - updated_at

---

# 🔐 Security Requirements

- JWT authentication required for admin APIs
- API key for public read access (optional config)
- Role-based guards enforced server-side
- Input validation at schema + request level
- Basic rate limiting

---

# 🧪 Quality Standards

Before release:

- CRUD fully functional
- Validation robust
- Permission system enforced
- API documented
- No hardcoded test values
- Basic performance testing on:
  - 10k entries
  - Pagination
  - Filtering

---

# 📦 Explicitly Deferred to v2+

These are intentionally NOT included:

- Multi-tenancy
- Stripe integration
- Usage tracking
- Plugin system
- GraphQL
- Webhooks
- Versioning
- Content history
- Field-level permissions
- SDK generation
- CLI tooling

---

# 🎯 Success Criteria for v1.0

FountainCMS 1.0 is successful if:

- A SaaS startup can use it as content backend
- It can power:
  - LMS platform
  - Documentation platform
  - Internal admin tool

- Developers can integrate it in < 1 hour
- No major architectural rewrite required to add multi-tenancy later

---

# 🧠 Final Strategic Note

v1.0 is not about features.

It’s about:

- Stability
- Clean architecture
- Developer trust
- Predictable behavior

If the core engine is strong, everything else layers on top.
