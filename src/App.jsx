import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [draggedId, setDraggedId] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    const savedTheme = JSON.parse(localStorage.getItem("darkMode"));

    if (savedTasks) setTasks(savedTasks);
    if (savedTheme !== null) setDarkMode(savedTheme);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [tasks, darkMode]);

  // Add task
  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask,
        completed: false,
        dueDate,
        editing: false,
      },
    ]);

    setNewTask("");
    setDueDate("");
  };

  // Toggle complete
  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Clear completed
  const clearCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed));
  };

  // Edit task
  const toggleEdit = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, editing: !t.editing } : t
      )
    );
  };

  const updateTaskText = (id, text) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, text } : t
      )
    );
  };

  // Drag & drop
  const handleDragStart = (id) => setDraggedId(id);

  const handleDrop = (id) => {
    if (draggedId === null) return;

    const items = [...tasks];
    const fromIndex = items.findIndex((t) => t.id === draggedId);
    const toIndex = items.findIndex((t) => t.id === id);

    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);

    setTasks(items);
    setDraggedId(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <header>
        <h1>📝 To-Do List</h1>
        <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Add a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button type="submit">Add</button>
      </form>

      <div className="filters">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="task-list">
        {filteredTasks.length === 0 && (
          <p className="empty">No tasks here 👀</p>
        )}

        {filteredTasks.map((task) => (
          <li
            key={task.id}
            draggable
            onDragStart={() => handleDragStart(task.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(task.id)}
            className={task.completed ? "completed" : ""}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />

            {task.editing ? (
              <input
                type="text"
                value={task.text}
                onChange={(e) =>
                  updateTaskText(task.id, e.target.value)
                }
                onBlur={() => toggleEdit(task.id)}
                autoFocus
              />
            ) : (
              <span onDoubleClick={() => toggleEdit(task.id)}>
                {task.text}
              </span>
            )}

            {task.dueDate && (
              <small>📅 {task.dueDate}</small>
            )}

            <button onClick={() => toggleEdit(task.id)}>✏️</button>
            <button onClick={() => deleteTask(task.id)}>✖</button>
          </li>
        ))}
      </ul>

      <footer>
        <button className="clear-btn" onClick={clearCompleted}>
          Clear Completed
        </button>
      </footer>
    </div>
  );
}

export default App;
