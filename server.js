import express from "express";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

app.use(express.json());

// absolute path to React build
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_PATH = path.join(__dirname, "dist");
app.use(express.static(DIST_PATH));

// API endpoints
app.get("/api/users", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM users");
  res.json({ rows });
});

app.get("/api/products", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM products");
  res.json({ rows });
});

app.get("/api/orders", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM orders");
  res.json({ rows });
});

app.get("/api/cart", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM cart");
  res.json({ rows });
});

app.get("/api/categories", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM categories");
  res.json({ rows });
});

app.get("/api/farmer/profile", async (req, res) => {
  const id = req.query.id;
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  res.json(rows[0]);
});

// dynamic table API
app.get("/api/:table", async (req, res) => {
  const table = req.params.table;
  const [rows] = await pool.query(`SELECT * FROM \`${table}\``);
  res.json({ rows });
});

// fallback to React
app.get("*", (req, res) => {
  res.sendFile(path.join(DIST_PATH, "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
