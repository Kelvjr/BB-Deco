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
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
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

  const APPLICATION_STATUSES = ["pending", "approved", "rejected", "submitted"];

  /** JSON.stringify cannot encode bigint; Postgres may return bigint for id. */
  function rowForJson(row) {
    const o = { ...row };
    for (const key of Object.keys(o)) {
      if (typeof o[key] === "bigint") {
        o[key] = o[key].toString();
      }
    }
    return o;
  }

  /** Match by primary key whether it is integer, bigint, or uuid. */
  function safeIdParam(raw) {
    const s = String(raw ?? "").trim();
    if (!s || s.length > 128) return null;
    return s;
  }

  app.get("/applications", async (req, res) => {
    try {
      const raw = req.query.status;
      const status =
        typeof raw === "string" ? raw.trim().toLowerCase() : null;

      let result;
      if (status && APPLICATION_STATUSES.includes(status)) {
        result = await pool.query(
          `SELECT * FROM applications
           WHERE lower(trim(status)) = $1
           ORDER BY id DESC`,
          [status],
        );
      } else {
        result = await pool.query(
          "SELECT * FROM applications ORDER BY id DESC",
        );
      }

      const rows = result.rows.map((row) => {
        const base = rowForJson(row);
        return {
          ...base,
          links: {
            self: `/applications/${base.id}`,
            collection: "/applications",
          },
        };
      });

      res.json(rows);
    } catch (err) {
      console.error("DB ERROR:", err.message);
      res.status(500).json({
        error: "Failed to fetch applications",
        details: err.message,
      });
    }
  });

  app.get("/applications/:id", async (req, res) => {
    const idParam = safeIdParam(req.params.id);
    if (!idParam) {
      return res.status(404).json({ error: "Application not found" });
    }

    try {
      const result = await pool.query(
        "SELECT * FROM applications WHERE id::text = $1 LIMIT 1",
        [idParam],
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Application not found" });
      }

      const row = rowForJson(result.rows[0]);
      res.json({
        ...row,
        links: {
          self: `/applications/${row.id}`,
          collection: "/applications",
        },
      });
    } catch (err) {
      console.error("DB ERROR:", err.message);
      res.status(500).json({
        error: "Failed to fetch application",
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
        identity_photo,
        institution,
        consent_accurate,
        consent_communications,
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
        notes,
        status,
        identity_photo,
        institution,
        consent_accurate,
        consent_communications
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
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
          "pending",
          identity_photo || null,
          institution || null,
          Boolean(consent_accurate),
          Boolean(consent_communications),
        ],
      );

      const created = rowForJson(result.rows[0]);
      res.status(201).json({
        ...created,
        links: {
          self: `/applications/${created.id}`,
          collection: "/applications",
        },
      });
    } catch (err) {
      console.error("DB ERROR:", err.message);
      res.status(500).json({
        error: "Failed to create application",
        details: err.message,
      });
    }
  });

  app.patch("/applications/:id", async (req, res) => {
    const idParam = safeIdParam(req.params.id);
    if (!idParam) {
      return res.status(404).json({ error: "Application not found" });
    }

    const raw = req.body?.status;
    const nextStatus =
      typeof raw === "string" ? raw.trim().toLowerCase() : null;
    if (!nextStatus || !APPLICATION_STATUSES.includes(nextStatus)) {
      return res.status(400).json({
        error: "Invalid or missing status",
        allowed: APPLICATION_STATUSES,
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const result = await client.query(
        `UPDATE applications SET status = $1 WHERE id::text = $2 RETURNING *`,
        [nextStatus, idParam],
      );
      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Application not found" });
      }

      const row = rowForJson(result.rows[0]);

      if (nextStatus === "approved") {
        const appId = String(row.id);
        const existing = await client.query(
          "SELECT 1 FROM students WHERE application_id = $1 LIMIT 1",
          [appId],
        );
        if (existing.rowCount === 0) {
          const seqRes = await client.query(
            "SELECT nextval('student_number_seq') AS n",
          );
          const n = Number(seqRes.rows[0].n);
          const yr = new Date().getFullYear();
          const studentNumber = `BB-${yr}-${String(n).padStart(5, "0")}`;
          await client.query(
            `INSERT INTO students (student_number, application_id, full_name, email, phone, program_applied)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              studentNumber,
              appId,
              row.full_name ?? null,
              row.email ?? null,
              row.phone ?? null,
              row.program_applied ?? null,
            ],
          );
        }
      }

      await client.query("COMMIT");

      res.json({
        ...row,
        links: {
          self: `/applications/${row.id}`,
          collection: "/applications",
        },
      });
    } catch (err) {
      try {
        await client.query("ROLLBACK");
      } catch (_) {
        /* ignore */
      }
      console.error("DB ERROR:", err.message);
      res.status(500).json({
        error: "Failed to update application",
        details: err.message,
      });
    } finally {
      client.release();
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
