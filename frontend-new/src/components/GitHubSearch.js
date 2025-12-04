import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Alert,
  ListGroup,
  Image,
} from "react-bootstrap";

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN || "";

const GitHubSearch = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchGitHub = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${query}`,
        {
          headers: { Authorization: `token ${GITHUB_TOKEN}` },
        }
      );
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setUsers(data.items.slice(0, 5));
    } catch {
      setError("Search failed due to API limits or network issues.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">GitHub User Search</h2>
      <Form onSubmit={searchGitHub} className="d-flex mb-3">
        <Form.Control
          type="text"
          placeholder="Search GitHub users"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="primary"
          className="ms-2"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </Form>
      {error && <Alert variant="danger">{error}</Alert>}
      <ListGroup>
        {users.map((user) => (
          <ListGroup.Item key={user.id} className="d-flex align-items-center">
            <Image
              src={user.avatar_url}
              roundedCircle
              width={50}
              height={50}
              className="me-3"
            />
            <a href={user.html_url} target="_blank" rel="noopener noreferrer">
              {user.login}
            </a>
          </ListGroup.Item>
        ))}
        {users.length === 0 && !error && <p>No users to display</p>}
      </ListGroup>
    </Container>
  );
};

export default GitHubSearch;
