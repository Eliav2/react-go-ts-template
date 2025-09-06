package testutil

import (
	"context"
	"testing"

	"backend-go/ent"
	"backend-go/ent/enttest"
	"entgo.io/ent/dialect"
	"github.com/stretchr/testify/require"

	_ "github.com/mattn/go-sqlite3"
)

// SetupTestDB creates an in-memory SQLite database for testing
func SetupTestDB(t *testing.T) *ent.Client {
	client := enttest.Open(t, dialect.SQLite, "file:ent?mode=memory&cache=shared&_fk=1")
	
	// Run the auto migration to create tables
	ctx := context.Background()
	err := client.Schema.Create(ctx)
	require.NoError(t, err, "failed to create test schema")
	
	return client
}

// SeedTestData creates some test data
func SeedTestData(t *testing.T, client *ent.Client) (*ent.User, *ent.Todo) {
	ctx := context.Background()
	
	// Create a test user
	user, err := client.User.
		Create().
		SetEmail("test@example.com").
		SetName("Test User").
		Save(ctx)
	require.NoError(t, err, "failed to create test user")
	
	// Create a test todo for the user
	todo, err := client.Todo.
		Create().
		SetTitle("Test Todo").
		SetCompleted(false).
		SetUser(user).
		Save(ctx)
	require.NoError(t, err, "failed to create test todo")
	
	return user, todo
}
