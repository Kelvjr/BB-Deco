const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://bb-deco.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, message: "BB Deco backend is running" });
});

app.get("/applications", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM applications");
    res.json(result.rows);
  } catch (err) {
    console.error("DB ERROR:", err.message);
    res.status(500).json({
      error: "Failed to fetch applications",
      details: err.message,
    });
  }
});

app.post("/applications", async (req, res) => {
  try {
    const {
      full_name,
      phone,
      email,
      address,
      gender,
      date_of_birth,
      program_applied,
      education_level,
      guardian_name,
      guardian_phone,
      notes,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO applications (
        full_name,
        phone,
        email,
        address,
        gender,
        date_of_birth,
        program_applied,
        education_level,
        guardian_name,
        guardian_phone,
        notes
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      RETURNING *`,
      [
        full_name,
        phone,
        email,
        address,
        gender,
        date_of_birth,
        program_applied,
        education_level,
        guardian_name,
        guardian_phone,
        notes || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("DB ERROR:", err.message);
    res.status(500).json({
      error: "Failed to create application",
      details: err.message,
    });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

