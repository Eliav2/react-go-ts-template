package testutil

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend-go/ent"
	"backend-go/graph"
	"backend-go/graph/generated"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/stretchr/testify/require"
)

// GraphQLRequest represents a GraphQL request
type GraphQLRequest struct {
	Query     string                 `json:"query"`
	Variables map[string]interface{} `json:"variables,omitempty"`
}

// GraphQLResponse represents a GraphQL response
type GraphQLResponse struct {
	Data   interface{} `json:"data"`
	Errors []struct {
		Message string        `json:"message"`
		Path    []interface{} `json:"path"`
	} `json:"errors"`
}

// ExecuteGraphQL executes a GraphQL query against the test server
func ExecuteGraphQL(t *testing.T, client *ent.Client, query string, variables map[string]interface{}) *GraphQLResponse {
	// Create resolver with test client
	resolver := &graph.Resolver{
		Client: client,
	}

	// Create GraphQL handler
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: resolver}))

	// Prepare request
	reqBody := GraphQLRequest{
		Query:     query,
		Variables: variables,
	}

	jsonBody, err := json.Marshal(reqBody)
	require.NoError(t, err, "failed to marshal GraphQL request")

	// Create HTTP request
	req := httptest.NewRequest(http.MethodPost, "/query", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")

	// Execute request
	w := httptest.NewRecorder()
	srv.ServeHTTP(w, req)

	// Parse response
	var response GraphQLResponse
	err = json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err, "failed to unmarshal GraphQL response")

	return &response
}

// ExecuteGraphQLWithContext executes a GraphQL query with a custom context
func ExecuteGraphQLWithContext(t *testing.T, client *ent.Client, ctx context.Context, query string, variables map[string]interface{}) *GraphQLResponse {
	// Create resolver with test client
	resolver := &graph.Resolver{
		Client: client,
	}

	// Create GraphQL handler
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: resolver}))

	// Prepare request
	reqBody := GraphQLRequest{
		Query:     query,
		Variables: variables,
	}

	jsonBody, err := json.Marshal(reqBody)
	require.NoError(t, err, "failed to marshal GraphQL request")

	// Create HTTP request with context
	req := httptest.NewRequest(http.MethodPost, "/query", bytes.NewBuffer(jsonBody))
	req = req.WithContext(ctx)
	req.Header.Set("Content-Type", "application/json")

	// Execute request
	w := httptest.NewRecorder()
	srv.ServeHTTP(w, req)

	// Parse response
	var response GraphQLResponse
	err = json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err, "failed to unmarshal GraphQL response")

	return &response
}
