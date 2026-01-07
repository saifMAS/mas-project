const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000
// middleware: JSON + ملفات static
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// route رئيسي لأي طلب غير API
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ملف البيانات
const DATA_FILE = path.join(__dirname, "data.json");

// استقبال البيانات من الفورم
app.post("/api/apply", (req, res) => {
  const newData = req.body;

  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    const list = data ? JSON.parse(data) : [];
    list.push({ ...newData, date: new Date().toISOString() });

    fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), (err) => {
      if (err) return res.status(500).json({ message: "File error" });
      res.json({ message: "Application saved ✅" });
    });
  });
});

// جلب كل البيانات
app.get("/api/applications", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ message: "File error" });
    const list = data ? JSON.parse(data) : [];
    res.json(list);
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));