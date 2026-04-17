const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const FILE = path.join(__dirname, "tasks.json");

let tasks = [];

// LOAD TASKS SAFELY
if (fs.existsSync(FILE)) {
    try {
        const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));

        if (Array.isArray(data)) {
            tasks = data;
        } else {
            tasks = data.tasks || [];
        }

    } catch {
        tasks = [];
    }
}

// SAVE TASKS
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

// COMPLETE TASK
app.post("/complete-task", (req, res) => {
    const { id } = req.body;

    let found = false;

    tasks = tasks.map(t => {
        if (t.id == id) {
            found = true;
            return { ...t, status: "completed" };
        }
        return t;
    });

    saveTasks();

    if (found) {
        console.log("✅ Completed Task ID:", id);
    } else {
        console.log("⚠️ Task not found for completion:", id);
    }

    res.send("Completed");
});

// DELETE TASK
app.post("/delete-task", (req, res) => {
    const { id } = req.body;

    const before = tasks.length;

    tasks = tasks.filter(t => t.id != id);

    saveTasks();

    if (tasks.length < before) {
        console.log("❌ Deleted Task ID:", id);
    } else {
        console.log("⚠️ Task not found for delete:", id);
    }

    res.send("Deleted");
});

// START SERVER
app.listen(3000, "0.0.0.0", () => {
    console.log("🚀 Server running on port 3000");
});
