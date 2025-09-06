package graph

import (
	"testing"

	"backend-go/ent"
	"backend-go/graph/generated"
	"backend-go/internal/testutil"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// createGraphQLServer creates a GraphQL server for testing
func createGraphQLServer(client *ent.Client) *handler.Server {
	resolver := &Resolver{
		Client: client,
	}
	return handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: resolver}))
}

func TestTodosQuery(t *testing.T) {
	// Setup test database
	client := testutil.SetupTestDB(t)
	defer client.Close()

	t.Run("returns empty list when no todos", func(t *testing.T) {
		srv := createGraphQLServer(client)

		query := `{
			todos {
				id
				title
				completed
			}
		}`

		resp := testutil.ExecuteGraphQL(t, srv, query, nil)

		// Should have no errors
		assert.Empty(t, resp.Errors, "GraphQL query should not have errors")

		// Should return empty todos array
		data, ok := resp.Data.(map[string]interface{})
		require.True(t, ok, "response data should be an object")

		todos, ok := data["todos"].([]interface{})
		require.True(t, ok, "todos should be an array")
		assert.Empty(t, todos, "todos array should be empty")
	})

	t.Run("returns todos when they exist", func(t *testing.T) {
		// Seed test data
		user, todo := testutil.SeedTestData(t, client)
		srv := createGraphQLServer(client)

		query := `{
			todos {
				id
				title
				completed
			}
		}`

		resp := testutil.ExecuteGraphQL(t, srv, query, nil)

		// Should have no errors
		assert.Empty(t, resp.Errors, "GraphQL query should not have errors")

		// Should return todos array with one item
		data, ok := resp.Data.(map[string]interface{})
		require.True(t, ok, "response data should be an object")

		todos, ok := data["todos"].([]interface{})
		require.True(t, ok, "todos should be an array")
		require.Len(t, todos, 1, "should have exactly one todo")

		// Check todo data
		todoData, ok := todos[0].(map[string]interface{})
		require.True(t, ok, "todo should be an object")

		assert.Equal(t, todo.ID.String(), todoData["id"])
		assert.Equal(t, "Test Todo", todoData["title"])
		assert.Equal(t, false, todoData["completed"])

		// Verify user was created
		assert.Equal(t, "test@example.com", user.Email)
		assert.Equal(t, "Test User", user.Name)
	})
}

func TestCreateTodoMutation(t *testing.T) {
	// Setup test database
	client := testutil.SetupTestDB(t)
	defer client.Close()

	t.Run("creates a new todo", func(t *testing.T) {
		srv := createGraphQLServer(client)

		query := `
			mutation CreateTodo($input: CreateTodoInput!) {
				createTodo(input: $input) {
					id
					title
					completed
				}
			}
		`

		variables := map[string]interface{}{
			"input": map[string]interface{}{
				"title": "New Test Todo",
			},
		}

		resp := testutil.ExecuteGraphQL(t, srv, query, variables)

		// Should have no errors
		assert.Empty(t, resp.Errors, "GraphQL mutation should not have errors")

		// Should return created todo
		data, ok := resp.Data.(map[string]interface{})
		require.True(t, ok, "response data should be an object")

		createTodo, ok := data["createTodo"].(map[string]interface{})
		require.True(t, ok, "createTodo should be an object")

		assert.NotEmpty(t, createTodo["id"], "todo should have an ID")
		assert.Equal(t, "New Test Todo", createTodo["title"])
		assert.Equal(t, false, createTodo["completed"])
	})
}

func TestUpdateTodoMutation(t *testing.T) {
	// Setup test database
	client := testutil.SetupTestDB(t)
	defer client.Close()

	t.Run("updates existing todo", func(t *testing.T) {
		// Create a todo first
		_, todo := testutil.SeedTestData(t, client)

		query := `
			mutation UpdateTodo($input: UpdateTodoInput!) {
				updateTodo(input: $input) {
					id
					title
					completed
				}
			}
		`

		variables := map[string]interface{}{
			"input": map[string]interface{}{
				"id":    todo.ID.String(),
				"title": "Updated Todo",
				"done":  true,
			},
		}

		srv := createGraphQLServer(client)
		resp := testutil.ExecuteGraphQL(t, srv, query, variables)

		// Should have no errors
		assert.Empty(t, resp.Errors, "GraphQL mutation should not have errors")

		// Should return updated todo
		data, ok := resp.Data.(map[string]interface{})
		require.True(t, ok, "response data should be an object")

		updateTodo, ok := data["updateTodo"].(map[string]interface{})
		require.True(t, ok, "updateTodo should be an object")

		assert.Equal(t, todo.ID.String(), updateTodo["id"])
		assert.Equal(t, "Updated Todo", updateTodo["title"])
		assert.Equal(t, true, updateTodo["completed"])
	})
}

func TestDeleteTodoMutation(t *testing.T) {
	// Setup test database
	client := testutil.SetupTestDB(t)
	defer client.Close()

	t.Run("deletes existing todo", func(t *testing.T) {
		// Create a todo first
		_, todo := testutil.SeedTestData(t, client)

		query := `
			mutation DeleteTodo($id: ID!) {
				deleteTodo(id: $id)
			}
		`

		variables := map[string]interface{}{
			"id": todo.ID.String(),
		}

		srv := createGraphQLServer(client)
		resp := testutil.ExecuteGraphQL(t, srv, query, variables)

		// Should have no errors
		assert.Empty(t, resp.Errors, "GraphQL mutation should not have errors")

		// Should return true
		data, ok := resp.Data.(map[string]interface{})
		require.True(t, ok, "response data should be an object")

		deleteTodo, ok := data["deleteTodo"].(bool)
		require.True(t, ok, "deleteTodo should be a boolean")
		assert.True(t, deleteTodo, "deleteTodo should return true")
	})

	t.Run("returns false for non-existent todo", func(t *testing.T) {
		query := `
			mutation DeleteTodo($id: ID!) {
				deleteTodo(id: $id)
			}
		`

		variables := map[string]interface{}{
			"id": "00000000-0000-0000-0000-000000000000",
		}

		srv := createGraphQLServer(client)
		resp := testutil.ExecuteGraphQL(t, srv, query, variables)

		// Should have no errors
		assert.Empty(t, resp.Errors, "GraphQL mutation should not have errors")

		// Should return false
		data, ok := resp.Data.(map[string]interface{})
		require.True(t, ok, "response data should be an object")

		deleteTodo, ok := data["deleteTodo"].(bool)
		require.True(t, ok, "deleteTodo should be a boolean")
		assert.False(t, deleteTodo, "deleteTodo should return false for non-existent todo")
	})
}
