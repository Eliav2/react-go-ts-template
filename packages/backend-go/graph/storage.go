package graph

import (
	"strconv"
	"sync"

	"github.com/eliav/exercise-drizzle-react/packages/backend-go/graph/model"
)

// TodoStorage provides in-memory storage for todos
type TodoStorage struct {
	mu     sync.RWMutex
	todos  map[string]*model.Todo
	nextID int
}

// NewTodoStorage creates a new todo storage
func NewTodoStorage() *TodoStorage {
	return &TodoStorage{
		todos:  make(map[string]*model.Todo),
		nextID: 1,
	}
}

// GetAll returns all todos
func (s *TodoStorage) GetAll() []*model.Todo {
	s.mu.RLock()
	defer s.mu.RUnlock()

	todos := make([]*model.Todo, 0, len(s.todos))
	for _, todo := range s.todos {
		todos = append(todos, todo)
	}
	return todos
}

// Create creates a new todo
func (s *TodoStorage) Create(title string) *model.Todo {
	s.mu.Lock()
	defer s.mu.Unlock()

	id := strconv.Itoa(s.nextID)
	s.nextID++

	todo := &model.Todo{
		ID:        id,
		Title:     title,
		Completed: false,
	}

	s.todos[id] = todo
	return todo
}

// Update updates an existing todo
func (s *TodoStorage) Update(id string, title *string, done *bool) (*model.Todo, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	todo, exists := s.todos[id]
	if !exists {
		return nil, false
	}

	if title != nil {
		todo.Title = *title
	}
	if done != nil {
		todo.Completed = *done
	}

	return todo, true
}

// Delete deletes a todo
func (s *TodoStorage) Delete(id string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	_, exists := s.todos[id]
	if exists {
		delete(s.todos, id)
	}
	return exists
}
