const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const FILE = path.join(__dirname, "tasks.json");

let tasks = [];
let streak = 0;

// Load data
if (fs.existsSync(FILE)) {
    const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    tasks = data.tasks || [];
    streak = data.streak || 0;
}

function saveData() {
    fs.writeFileSync(FILE, JSON.stringify({ tasks, streak }, null, 2));
}

// ADD TASK
app.post("/add-task", (req, res) => {
    const { task, category, dueDate } = req.body;

    const newTask = {
        id: Date.now(),
        task,
        category,
        dueDate,
        status: "pending"
    };

    tasks.push(newTask);
    saveData();

    res.send("Added");
});

// GET TASKS
app.get("/tasks", (req, res) => {
    res.json({ tasks, streak });
});

// COMPLETE TASK
app.post("/complete-task", (req, res) => {
    const { id } = req.body;

    tasks = tasks.map(t =>
        t.id == id ? { ...t, status: "completed" } : t
    );

    if (tasks.every(t => t.status === "completed")) {
        streak++;
    }

    saveData();
    res.send("Completed");
});

// DELETE TASK
app.post("/delete-task", (req, res) => {
    const { id } = req.body;

    tasks = tasks.filter(t => t.id != id);
    saveData();

    res.send("Deleted");
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
});
