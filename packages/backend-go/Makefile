.PHONY: dev build generate clean

# Development server with hot reload
dev:
	go run main.go

# Build the application
build:
	go build -o bin/server main.go

# Generate GraphQL code from schema
generate:
	go run github.com/99designs/gqlgen generate

# Clean generated files
clean:
	rm -rf bin/
	rm -f graph/generated/generated.go
	rm -f graph/model/models_gen.go

# Install dependencies
deps:
	go mod download
	go mod tidy
