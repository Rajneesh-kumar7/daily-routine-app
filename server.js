const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const FILE = path.join(__dirname, "tasks.json");

let tasks = [];

// Load tasks
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

// ADD TASK
app.post("/add-task", (req, res) => {
    const { task } = req.body;

    if (!task) return res.send("Task required");

    const newTask = {
        id: Date.now(),
        task,
        status: "pending"
    };

    tasks.push(newTask);
    saveTasks();

    console.log("Added:", newTask);

    res.send("Task Added");
});

// GET TASKS
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// COMPLETE TASK
app.post("/complete-task", (req, res) => {
    const { id } = req.body;

    tasks = tasks.map(t =>
        t.id == id ? { ...t, status: "completed" } : t
    );

    saveTasks();

    res.send("Completed");
});

// DELETE TASK
app.post("/delete-task", (req, res) => {
    const { id } = req.body;

    tasks = tasks.filter(t => t.id != id);
    saveTasks();

    res.send("Deleted");
});

// START SERVER
app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
});
