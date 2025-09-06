import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Button,
  Chip,
} from "@mui/material";

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
    <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "grey.100" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Assigned User</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {todos.map((todo) => (
            <TableRow
              key={todo.id}
              sx={{ "&:hover": { backgroundColor: "grey.50" } }}
            >
              <TableCell>{todo.title}</TableCell>
              <TableCell>
                <Chip
                  label={todo.completed ? "Completed" : "Pending"}
                  color={todo.completed ? "success" : "warning"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select
                    value={todo.userId || ""}
                    onChange={(e) =>
                      handleAssignUser(todo.id, e.target.value || null)
                    }
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Unassigned</em>
                    </MenuItem>
                    {placeholderUsers.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <Button
                  variant={todo.completed ? "outlined" : "contained"}
                  color={todo.completed ? "secondary" : "primary"}
                  size="small"
                  onClick={() => handleToggleCompleted(todo.id)}
                >
                  {todo.completed ? "Mark Pending" : "Mark Complete"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
