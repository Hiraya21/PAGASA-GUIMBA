import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.ts";
import * as schema from "./src/db/schema.ts";
import { eq, desc } from "drizzle-orm";
import { seedDatabaseIfEmpty } from "./src/db/seed.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

  // Seed on launch
  await seedDatabaseIfEmpty();

  // API Routes

  // Health
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", engine: "PostgreSQL", orm: "Drizzle" });
  });

  // Settings
  app.get("/api/settings", async (req, res) => {
    try {
      const records = await db.select().from(schema.settings).where(eq(schema.settings.id, "default_settings")).limit(1);
      if (records.length > 0) {
        return res.json(records[0].data);
      }
      res.json(null);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const data = req.body;
      await db.insert(schema.settings).values({
        id: "default_settings",
        data: data
      }).onConflictDoUpdate({
        target: schema.settings.id,
        set: { data: data }
      });
      res.json({ success: true, data });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Members
  app.get("/api/members", async (req, res) => {
    try {
      const list = await db.select().from(schema.members).orderBy(desc(schema.members.createdAt));
      res.json(list);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/members", async (req, res) => {
    try {
      const m = req.body;
      await db.insert(schema.members).values(m).onConflictDoUpdate({
        target: schema.members.id,
        set: m
      });
      res.json({ success: true, member: m });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/members/:id", async (req, res) => {
    try {
      await db.delete(schema.members).where(eq(schema.members.id, req.params.id));
      res.json({ success: true });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Events
  app.get("/api/events", async (req, res) => {
    try {
      const list = await db.select().from(schema.events);
      res.json(list);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const e = req.body;
      await db.insert(schema.events).values(e).onConflictDoUpdate({
        target: schema.events.id,
        set: e
      });
      res.json({ success: true, event: e });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      await db.delete(schema.events).where(eq(schema.events.id, req.params.id));
      res.json({ success: true });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Registrations
  app.get("/api/registrations", async (req, res) => {
    try {
      const list = await db.select().from(schema.registrations);
      res.json(list);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/registrations", async (req, res) => {
    try {
      const r = req.body;
      await db.insert(schema.registrations).values(r).onConflictDoUpdate({
        target: schema.registrations.id,
        set: r
      });
      res.json({ success: true, registration: r });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/registrations/:id", async (req, res) => {
    try {
      await db.delete(schema.registrations).where(eq(schema.registrations.id, req.params.id));
      res.json({ success: true });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Attendance Sessions
  app.get("/api/attendance-sessions", async (req, res) => {
    try {
      const list = await db.select().from(schema.attendanceSessions);
      res.json(list);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/attendance-sessions", async (req, res) => {
    try {
      const s = req.body;
      await db.insert(schema.attendanceSessions).values(s).onConflictDoUpdate({
        target: schema.attendanceSessions.id,
        set: s
      });
      res.json({ success: true, session: s });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Attendance Records
  app.get("/api/attendance-records", async (req, res) => {
    try {
      const list = await db.select().from(schema.attendanceRecords);
      res.json(list);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/attendance-records", async (req, res) => {
    try {
      const r = req.body;
      await db.insert(schema.attendanceRecords).values(r).onConflictDoUpdate({
        target: schema.attendanceRecords.id,
        set: r
      });
      res.json({ success: true, record: r });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/attendance-records/:id", async (req, res) => {
    try {
      await db.delete(schema.attendanceRecords).where(eq(schema.attendanceRecords.id, req.params.id));
      res.json({ success: true });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const list = await db.select().from(schema.projects);
      res.json(list);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const p = req.body;
      await db.insert(schema.projects).values(p).onConflictDoUpdate({
        target: schema.projects.id,
        set: p
      });
      res.json({ success: true, project: p });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      await db.delete(schema.projects).where(eq(schema.projects.id, req.params.id));
      res.json({ success: true });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Activities
  app.get("/api/activities", async (req, res) => {
    try {
      const list = await db.select().from(schema.activities);
      res.json(list);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const a = req.body;
      await db.insert(schema.activities).values(a).onConflictDoUpdate({
        target: schema.activities.id,
        set: a
      });
      res.json({ success: true, activity: a });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/activities/:id", async (req, res) => {
    try {
      await db.delete(schema.activities).where(eq(schema.activities.id, req.params.id));
      res.json({ success: true });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Announcements
  app.get("/api/announcements", async (req, res) => {
    try {
      const list = await db.select().from(schema.announcements);
      res.json(list);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/announcements", async (req, res) => {
    try {
      const ann = req.body;
      await db.insert(schema.announcements).values(ann).onConflictDoUpdate({
        target: schema.announcements.id,
        set: ann
      });
      res.json({ success: true, announcement: ann });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/announcements/:id", async (req, res) => {
    try {
      await db.delete(schema.announcements).where(eq(schema.announcements.id, req.params.id));
      res.json({ success: true });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Officials
  app.get("/api/officials", async (req, res) => {
    try {
      const list = await db.select().from(schema.officials);
      res.json(list);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/officials", async (req, res) => {
    try {
      const off = req.body;
      await db.insert(schema.officials).values(off).onConflictDoUpdate({
        target: schema.officials.id,
        set: off
      });
      res.json({ success: true, official: off });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/officials/:id", async (req, res) => {
    try {
      await db.delete(schema.officials).where(eq(schema.officials.id, req.params.id));
      res.json({ success: true });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Certificates
  app.get("/api/certificates", async (req, res) => {
    try {
      const list = await db.select().from(schema.certificates);
      res.json(list);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/certificates", async (req, res) => {
    try {
      const cert = req.body;
      await db.insert(schema.certificates).values(cert).onConflictDoUpdate({
        target: schema.certificates.id,
        set: cert
      });
      res.json({ success: true, certificate: cert });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/certificates/:id", async (req, res) => {
    try {
      await db.delete(schema.certificates).where(eq(schema.certificates.id, req.params.id));
      res.json({ success: true });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Gallery
  app.get("/api/gallery", async (req, res) => {
    try {
      const list = await db.select().from(schema.gallery);
      res.json(list);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/gallery", async (req, res) => {
    try {
      const g = req.body;
      await db.insert(schema.gallery).values(g).onConflictDoUpdate({
        target: schema.gallery.id,
        set: g
      });
      res.json({ success: true, photo: g });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/gallery/:id", async (req, res) => {
    try {
      await db.delete(schema.gallery).where(eq(schema.gallery.id, req.params.id));
      res.json({ success: true });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Notifications
  app.get("/api/notifications", async (req, res) => {
    try {
      const list = await db.select().from(schema.notifications);
      res.json(list);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const n = req.body;
      await db.insert(schema.notifications).values(n).onConflictDoUpdate({
        target: schema.notifications.id,
        set: n
      });
      res.json({ success: true, notification: n });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Audit Logs
  app.get("/api/audit-logs", async (req, res) => {
    try {
      const list = await db.select().from(schema.auditLogs).orderBy(desc(schema.auditLogs.timestamp));
      res.json(list);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/audit-logs", async (req, res) => {
    try {
      const l = req.body;
      await db.insert(schema.auditLogs).values(l).onConflictDoUpdate({
        target: schema.auditLogs.id,
        set: l
      });
      res.json({ success: true, log: l });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} with PostgreSQL & Drizzle ORM`);
  });
}

startServer();
