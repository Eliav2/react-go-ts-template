import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  type GetUsersQuery,
} from "../graphql/generated";
import { useQueryClient } from "@tanstack/react-query";

type User = NonNullable<GetUsersQuery["users"]>[0];

interface UserForm {
  name: string;
  email: string;
}

export function UsersPage() {
  const queryClient = useQueryClient();
  const { data: usersData, isLoading, error } = useGetUsersQuery();
  const createUserMutation = useCreateUserMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetUsers"] });
    },
  });
  const updateUserMutation = useUpdateUserMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetUsers"] });
    },
  });
  const deleteUserMutation = useDeleteUserMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetUsers"] });
    },
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>({ name: "", email: "" });
  const [showDialog, setShowDialog] = useState(false);

  const users = usersData?.users || [];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load users: {JSON.stringify(error)}
      </Alert>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (editingUser) {
        // Update existing user
        await updateUserMutation.mutateAsync({
          input: {
            id: editingUser.id,
            name: form.name,
            email: form.email,
          },
        });
        setEditingUser(null);
      } else {
        // Create new user
        await createUserMutation.mutateAsync({
          input: {
            name: form.name,
            email: form.email,
          },
        });
      }

      setForm({ name: "", email: "" });
      setShowDialog(false);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user. Please try again.");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email });
    setShowDialog(true);
  };

  const handleDelete = async (userId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This will unassign them from all todos."
      )
    ) {
      try {
        await deleteUserMutation.mutateAsync({
          id: userId,
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setForm({ name: "", email: "" });
    setShowDialog(false);
  };

  const handleOpenDialog = () => {
    setEditingUser(null);
    setForm({ name: "", email: "" });
    setShowDialog(true);
  };

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
        <Typography variant="h4" component="h2" sx={{ color: "primary.main" }}>
          Manage Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          Add New User
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.100" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ "&:hover": { backgroundColor: "grey.50" } }}
              >
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(user.id)}
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

      <Dialog open={showDialog} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? "Edit User" : "Create New User"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter user name"
                required
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter user email"
                required
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editingUser ? "Update User" : "Create User"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
