package graph

import (
	"fmt"

	"backend-go/ent"
	"backend-go/graph/model"

	"github.com/google/uuid"
)

// User data mappers for converting between database entities and GraphQL models
//
// Naming Convention:
// - downstream: Database → Frontend (Ent entities → GraphQL models)
// - upstream: Frontend → Database (GraphQL inputs → Ent operations)

// =============================================================================
// DOWNSTREAM MAPPERS (Database → Frontend)
// =============================================================================

// downstreamUserMapper converts an Ent User entity to a GraphQL model
func downstreamUserMapper(entUser *ent.User) *model.User {
	user := &model.User{
		ID:    entUser.ID.String(),
		Email: entUser.Email,
		Name:  entUser.Name,
		Todos: []*model.Todo{}, // Initialize empty slice
	}

	// Add todos relationship if loaded
	if entUser.Edges.Todos != nil {
		todos := make([]*model.Todo, len(entUser.Edges.Todos))
		for i, entTodo := range entUser.Edges.Todos {
			todos[i] = downstreamTodoMapper(entTodo)
		}
		user.Todos = todos
	}

	return user
}

// =============================================================================
// UPSTREAM MAPPERS (Frontend → Database)
// =============================================================================

// upstreamCreateUserMapper prepares a user creation operation from GraphQL input
func upstreamCreateUserMapper(client *ent.Client, input model.CreateUserInput) *ent.UserCreate {
	return client.User.
		Create().
		SetEmail(input.Email).
		SetName(input.Name)
}

// upstreamUpdateUserMapper prepares a user update operation from GraphQL input
func upstreamUpdateUserMapper(client *ent.Client, input model.UpdateUserInput) (*ent.UserUpdateOne, error) {
	userID, err := uuid.Parse(input.ID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %w", err)
	}

	updateQuery := client.User.UpdateOneID(userID)

	if input.Email != nil {
		updateQuery = updateQuery.SetEmail(*input.Email)
	}
	if input.Name != nil {
		updateQuery = updateQuery.SetName(*input.Name)
	}

	return updateQuery, nil
}
