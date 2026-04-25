require("dotenv").config();

const { sendApplicationReceivedEmail } = require("./lib/email-application-received");

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

      try {
        const mail = await sendApplicationReceivedEmail({
          to: created.email,
          fullName: created.full_name,
          programApplied: created.program_applied,
        });
        if (mail && !mail.sent && !mail.skipped) {
          console.error("[email] Receipt email failed after save:", mail.error);
        }
      } catch (mailErr) {
        console.error(
          "[email] Receipt email threw after save:",
          mailErr?.message || mailErr,
        );
      }

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

  app.get("/stats/program-breakdown", async (_req, res) => {
    try {
      const result = await pool.query(
        `SELECT COALESCE(NULLIF(TRIM(program_applied), ''), 'Unspecified') AS program,
                COUNT(*)::int AS count
         FROM applications
         GROUP BY 1
         ORDER BY count DESC, program ASC`,
      );
      res.json(result.rows);
    } catch (err) {
      console.error("DB ERROR:", err.message);
      res.status(500).json({
        error: "Failed to load program breakdown",
        details: err.message,
      });
    }
  });

  app.get("/programs", async (_req, res) => {
    try {
      const result = await pool.query(
        `SELECT p.*, (
           SELECT COUNT(*)::int FROM applications a
           WHERE lower(trim(a.program_applied)) = lower(trim(p.name))
         ) AS application_count
         FROM programs p
         ORDER BY p.created_at DESC NULLS LAST, p.name ASC`,
      );
      res.json(result.rows.map((row) => rowForJson(row)));
    } catch (err) {
      console.error("DB ERROR:", err.message);
      res.status(500).json({
        error: "Failed to fetch programs",
        details: err.message,
      });
    }
  });

  app.get("/programs/:id", async (req, res) => {
    const id = safeIdParam(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    try {
      const one = await pool.query(`SELECT * FROM programs WHERE id::text = $1`, [id]);
      if (one.rowCount === 0) return res.status(404).json({ error: "Not found" });
      const row = rowForJson(one.rows[0]);
      const c = await pool.query(
        `SELECT COUNT(*)::int AS n FROM applications WHERE lower(trim(program_applied)) = lower(trim($1))`,
        [row.name],
      );
      res.json({ ...row, application_count: c.rows[0]?.n ?? 0 });
    } catch (err) {
      console.error("DB ERROR:", err.message);
      res.status(500).json({ error: "Failed to load program", details: err.message });
    }
  });

  app.post("/programs", async (req, res) => {
    const b = req.body || {};
    const name = typeof b.name === "string" ? b.name.trim() : "";
    if (!name) return res.status(400).json({ error: "name is required" });
    const duration = typeof b.duration === "string" ? b.duration : null;
    const description = typeof b.description === "string" ? b.description : null;
    const curriculum = Array.isArray(b.curriculum) ? JSON.stringify(b.curriculum) : "[]";
    const admission_requirements =
      typeof b.admission_requirements === "string" ? b.admission_requirements : null;
    const status = typeof b.status === "string" && b.status.trim() ? b.status.trim() : "active";
    try {
      const ins = await pool.query(
        `INSERT INTO programs (name, duration, description, curriculum, admission_requirements, status)
         VALUES ($1, $2, $3, $4::jsonb, $5, $6) RETURNING *`,
        [name, duration, description, curriculum, admission_requirements, status],
      );
      res.status(201).json(rowForJson(ins.rows[0]));
    } catch (err) {
      console.error("DB ERROR:", err.message);
      res.status(500).json({ error: "Failed to create program", details: err.message });
    }
  });

  app.put("/programs/:id", async (req, res) => {
    const id = safeIdParam(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const b = req.body || {};
    try {
      const cur = await pool.query(`SELECT * FROM programs WHERE id::text = $1`, [id]);
      if (cur.rowCount === 0) return res.status(404).json({ error: "Not found" });
      const row = cur.rows[0];
      const name = typeof b.name === "string" ? b.name.trim() : row.name;
      const duration = b.duration !== undefined ? b.duration : row.duration;
      const description = b.description !== undefined ? b.description : row.description;
      const curriculum =
        b.curriculum !== undefined ? JSON.stringify(b.curriculum) : JSON.stringify(row.curriculum || []);
      const admission_requirements =
        b.admission_requirements !== undefined
          ? b.admission_requirements
          : row.admission_requirements;
      const status = typeof b.status === "string" && b.status.trim() ? b.status : row.status;
      const upd = await pool.query(
        `UPDATE programs SET
          name = $1, duration = $2, description = $3, curriculum = $4::jsonb,
          admission_requirements = $5, status = $6, updated_at = now()
         WHERE id::text = $7 RETURNING *`,
        [name, duration, description, curriculum, admission_requirements, status, id],
      );
      res.json(rowForJson(upd.rows[0]));
    } catch (err) {
      console.error("DB ERROR:", err.message);
      res.status(500).json({ error: "Failed to update program", details: err.message });
    }
  });

  app.get("/students", async (_req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM students ORDER BY created_at DESC NULLS LAST, id DESC`,
      );
      const rows = result.rows.map((row) => rowForJson(row));
      res.json(rows);
    } catch (err) {
      console.error("DB ERROR:", err.message);
      res.status(500).json({
        error: "Failed to fetch students",
        details: err.message,
      });
    }
  });

  app.get("/students/:id", async (req, res) => {
    const id = safeIdParam(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    try {
      const result = await pool.query(`SELECT * FROM students WHERE id::text = $1`, [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(rowForJson(result.rows[0]));
    } catch (err) {
      console.error("DB ERROR:", err.message);
      res.status(500).json({ error: "Failed to load student", details: err.message });
    }
  });

  app.post("/students", async (req, res) => {
    const b = req.body || {};
    const full_name = typeof b.full_name === "string" ? b.full_name.trim() : "";
    if (!full_name) return res.status(400).json({ error: "full_name is required" });
    const email = typeof b.email === "string" ? b.email : null;
    const phone = typeof b.phone === "string" ? b.phone : null;
    const program_applied = typeof b.program_applied === "string" ? b.program_applied : null;
    const admission_type =
      typeof b.admission_type === "string" &&
      ["enrolled", "apprenticeship"].includes(b.admission_type.trim().toLowerCase())
        ? b.admission_type.trim().toLowerCase()
        : "enrolled";
    const application_id =
      typeof b.application_id === "string" && b.application_id.trim()
        ? b.application_id.trim()
        : `manual-${Date.now()}`;
    const profile_image = typeof b.profile_image === "string" ? b.profile_image : null;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const seqRes = await client.query("SELECT nextval('student_number_seq') AS n");
      const n = Number(seqRes.rows[0].n);
      const yr = new Date().getFullYear();
      const studentNumber = `BB-${yr}-${String(n).padStart(5, "0")}`;
      const ins = await client.query(
        `INSERT INTO students (student_number, application_id, full_name, email, phone, program_applied, admission_type, profile_image)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [studentNumber, application_id, full_name, email, phone, program_applied, admission_type, profile_image],
      );
      await client.query("COMMIT");
      res.status(201).json(rowForJson(ins.rows[0]));
    } catch (err) {
      try {
        await client.query("ROLLBACK");
      } catch (_) {
        /* ignore */
      }
      console.error("DB ERROR:", err.message);
      res.status(500).json({ error: "Failed to create student", details: err.message });
    } finally {
      client.release();
    }
  });

  app.patch("/students/:id", async (req, res) => {
    const id = safeIdParam(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const b = req.body || {};
    try {
      const cur = await pool.query(`SELECT * FROM students WHERE id::text = $1`, [id]);
      if (cur.rowCount === 0) return res.status(404).json({ error: "Student not found" });
      const row = cur.rows[0];
      const full_name = b.full_name !== undefined ? b.full_name : row.full_name;
      const email = b.email !== undefined ? b.email : row.email;
      const phone = b.phone !== undefined ? b.phone : row.phone;
      const program_applied = b.program_applied !== undefined ? b.program_applied : row.program_applied;
      const admission_type =
        b.admission_type !== undefined &&
        typeof b.admission_type === "string" &&
        ["enrolled", "apprenticeship"].includes(b.admission_type.trim().toLowerCase())
          ? b.admission_type.trim().toLowerCase()
          : row.admission_type;
      const status = b.status !== undefined ? b.status : row.status;
      const profile_image = b.profile_image !== undefined ? b.profile_image : row.profile_image;
      const notes = b.notes !== undefined ? b.notes : row.notes;
      const result = await pool.query(
        `UPDATE students SET
          full_name = $1, email = $2, phone = $3, program_applied = $4,
          admission_type = $5, status = $6, profile_image = $7, notes = $8
         WHERE id::text = $9
         RETURNING *`,
        [full_name, email, phone, program_applied, admission_type, status, profile_image, notes, id],
      );
      res.json(rowForJson(result.rows[0]));
    } catch (err) {
      console.error("DB ERROR:", err.message);
      res.status(500).json({ error: "Failed to update student", details: err.message });
    }
  });

  app.get("/announcements", async (_req, res) => {
    try {
      const r = await pool.query(
        `SELECT * FROM announcements ORDER BY created_at DESC NULLS LAST`,
      );
      res.json(r.rows.map((row) => rowForJson(row)));
    } catch (err) {
      console.error("DB ERROR:", err.message);
      res.status(500).json({ error: "Failed to fetch announcements", details: err.message });
    }
  });

  app.post("/announcements", async (req, res) => {
    const b = req.body || {};
    const title = typeof b.title === "string" ? b.title.trim() : "";
    const body = typeof b.body === "string" ? b.body : "";
    if (!title || !body) {
      return res.status(400).json({ error: "title and body are required" });
    }
    const audience = typeof b.audience === "string" ? b.audience : "all";
    const status = typeof b.status === "string" && b.status ? b.status : "draft";
    try {
      const ins = await pool.query(
        `INSERT INTO announcements (title, body, audience, status)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [title, body, audience, status],
      );
      res.status(201).json(rowForJson(ins.rows[0]));
    } catch (err) {
      console.error("DB ERROR:", err.message);
      res
        .status(500)
        .json({ error: "Failed to create announcement", details: err.message });
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
            `INSERT INTO students (student_number, application_id, full_name, email, phone, program_applied, admission_type)
             VALUES ($1, $2, $3, $4, $5, $6, 'enrolled')`,
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
