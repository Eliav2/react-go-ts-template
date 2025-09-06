package tests

import (
	"testing"

	"backend-go/graph/tests/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestTodosQuery(t *testing.T) {
	// Setup test database
	client := testutil.SetupTestDB(t)
	defer client.Close()

	t.Run("returns empty list when no todos", func(t *testing.T) {

		query := `{
			todos {
				id
				title
				completed
			}
		}`

		resp := testutil.ExecuteGraphQL(t, client, query, nil)

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

		query := `{
			todos {
				id
				title
				completed
			}
		}`

		resp := testutil.ExecuteGraphQL(t, client, query, nil)

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

func TestUsersQuery(t *testing.T) {
	// Setup test database
	client := testutil.SetupTestDB(t)
	defer client.Close()

	t.Run("returns users with their todos", func(t *testing.T) {
		// Create user and todo first
		user, todo := testutil.SeedTestData(t, client)

		query := `{
			users {
				id
				email
				name
				todos {
					id
					title
					completed
				}
			}
		}`

		resp := testutil.ExecuteGraphQL(t, client, query, nil)
		require.Empty(t, resp.Errors)

		data := resp.Data.(map[string]interface{})
		users := data["users"].([]interface{})

		// Should have at least our test user
		require.NotEmpty(t, users)

		// Find our test user
		var testUser map[string]interface{}
		for _, u := range users {
			user := u.(map[string]interface{})
			if user["email"] == "test@example.com" {
				testUser = user
				break
			}
		}

		require.NotNil(t, testUser, "Should find test user")
		assert.Equal(t, user.ID.String(), testUser["id"])
		assert.Equal(t, "test@example.com", testUser["email"])
		assert.Equal(t, "Test User", testUser["name"])

		// Check todos
		todos := testUser["todos"].([]interface{})
		require.Len(t, todos, 1)

		todoData := todos[0].(map[string]interface{})
		assert.Equal(t, todo.ID.String(), todoData["id"])
		assert.Equal(t, "Test Todo", todoData["title"])
		assert.Equal(t, false, todoData["completed"])
	})
}
