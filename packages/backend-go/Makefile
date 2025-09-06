.PHONY: dev build generate clean

# Development server with hot reload
dev:
	@if [ -f .env ]; then export $$(cat .env | xargs); fi && go run main.go

# Build the application
build:
	go build -o bin/server main.go

# Generate GraphQL code from schema
generate:
	go run github.com/99designs/gqlgen generate

# Generate Ent code from schema
ent-generate:
	ent generate ./ent/schema

# Run tests
test:
	go test ./... -v

# Run tests with coverage
test-coverage:
	go test ./... -v -coverprofile=coverage.out
	go tool cover -html=coverage.out -o coverage.html

# Clean generated files
clean:
	rm -rf bin/
	rm -f graph/generated/generated.go
	rm -f coverage.out coverage.html
	rm -f graph/model/models_gen.go

# Install dependencies
deps:
	go mod download
	go mod tidy
