require("dotenv").config();

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const dnsPromises = require("dns").promises;
const { Pool } = require("pg");

/**
 * Supabase "direct" host db.<ref>.supabase.co is IPv6-only in DNS (no A record).
 * Railway cannot route to it (ENETUNREACH). Pooler hosts (aws-0-*.pooler.supabase.com)
 * have IPv4; we resolve to IPv4 and connect by IP with TLS SNI = hostname.
 */
async function createPoolFromDatabaseUrl(connectionString) {
  if (!connectionString?.trim()) {
    throw new Error("DATABASE_URL is not set");
  }

  const normalized = connectionString
    .trim()
    .replace(/^postgres:\/\//, "postgresql://");

  let u;
  try {
    u = new URL(normalized);
  } catch (err) {
    throw new Error(`Invalid DATABASE_URL: ${err.message}`);
  }

  const logicalHost = u.hostname;
  if (!logicalHost) {
    throw new Error("DATABASE_URL is missing hostname");
  }

  const isSupabaseDirectDb =
    /^db\.[a-z0-9]+\.supabase\.co$/i.test(logicalHost);

  const isLiteralIpv4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(logicalHost);
  const isLiteralIpv6 = logicalHost.includes(":");

  let connectHost = logicalHost;
  if (!isLiteralIpv4 && !isLiteralIpv6) {
    try {
      const { address } = await dnsPromises.lookup(logicalHost, { family: 4 });
      connectHost = address;
    } catch (err) {
      if (isSupabaseDirectDb) {
        throw new Error(
          `DATABASE_URL uses Supabase direct host "${logicalHost}" (IPv6-only DNS, no IPv4). ` +
            `Railway and many hosts cannot open that connection.\n\n` +
            `Fix: Supabase → Project Settings → Database → Connection string → set Method to "Session pooler" ` +
            `(port 5432). Copy the full URI (host will be like aws-0-<region>.pooler.supabase.com), ` +
            `paste it as DATABASE_URL on Railway, redeploy.`,
        );
      }
      connectHost = logicalHost;
    }
  }

  const port = u.port ? Number(u.port) : 5432;
  const pathDb = (u.pathname || "/postgres").replace(/^\//, "");
  const database =
    decodeURIComponent(pathDb.split("/")[0] || "postgres") || "postgres";
  const user = decodeURIComponent(u.username || "");
  const password = decodeURIComponent(u.password || "");

  const hostIsLocal =
    logicalHost === "localhost" ||
    logicalHost === "127.0.0.1" ||
    logicalHost === "::1";

  const sslMode = (u.searchParams.get("sslmode") || "").toLowerCase();
  const sslDisabled = sslMode === "disable";
  const useSsl = !hostIsLocal && !sslDisabled;

  console.log(
    `DB: connecting to ${connectHost}:${port} (host ${logicalHost}, TLS ${useSsl ? "on" : "off"})`,
  );

  return new Pool({
    host: connectHost,
    port,
    user,
    password,
    database,
    max: 10,
    ssl: useSsl
      ? {
          rejectUnauthorized: false,
          servername: logicalHost,
        }
      : undefined,
  });
}

const app = express();

const defaultCorsOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://bb-deco.vercel.app",
  "https://bbdecoadmindashboard.vercel.app",
];

const extraOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

/** When CORS_ORIGINS=*, reflect the request Origin (any site can call the API from a browser). */
const corsOrigin =
  process.env.CORS_ORIGINS?.trim() === "*"
    ? true
    : [...defaultCorsOrigins, ...extraOrigins];

app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, message: "BB Deco backend is running" });
});

const PORT = process.env.PORT || 4000;

async function main() {
  const pool = await createPoolFromDatabaseUrl(process.env.DATABASE_URL);

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
        ],
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

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error("Fatal startup error:", err.message || err);
  process.exit(1);
});
