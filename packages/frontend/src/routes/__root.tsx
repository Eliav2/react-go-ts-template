import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material";
import { NavButtonLink } from "../components/NavButtonLink";

export const Route = createRootRoute({
  component: () => (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Todo Manager
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <NavButtonLink to="/">Todos</NavButtonLink>
              <NavButtonLink to="/users">Users</NavButtonLink>
            </Box>
          </Toolbar>
        </AppBar>
        <Container
          maxWidth={false}
          sx={{
            flex: 1,
            py: 3,
            backgroundColor: "grey.50",
            width: "100%",
          }}
        >
          <Outlet />
        </Container>
      </Box>
      <TanStackRouterDevtools />
    </>
  ),
});
