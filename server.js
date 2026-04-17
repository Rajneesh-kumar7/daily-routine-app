const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const FILE = path.join(__dirname, "tasks.json");

// Load tasks
let tasks = [];
if (fs.existsSync(FILE)) {
    tasks = JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

// Save tasks
function saveTasks() {
    fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}

// Add task
app.post("/add-task", (req, res) => {
    const { task } = req.body;

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

// Get tasks
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// Start server
app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
});
