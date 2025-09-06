# Go GraphQL Backend with gqlgen

This is a Go backend implementation using gqlgen for GraphQL code generation, designed to compare with the TypeScript backend implementation.

## Key Benefits of gqlgen

1. **Automatic Code Generation**: Unlike TypeScript where you manually write resolvers, gqlgen generates resolver stubs automatically from your GraphQL schema
2. **Type Safety**: All GraphQL types are automatically converted to Go structs with proper type checking
3. **Schema-First Development**: Write your schema once, and gqlgen generates all the boilerplate
4. **Hot Reload**: Schema changes automatically regenerate code during development

## Project Structure

```
backend-go/
├── graph/
│   ├── generated/          # Auto-generated GraphQL server code
│   ├── model/             # Auto-generated model structs
│   ├── schema.graphqls    # GraphQL schema definition
│   ├── schema.resolvers.go # Resolver implementations (you edit this)
│   ├── resolver.go        # Main resolver struct
│   └── storage.go         # In-memory storage implementation
├── gqlgen.yml            # gqlgen configuration
├── main.go               # HTTP server setup
└── Makefile             # Build and dev commands
```

## Getting Started

1. **Install dependencies:**

   ```bash
   make deps
   ```

2. **Run development server:**

   ```bash
   make dev
   ```

3. **Access GraphQL Playground:**
   Open http://localhost:8080 in your browser

## Development Workflow

1. **Modify Schema**: Edit `graph/schema.graphqls`
2. **Regenerate Code**: Run `make generate`
3. **Implement Resolvers**: Update `graph/schema.resolvers.go`
4. **Test**: Use GraphQL Playground or your frontend

## Example Queries

### Get all todos:

```graphql
query {
  todos {
    id
    title
    completed
  }
}
```

### Create a todo:

```graphql
mutation {
  createTodo(input: { title: "Learn gqlgen" }) {
    id
    title
    completed
  }
}
```

### Update a todo:

```graphql
mutation {
  updateTodo(input: { id: "1", title: "Updated title", done: true }) {
    id
    title
    completed
  }
}
```

### Delete a todo:

```graphql
mutation {
  deleteTodo(id: "1")
}
```

## Comparison with TypeScript Backend

### Advantages of gqlgen:

- ✅ **Automatic resolver generation** - no manual stub creation needed
- ✅ **Compile-time type safety** - Go's strong typing catches errors early
- ✅ **Performance** - compiled binary runs faster than interpreted TypeScript
- ✅ **Schema-first approach** - changes to schema automatically update code
- ✅ **Less boilerplate** - generated code handles GraphQL parsing/validation

### TypeScript Backend Advantages:

- ✅ **Ecosystem** - larger npm ecosystem
- ✅ **Learning curve** - JavaScript/TypeScript more familiar to web developers
- ✅ **Rapid prototyping** - faster iteration in some cases
- ✅ **Frontend alignment** - same language as React frontend
