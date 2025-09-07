package graph

import (
	"context"
	"fmt"

	"backend-go/ent"
	"backend-go/graph/model"

	"github.com/google/uuid"
)

// Todo data mappers for converting between database entities and GraphQL models
//
// Naming Convention:
// - downstream: Database → Frontend (Ent entities → GraphQL models)
// - upstream: Frontend → Database (GraphQL inputs → Ent operations)

// =============================================================================
// DOWNSTREAM MAPPERS (Database → Frontend)
// =============================================================================

// downstreamTodoMapper converts an Ent Todo entity to a GraphQL model
func downstreamTodoMapper(entTodo *ent.Todo) *model.Todo {
	todo := &model.Todo{
		ID:        entTodo.ID.String(),
		Title:     entTodo.Title,
		Completed: entTodo.Completed,
	}

	// Add user relationship if loaded
	if entTodo.Edges.User != nil {
		user := downstreamUserMapper(entTodo.Edges.User)
		todo.User = user
		// Also set the userID from the loaded user
		todo.UserID = &user.ID
	}

	return todo
}

// =============================================================================
// UPSTREAM MAPPERS (Frontend → Database)
// =============================================================================

// upstreamCreateTodoMapper prepares a todo creation operation from GraphQL input
func upstreamCreateTodoMapper(client *ent.Client, input model.CreateTodoInput) (*ent.TodoCreate, error) {
	createQuery := client.Todo.
		Create().
		SetTitle(input.Title)

	// Set user if provided
	if input.UserID != nil {
		userID, err := uuid.Parse(*input.UserID)
		if err == nil { // Only set if valid UUID
			// make sure the user exists
			_, err = client.User.Get(context.Background(), userID)
			if err != nil {
				return nil, fmt.Errorf("user with id %s not found", userID)
			}
			createQuery = createQuery.SetUserID(userID)
		}
	}

	return createQuery, nil
}

// upstreamUpdateTodoMapper prepares a todo update operation from GraphQL input
func upstreamUpdateTodoMapper(client *ent.Client, input model.UpdateTodoInput) (*ent.TodoUpdateOne, error) {
	todoID, err := uuid.Parse(input.ID)
	if err != nil {
		return nil, fmt.Errorf("invalid todo ID: %w", err)
	}

	updateQuery := client.Todo.UpdateOneID(todoID)

	if input.Title != nil {
		updateQuery = updateQuery.SetTitle(*input.Title)
	}
	if input.Done != nil {
		updateQuery = updateQuery.SetCompleted(*input.Done)
	}
	if input.UserID != nil {
		userID, err := uuid.Parse(*input.UserID)
		if err == nil { // Only set if valid UUID
			// make sure the user exists
			_, err = client.User.Get(context.Background(), userID)
			if err != nil {
				return nil, fmt.Errorf("user with id %s not found", userID)
			}
			updateQuery = updateQuery.SetUserID(userID)
		}
	}

	return updateQuery, nil
}
