import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  useGetTodosQuery,
  useGetUsersQuery,
  useUpdateTodoMutation,
  useCreateTodoMutation,
  useDeleteTodoMutation,
} from "../graphql/generated";

export function TodosTable() {
  const queryClient = useQueryClient();
  const {
    data: todosData,
    isLoading: todosLoading,
    error: todosError,
  } = useGetTodosQuery();
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();

  const updateTodoMutation = useUpdateTodoMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetTodos"] });
    },
  });

  const createTodoMutation = useCreateTodoMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetTodos"] });
    },
  });

  const deleteTodoMutation = useDeleteTodoMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetTodos"] });
    },
  });

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const todos = todosData?.todos || [];
  const users = usersData?.users || [];

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) {
      alert("Please enter a todo title");
      return;
    }

    try {
      await createTodoMutation.mutateAsync({
        input: {
          title: newTodoTitle,
        },
      });
      setNewTodoTitle("");
      setShowCreateDialog(false);
    } catch (error) {
      console.error("Failed to create todo:", error);
      alert("Failed to create todo. Please try again.");
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      try {
        await deleteTodoMutation.mutateAsync({
          id: todoId,
        });
      } catch (error) {
        console.error("Failed to delete todo:", error);
        alert("Failed to delete todo. Please try again.");
      }
    }
  };

  const handleAssignUser = async (todoId: string, userId: string | null) => {
    try {
      await updateTodoMutation.mutateAsync({
        input: {
          id: todoId,
          userId: userId,
        },
      });
    } catch (error) {
      console.error("Failed to assign user:", error);
      alert("Failed to assign user. Please try again.");
    }
  };

  const handleToggleCompleted = async (
    todoId: string,
    currentCompleted: boolean
  ) => {
    try {
      await updateTodoMutation.mutateAsync({
        input: {
          id: todoId,
          done: !currentCompleted,
        },
      });
    } catch (error) {
      console.error("Failed to toggle completion:", error);
    }
  };

  if (todosLoading || usersLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (todosError) {
    return (
      <Alert severity="error">
        Failed to load todos: {JSON.stringify(todosError)}
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <h2>Todos</h2>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowCreateDialog(true)}
        >
          Add New Todo
        </Button>
      </Box>

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
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant={todo.completed ? "outlined" : "contained"}
                      color={todo.completed ? "secondary" : "primary"}
                      size="small"
                      onClick={() =>
                        handleToggleCompleted(todo.id, todo.completed)
                      }
                      disabled={updateTodoMutation.isPending}
                    >
                      {todo.completed ? "Mark Pending" : "Mark Complete"}
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteTodo(todo.id)}
                      disabled={deleteTodoMutation.isPending}
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Todo Dialog */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Todo</DialogTitle>
        <form onSubmit={handleCreateTodo}>
          <DialogContent>
            <TextField
              label="Todo Title"
              variant="outlined"
              fullWidth
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Enter todo title"
              required
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowCreateDialog(false)}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={createTodoMutation.isPending}
            >
              {createTodoMutation.isPending ? "Creating..." : "Create Todo"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
