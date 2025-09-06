import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import "../App.css";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="app">
        <nav className="nav">
          <div className="nav-brand">
            <h1>Todo Manager</h1>
          </div>
          <div className="nav-links">
            <Link
              to="/"
              className="nav-link"
              activeProps={{ className: "active" }}
            >
              Todos
            </Link>
            <Link
              to="/users"
              className="nav-link"
              activeProps={{ className: "active" }}
            >
              Users
            </Link>
          </div>
        </nav>
        <main className="main">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </>
  ),
});
