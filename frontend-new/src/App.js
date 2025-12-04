import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap"; // CORRECT IMPORTS
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import TaskList from "./components/TaskList";
import GitHubSearch from "./components/GitHubSearch";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppNavbar = () => {
  const { user, logout } = useAuth();
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="/tasks">Task Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/tasks">
              Tasks
            </Nav.Link>
            <Nav.Link as={Link} to="/github">
              GitHub Search
            </Nav.Link>
          </Nav>
          {user && (
            <Nav>
              <span className="navbar-text me-3">Welcome, {user.name}!</span>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

function AppContent() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/github"
          element={
            <ProtectedRoute>
              <GitHubSearch />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/tasks" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
