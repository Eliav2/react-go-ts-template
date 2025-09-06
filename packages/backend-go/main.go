package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gorilla/mux"
	"github.com/rs/cors"

	"github.com/eliav/exercise-drizzle-react/packages/backend-go/graph"
	"github.com/eliav/exercise-drizzle-react/packages/backend-go/graph/generated"
)

const defaultPort = "8080"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	// Create storage
	todoStorage := graph.NewTodoStorage()

	// Create resolver with storage
	resolver := &graph.Resolver{
		TodoStorage: todoStorage,
	}

	// Create GraphQL server
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: resolver}))

	// Create router
	router := mux.NewRouter()

	// GraphQL endpoints
	router.Handle("/", playground.Handler("GraphQL playground todos", "/query")).Methods("GET")
	router.Handle("/query", srv).Methods("POST")

	// Enable CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:5173", "http://localhost:8080"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	log.Printf("🚀 GraphQL server ready at http://localhost:%s/", port)
	log.Printf("🔍 GraphQL playground at http://localhost:%s/", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
