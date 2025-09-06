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

// ExecuteGraphQLWithServer executes a GraphQL query against the test server
func ExecuteGraphQLWithServer(t *testing.T, srv http.Handler, query string, variables map[string]interface{}) *GraphQLResponse {
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

// ExecuteGraphQLWithServerAndContext executes a GraphQL query with a custom context
func ExecuteGraphQLWithServerAndContext(t *testing.T, srv http.Handler, ctx context.Context, query string, variables map[string]interface{}) *GraphQLResponse {
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

// CreateGraphQLServer creates a GraphQL server for testing
func CreateGraphQLServer(client *ent.Client) *handler.Server {
	resolver := &graph.Resolver{
		Client: client,
	}
	return handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: resolver}))
}

// ExecuteGraphQL is a convenience wrapper that creates the server and executes GraphQL
func ExecuteGraphQL(t *testing.T, client *ent.Client, query string, variables map[string]interface{}) *GraphQLResponse {
	srv := CreateGraphQLServer(client)
	return ExecuteGraphQLWithServer(t, srv, query, variables)
}
