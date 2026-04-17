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
    tasks = JSON.parse(fs.readFileSync(FILE, "utf-8"));
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

    console.log("🔥 Added:", newTask);

    res.send("Task Added");
});

// GET TASKS
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// DELETE TASK
app.post("/delete-task", (req, res) => {
    const { id } = req.body;

    tasks = tasks.filter(t => t.id != id);
    saveTasks();

    console.log("❌ Deleted:", id);

    res.send("Deleted");
});

// START SERVER
app.listen(3000, "0.0.0.0", () => {
    console.log("🚀 Server running on port 3000");
});
