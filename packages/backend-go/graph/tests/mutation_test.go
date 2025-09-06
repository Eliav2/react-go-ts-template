package tests

import (
	"testing"

	"backend-go/graph/tests/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// Todo Mutations

func TestCreateTodoMutation(t *testing.T) {
	// Setup test database
	client := testutil.SetupTestDB(t)
	defer client.Close()

	t.Run("creates a new todo", func(t *testing.T) {

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

		resp := testutil.ExecuteGraphQL(t, client, query, variables)

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

		resp := testutil.ExecuteGraphQL(t, client, query, variables)

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

		resp := testutil.ExecuteGraphQL(t, client, query, variables)

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

		resp := testutil.ExecuteGraphQL(t, client, query, variables)

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

// User Mutations

func TestCreateUserMutation(t *testing.T) {
	// Setup test database
	client := testutil.SetupTestDB(t)
	defer client.Close()

	t.Run("creates a new user", func(t *testing.T) {

		query := `
			mutation CreateUser($input: CreateUserInput!) {
				createUser(input: $input) {
					id
					email
					name
					todos {
						id
					}
				}
			}
		`

		variables := map[string]interface{}{
			"input": map[string]interface{}{
				"email": "new@example.com",
				"name":  "New User",
			},
		}

		resp := testutil.ExecuteGraphQL(t, client, query, variables)

		// Should have no errors
		assert.Empty(t, resp.Errors, "GraphQL mutation should not have errors")

		// Should return created user
		data, ok := resp.Data.(map[string]interface{})
		require.True(t, ok, "response data should be an object")

		createUser, ok := data["createUser"].(map[string]interface{})
		require.True(t, ok, "createUser should be an object")

		assert.NotEmpty(t, createUser["id"], "user should have an ID")
		assert.Equal(t, "new@example.com", createUser["email"])
		assert.Equal(t, "New User", createUser["name"])
		assert.Empty(t, createUser["todos"], "new user should have no todos")
	})
}

func TestUpdateUserMutation(t *testing.T) {
	// Setup test database
	client := testutil.SetupTestDB(t)
	defer client.Close()

	t.Run("updates existing user", func(t *testing.T) {
		// Create a user first
		user, _ := testutil.SeedTestData(t, client)

		query := `
			mutation UpdateUser($input: UpdateUserInput!) {
				updateUser(input: $input) {
					id
					email
					name
				}
			}
		`

		variables := map[string]interface{}{
			"input": map[string]interface{}{
				"id":    user.ID.String(),
				"email": "updated@example.com",
				"name":  "Updated User",
			},
		}

		resp := testutil.ExecuteGraphQL(t, client, query, variables)

		// Should have no errors
		assert.Empty(t, resp.Errors, "GraphQL mutation should not have errors")

		// Should return updated user
		data, ok := resp.Data.(map[string]interface{})
		require.True(t, ok, "response data should be an object")

		updateUser, ok := data["updateUser"].(map[string]interface{})
		require.True(t, ok, "updateUser should be an object")

		assert.Equal(t, user.ID.String(), updateUser["id"])
		assert.Equal(t, "updated@example.com", updateUser["email"])
		assert.Equal(t, "Updated User", updateUser["name"])
	})
}

func TestDeleteUserMutation(t *testing.T) {
	// Setup test database
	client := testutil.SetupTestDB(t)
	defer client.Close()

	t.Run("deletes existing user", func(t *testing.T) {
		// Create a user first
		user, _ := testutil.SeedTestData(t, client)

		query := `
			mutation DeleteUser($id: ID!) {
				deleteUser(id: $id)
			}
		`

		variables := map[string]interface{}{
			"id": user.ID.String(),
		}

		resp := testutil.ExecuteGraphQL(t, client, query, variables)

		// Should have no errors
		assert.Empty(t, resp.Errors, "GraphQL mutation should not have errors")

		// Should return true
		data, ok := resp.Data.(map[string]interface{})
		require.True(t, ok, "response data should be an object")

		deleteUser, ok := data["deleteUser"].(bool)
		require.True(t, ok, "deleteUser should be a boolean")
		assert.True(t, deleteUser, "deleteUser should return true")
	})

	t.Run("returns false for non-existent user", func(t *testing.T) {
		query := `
			mutation DeleteUser($id: ID!) {
				deleteUser(id: $id)
			}
		`

		variables := map[string]interface{}{
			"id": "00000000-0000-0000-0000-000000000000",
		}

		resp := testutil.ExecuteGraphQL(t, client, query, variables)

		// Should have no errors
		assert.Empty(t, resp.Errors, "GraphQL mutation should not have errors")

		// Should return false
		data, ok := resp.Data.(map[string]interface{})
		require.True(t, ok, "response data should be an object")

		deleteUser, ok := data["deleteUser"].(bool)
		require.True(t, ok, "deleteUser should be a boolean")
		assert.False(t, deleteUser, "deleteUser should return false for non-existent user")
	})
}
