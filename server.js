
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory storage
let tasks = [];
let id = 1;

// Add task
app.post("/add-task", (req, res) => {
    const { task } = req.body;

    if (!task) {
        return res.status(400).send("Task is required");
    }

    tasks.push({ id: id++, task, status: "pending" });
    res.send("Task Added");
});

// Get tasks
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// Mark task as completed
app.post("/update-task", (req, res) => {
    const { id } = req.body;

    tasks = tasks.map(t =>
        t.id === id ? { ...t, status: "completed" } : t
    );

    res.send("Task Updated");
});

// Delete task
app.post("/delete-task", (req, res) => {
    const { id } = req.body;

    tasks = tasks.filter(t => t.id !== id);

    res.send("Task Deleted");
});

// Start server
app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});