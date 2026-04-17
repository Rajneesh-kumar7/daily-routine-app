const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const FILE = path.join(__dirname, "tasks.json");

// Load tasks from file
let tasks = [];
if (fs.existsSync(FILE)) {
    try {
        tasks = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    } catch {
        tasks = [];
    }
}

// Save tasks
function saveTasks() {
    fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}

// Live logging
function logAction(action, data) {
    const time = new Date().toLocaleString();
    console.log(`[${time}] ${action}:`, data);
}

// Home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Add task
app.post("/add-task", (req, res) => {
    const { task } = req.body;

    if (!task) {
        return res.status(400).send("Task is required");
    }

    const newTask = {
        id: Date.now(),
        task,
        status: "pending"
    };

    tasks.push(newTask);
    saveTasks();
    logAction("Task Added", newTask);

    res.send("Task Added");
});

// Get all tasks
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// Update task
app.post("/update-task", (req, res) => {
    const { id } = req.body;

    tasks = tasks.map(t =>
        t.id == id ? { ...t, status: "completed" } : t
    );

    saveTasks();
    logAction("Task Updated", id);

    res.send("Task Updated");
});

// Delete task
app.post("/delete-task", (req, res) => {
    const { id } = req.body;

    tasks = tasks.filter(t => t.id != id);
    saveTasks();
    logAction("Task Deleted", id);

    res.send("Task Deleted");
});

// Start server
app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
    console.log("Existing tasks:", tasks);
});
