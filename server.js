const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",   // ถ้ามีรหัสผ่าน ให้ใส่ที่นี่
  database: "faculty"
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database.");
  }
});

// ดึงข่าวทั้งหมด
app.get("/news", (req, res) => {
  db.query("SELECT * FROM news ORDER BY created_at DESC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// เพิ่มข่าวใหม่
app.post("/news", (req, res) => {
  const { title, content } = req.body;
  db.query("INSERT INTO news (title, content) VALUES (?, ?)", [title, content], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "News added successfully" });
  });
});

// แก้ไขข่าว
app.put("/news/:id", (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    db.query(
      "UPDATE news SET title = ?, content = ? WHERE id = ?",
      [title, content, id],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "News updated successfully" });
      }
    );
  });
  
  // ลบข่าว
app.delete("/news/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM news WHERE id = ?", [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "News deleted successfully" });
    });
  });

  // เพิ่ม Navbar
app.post("/navbar", (req, res) => {
    const { title, parent_id, position } = req.body;
    db.query(
      "INSERT INTO navbar (title, parent_id, position) VALUES (?, ?, ?)",
      [title, parent_id, position],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Navbar added successfully" });
      }
    );
  });
  
  // แก้ไข Navbar
  app.put("/navbar/:id", (req, res) => {
    const { id } = req.params;
    const { title, parent_id, position } = req.body;
    db.query(
      "UPDATE navbar SET title = ?, parent_id = ?, position = ? WHERE id = ?",
      [title, parent_id, position, id],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Navbar updated successfully" });
      }
    );
  });
  
 app.delete('/navbar/:id', (req, res) => {
  const { id } = req.params;

  // ลบข้อมูลลูกก่อน
  const deleteChildQuery = 'DELETE FROM navbar WHERE parent_id = ?';
  db.query(deleteChildQuery, [id], (err, result) => {
    if (err) {
      console.error('Error deleting child navbar items:', err);
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูลลูก' });
    }

    // ลบข้อมูลหลัก (Parent)
    const deleteQuery = 'DELETE FROM navbar WHERE id = ?';
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error('Error deleting navbar item:', err);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูลหลัก' });
      }

      res.status(200).json({ message: 'Navbar ถูกลบสำเร็จ!' });
    });
  });
});
  
  // ดึงข้อมูล Navbar ทั้งหมด
  app.get("/navbar", (req, res) => {
    db.query("SELECT * FROM navbar ORDER BY position ASC", (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    });
  });
  
app.listen(5000, () => console.log("Server running on port 5000"));
