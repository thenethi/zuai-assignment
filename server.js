const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Database setup
const db = new sqlite3.Database("./blog.sqlite", (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    console.log("Connected to the SQLite database.");
    db.run(`CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// Routes
// GET all posts
app.get("/posts", (req, res) => {
  db.all("SELECT * FROM posts ORDER BY created_at ASC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET a single post by id
app.get("/posts/:id", (req, res) => {
  db.get("SELECT * FROM posts WHERE id = ?", req.params.id, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(row);
  });
});

// POST a new post
app.post("/posts", (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    res.status(400).json({ error: "Title, content, and author are required" });
    return;
  }
  db.run(
    "INSERT INTO posts (title, content, author) VALUES (?, ?, ?)",
    [title, content, author],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// PUT (update) a post
app.put("/posts/:id", (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    res.status(400).json({ error: "Title, content, and author are required" });
    return;
  }
  db.run(
    "UPDATE posts SET title = ?, content = ?, author = ? WHERE id = ?",
    [title, content, author, req.params.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: "Post not found" });
        return;
      }
      res.json({ message: "Post updated successfully" });
    }
  );
});

// DELETE a post
app.delete("/posts/:id", (req, res) => {
  db.run("DELETE FROM posts WHERE id = ?", req.params.id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json({ message: "Post deleted successfully" });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
