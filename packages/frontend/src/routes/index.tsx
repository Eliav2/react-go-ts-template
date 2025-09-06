import { createFileRoute } from "@tanstack/react-router";
import { TodosTable } from "../components/TodosTable";
import { Typography, Box } from "@mui/material";

export const Route = createFileRoute("/")({
  component: () => (
    <Box>
      <Typography
        variant="h4"
        component="h2"
        sx={{ mb: 3, color: "primary.main" }}
      >
        Todos
      </Typography>
      <TodosTable />
    </Box>
  ),
});
