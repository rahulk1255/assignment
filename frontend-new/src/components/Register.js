import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { API_BASE_URL } from "../api";

import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.name || formData.name.length < 2)
      return "Name must be at least 2 characters";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      return "Valid email is required";
    if (!formData.password || formData.password.length < 6)
      return "Password must be at least 6 characters";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        formData
      );

      login(res.data.user, res.data.token);
      navigate("/tasks");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="registerName">
          <Form.Control
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="registerEmail">
          <Form.Control
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="registerPassword">
          <Form.Control
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </Form.Group>
        <Button
          variant="success"
          type="submit"
          className="w-100"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </Form>
      <div className="mt-3 text-center">
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </Container>
  );
};

export default Register;
