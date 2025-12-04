import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Container,
  Form,
  Button,
  Alert,
  ListGroup,
  Spinner,
} from "react-bootstrap";

const TaskList = () => {
  const { token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch {
      setError("Failed to fetch tasks");
    } finally {
      setLoadingTasks(false);
    }
  };

  const validateForm = () => {
    if (formData.title.trim().length < 3)
      return "Title must be at least 3 characters";
    if (formData.description.trim().length < 5)
      return "Description must be at least 5 characters";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      if (editingId) {
        const res = await axios.put(
          `http://localhost:5000/api/tasks/${editingId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTasks(
          tasks.map((task) => (task._id === editingId ? res.data : task))
        );
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/tasks",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTasks([...tasks, res.data]);
      }
      setFormData({ title: "", description: "" });
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (task) => {
    setFormData({ title: task.title, description: task.description });
    setEditingId(task._id);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch {
      setError("Delete failed");
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "700px" }}>
      <h2>Task Manager</h2>

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-3" controlId="taskTitle">
          <Form.Control
            type="text"
            placeholder="Task title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="taskDesc">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Task description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
        </Form.Group>

        <Button type="submit" disabled={submitting} className="w-100">
          {submitting ? "Saving..." : editingId ? "Update Task" : "Add Task"}
        </Button>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      {loadingTasks ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <ListGroup>
          {tasks.map((task) => (
            <ListGroup.Item
              key={task._id}
              className="d-flex justify-content-between align-items-start"
            >
              <div>
                <h5>{task.title}</h5>
                <p className="mb-1">{task.description}</p>
              </div>
              <div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
          {tasks.length === 0 && <p className="text-center">No tasks found.</p>}
        </ListGroup>
      )}
    </Container>
  );
};

export default TaskList;
