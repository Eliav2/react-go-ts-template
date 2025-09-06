import { createFileRoute } from "@tanstack/react-router";
import { UsersPage } from "../components/UsersPage";

export const Route = createFileRoute("/users")({
  component: () => (
    <div className="page">
      <h2>Users</h2>
      <UsersPage />
    </div>
  ),
});
