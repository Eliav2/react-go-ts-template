# Frontend Todo Manager

A React frontend application for managing todos and users, built with modern web technologies.

## Tech Stack

- **React 19** - UI framework
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Data fetching and caching
- **TypeScript** - Type safety
- **Vite** - Build tool
- **GraphQL Codegen** - Automatic query hook generation

## Features

### Current Implementation (Part 1)

- ✅ Modern layout with navigation
- ✅ Routing between todos and users pages
- ✅ Todos table with placeholder data
- ✅ User assignment functionality (dropdown in table)
- ✅ Toggle todo completion status
- ✅ Users management page with CRUD operations
- ✅ Responsive design with clean styling

### Planned for Part 2

- 🔄 GraphQL query integration
- 🔄 Real data fetching from Go backend
- 🔄 Automatic query hook generation
- 🔄 Error handling and loading states

## Project Structure

```
src/
├── components/
│   ├── TodosTable.tsx      # Main todos table with user assignment
│   └── UsersPage.tsx       # User management with CRUD operations
├── routes/
│   ├── __root.tsx          # Root layout with navigation
│   ├── index.tsx           # Todos page route
│   └── users.tsx           # Users page route
├── queries/                # GraphQL queries (Part 2)
├── generated/              # Auto-generated query hooks (Part 2)
└── main.tsx               # App entry point
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm codegen` - Generate GraphQL hooks (Part 2)

## Data Models

### Todo

- `id`: Unique identifier
- `title`: Todo description
- `completed`: Boolean status
- `user`: Assigned user (optional)
- `userId`: Assigned user ID (optional)

### User

- `id`: Unique identifier
- `name`: User's full name
- `email`: User's email address

## Features Detail

### Todos Table

- View all todos in a clean table format
- Assign/unassign users to todos via dropdown
- Toggle completion status with one click
- Visual status indicators (completed/pending)

### Users Management

- View all users in a table
- Create new users with name and email
- Edit existing user information
- Delete users (with confirmation)
- Automatic cleanup of todo assignments when user is deleted

## Routing

- `/` - Main todos table
- `/users` - User management page

Navigation is available in the top header with active state indicators.

## Styling

Clean, modern design with:

- Responsive layout
- Consistent color scheme
- Hover effects and transitions
- Form validation styling
- Status indicators
- Professional table design

## Next Steps (Part 2)

1. Create GraphQL query files in `src/queries/`
2. Configure GraphQL endpoint in codegen
3. Generate type-safe query hooks
4. Replace placeholder data with real API calls
5. Add error handling and loading states
6. Implement optimistic updates for better UX
