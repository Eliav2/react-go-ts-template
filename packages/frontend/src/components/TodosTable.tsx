import { useState } from "react";

// Placeholder types - will be replaced with generated types in part 2
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  user?: User | null;
  userId?: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
}

// Placeholder data
const placeholderUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com" },
];

const placeholderTodos: Todo[] = [
  {
    id: "1",
    title: "Complete project documentation",
    completed: false,
    user: placeholderUsers[0],
    userId: "1",
  },
  {
    id: "2",
    title: "Review code changes",
    completed: true,
    user: placeholderUsers[1],
    userId: "2",
  },
  {
    id: "3",
    title: "Setup CI/CD pipeline",
    completed: false,
    user: null,
    userId: null,
  },
  {
    id: "4",
    title: "Write unit tests",
    completed: false,
    user: placeholderUsers[2],
    userId: "3",
  },
  {
    id: "5",
    title: "Deploy to production",
    completed: false,
    user: null,
    userId: null,
  },
];

export function TodosTable() {
  const [todos, setTodos] = useState<Todo[]>(placeholderTodos);

  const handleAssignUser = (todoId: string, userId: string | null) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === todoId) {
          const user = userId
            ? placeholderUsers.find((u) => u.id === userId) || null
            : null;
          return { ...todo, user, userId };
        }
        return todo;
      })
    );
  };

  const handleToggleCompleted = (todoId: string) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      })
    );
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Assigned User</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.title}</td>
              <td>
                <span
                  className={
                    todo.completed ? "status-completed" : "status-pending"
                  }
                >
                  {todo.completed ? "Completed" : "Pending"}
                </span>
              </td>
              <td>
                <select
                  className="form-select"
                  value={todo.userId || ""}
                  onChange={(e) =>
                    handleAssignUser(todo.id, e.target.value || null)
                  }
                >
                  <option value="">Unassigned</option>
                  {placeholderUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  className={`btn btn-small ${
                    todo.completed ? "btn-secondary" : "btn-primary"
                  }`}
                  onClick={() => handleToggleCompleted(todo.id)}
                >
                  {todo.completed ? "Mark Pending" : "Mark Complete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
