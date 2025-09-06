import { useState } from "react";

// Placeholder types - will be replaced with generated types in part 2
interface User {
  id: string;
  name: string;
  email: string;
}

// Placeholder data
const initialUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com" },
];

interface UserForm {
  name: string;
  email: string;
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>({ name: "", email: "" });
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      alert("Please fill in all fields");
      return;
    }

    if (editingUser) {
      // Update existing user
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id
            ? { ...user, name: form.name, email: form.email }
            : user
        )
      );
      setEditingUser(null);
    } else {
      // Create new user
      const newUser: User = {
        id: Date.now().toString(), // Simple ID generation for placeholder
        name: form.name,
        email: form.email,
      };
      setUsers((prev) => [...prev, newUser]);
    }

    setForm({ name: "", email: "" });
    setShowForm(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email });
    setShowForm(true);
  };

  const handleDelete = (userId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This will unassign them from all todos."
      )
    ) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setForm({ name: "", email: "" });
    setShowForm(false);
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Manage Users</h3>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Add New User
          </button>
        )}
      </div>

      {showForm && (
        <div className="form">
          <h4>{editingUser ? "Edit User" : "Create New User"}</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter user name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter user email"
                required
              />
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" className="btn btn-primary">
                {editingUser ? "Update User" : "Create User"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn btn-small btn-secondary"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
