package tests

import (
	"context"
	"testing"

	"backend-go/graph/tests/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestUserTodoRelationships(t *testing.T) {
	// Setup test database
	client := testutil.SetupTestDB(t)
	defer client.Close()

	t.Run("creates user and their todos", func(t *testing.T) {

		// 1. Create a user
		createUserQuery := `
			mutation CreateUser($input: CreateUserInput!) {
				createUser(input: $input) {
					id
					email
					name
					todos {
						id
						title
					}
				}
			}
		`

		userVars := map[string]interface{}{
			"input": map[string]interface{}{
				"email": "john@example.com",
				"name":  "John Doe",
			},
		}

		userResp := testutil.ExecuteGraphQL(t, client, createUserQuery, userVars)
		require.Empty(t, userResp.Errors)

		// Extract user data
		userData := userResp.Data.(map[string]interface{})["createUser"].(map[string]interface{})
		userID := userData["id"].(string)

		assert.Equal(t, "john@example.com", userData["email"])
		assert.Equal(t, "John Doe", userData["name"])
		assert.Empty(t, userData["todos"]) // Should be empty initially

		// 2. Create a todo for this user
		createTodoQuery := `
			mutation CreateTodo($input: CreateTodoInput!) {
				createTodo(input: $input) {
					id
					title
					completed
					userId
					user {
						id
						email
						name
					}
				}
			}
		`

		todoVars := map[string]interface{}{
			"input": map[string]interface{}{
				"title":  "John's first task",
				"userId": userID,
			},
		}

		todoResp := testutil.ExecuteGraphQL(t, client, createTodoQuery, todoVars)
		require.Empty(t, todoResp.Errors)

		// Extract todo data
		todoData := todoResp.Data.(map[string]interface{})["createTodo"].(map[string]interface{})

		assert.Equal(t, "John's first task", todoData["title"])
		assert.Equal(t, false, todoData["completed"])
		assert.Equal(t, userID, todoData["userId"])

		// Check user relationship
		userInTodo := todoData["user"].(map[string]interface{})
		assert.Equal(t, userID, userInTodo["id"])
		assert.Equal(t, "john@example.com", userInTodo["email"])
		assert.Equal(t, "John Doe", userInTodo["name"])
	})

	t.Run("queries todos with their users", func(t *testing.T) {

		// Create user and todo with unique email
		ctx := context.Background()

		// Create a test user with unique email
		user, err := client.User.
			Create().
			SetEmail("unique-test@example.com").
			SetName("Unique Test User").
			Save(ctx)
		require.NoError(t, err, "failed to create unique test user")

		// Create a test todo for the user
		todo, err := client.Todo.
			Create().
			SetTitle("Unique Test Todo").
			SetCompleted(false).
			SetUser(user).
			Save(ctx)
		require.NoError(t, err, "failed to create unique test todo")

		query := `{
			todos {
				id
				title
				completed
				userId
				user {
					id
					email
					name
				}
			}
		}`

		resp := testutil.ExecuteGraphQL(t, client, query, nil)
		require.Empty(t, resp.Errors)

		data := resp.Data.(map[string]interface{})
		todos := data["todos"].([]interface{})

		// Should have our test todos
		require.NotEmpty(t, todos)

		// Find our test todo
		var testTodo map[string]interface{}
		for _, t := range todos {
			todo := t.(map[string]interface{})
			if todo["title"] == "Unique Test Todo" {
				testTodo = todo
				break
			}
		}

		require.NotNil(t, testTodo, "Should find test todo")
		assert.Equal(t, todo.ID.String(), testTodo["id"])
		assert.Equal(t, "Unique Test Todo", testTodo["title"])
		assert.Equal(t, false, testTodo["completed"])
		assert.Equal(t, user.ID.String(), testTodo["userId"])

		// Check user relationship
		userData := testTodo["user"].(map[string]interface{})
		assert.Equal(t, user.ID.String(), userData["id"])
		assert.Equal(t, "unique-test@example.com", userData["email"])
		assert.Equal(t, "Unique Test User", userData["name"])
	})

	t.Run("creates todo without user", func(t *testing.T) {

		query := `
			mutation CreateTodo($input: CreateTodoInput!) {
				createTodo(input: $input) {
					id
					title
					completed
					userId
					user {
						id
					}
				}
			}
		`

		variables := map[string]interface{}{
			"input": map[string]interface{}{
				"title": "Orphan Todo",
			},
		}

		resp := testutil.ExecuteGraphQL(t, client, query, variables)
		require.Empty(t, resp.Errors)

		data := resp.Data.(map[string]interface{})["createTodo"].(map[string]interface{})

		assert.Equal(t, "Orphan Todo", data["title"])
		assert.Equal(t, false, data["completed"])
		assert.Nil(t, data["userId"])
		assert.Nil(t, data["user"])
	})

	t.Run("user deletion cascades to todos", func(t *testing.T) {
		ctx := context.Background()

		// Create a user and todo
		user, err := client.User.
			Create().
			SetEmail("cascade-test@example.com").
			SetName("Cascade Test User").
			Save(ctx)
		require.NoError(t, err)

		todo, err := client.Todo.
			Create().
			SetTitle("Todo for cascade test").
			SetUser(user).
			Save(ctx)
		require.NoError(t, err)

		// Delete the user
		deleteUserQuery := `
			mutation DeleteUser($id: ID!) {
				deleteUser(id: $id)
			}
		`

		variables := map[string]interface{}{
			"id": user.ID.String(),
		}

		resp := testutil.ExecuteGraphQL(t, client, deleteUserQuery, variables)
		require.Empty(t, resp.Errors)

		// Verify user was deleted
		data := resp.Data.(map[string]interface{})
		deleteResult := data["deleteUser"].(bool)
		assert.True(t, deleteResult)

		// Verify todo still exists but user relationship is null
		queryTodos := `{
			todos {
				id
				title
				userId
				user {
					id
				}
			}
		}`

		todosResp := testutil.ExecuteGraphQL(t, client, queryTodos, nil)
		require.Empty(t, todosResp.Errors)

		todosData := todosResp.Data.(map[string]interface{})
		todos := todosData["todos"].([]interface{})

		// Find our todo
		var testTodo map[string]interface{}
		for _, t := range todos {
			todoItem := t.(map[string]interface{})
			if todoItem["title"] == "Todo for cascade test" {
				testTodo = todoItem
				break
			}
		}

		require.NotNil(t, testTodo, "Todo should still exist")
		assert.Equal(t, todo.ID.String(), testTodo["id"])
		assert.Nil(t, testTodo["userId"], "User ID should be null after user deletion")
		assert.Nil(t, testTodo["user"], "User relationship should be null")
	})
}
