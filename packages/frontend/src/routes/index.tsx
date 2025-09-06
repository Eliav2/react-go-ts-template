import { createFileRoute } from "@tanstack/react-router";
import { TodosTable } from "../components/TodosTable";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="page">
      <h2>Todos</h2>
      <TodosTable />
    </div>
  ),
});
