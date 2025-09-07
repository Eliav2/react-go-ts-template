# Todo Assignment App Template

A full-stack todo application template with user assignment functionality. This template demonstrates modern development practices with multiple backend implementations and a unified development experience.

## Architecture

- **Frontend**: React SPA with TypeScript and Vite
- **Backend Options**:
  - TypeScript backend using Hono with Bun runtime
  - Go backend using GraphQL with Ent ORM
- **Database**: PostgreSQL with schema managed by Drizzle ORM
- **GraphQL**: Typesafe GraphQL API for todo and user management

## Features

- Create, update, and delete todos
- Create, update, and delete users
- Assign todos to users
- View todos by user and users by their todos
- Full GraphQL API with type safety

## Development

### Quick Start

1. **Start the database:**

```bash
docker-compose up -d
```

2. **Run the development environment:**

```bash
npm run dev
```

The `npm run dev` command starts:

- Frontend development server with hot reload
- both backends with auto-reload

The development environment assumes PostgreSQL is running locally (via Docker or native installation).

### Backend Selection

Switch between backends by editing `packages/frontend/vite.config.ts`:

**TypeScript Backend (Port 3000):**

```typescript
"/graphql": {
  target: "http://localhost:3000",
  changeOrigin: true,
}
```

**Go Backend (Port 8080):**

```typescript
"/graphql": {
  target: "http://localhost:8080",
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/graphql/, "/query"),
}
```

### Tech Stack

- **Frontend**: React, TypeScript, TanStack Router, Vite
- **TypeScript Backend**: Hono, Bun, GraphQL Yoga, Drizzle ORM
- **Go Backend**: Go, GraphQL (gqlgen), Ent ORM
- **Database**: PostgreSQL with Docker
- **Development**: Hot reload, auto-restart, unified dev command
