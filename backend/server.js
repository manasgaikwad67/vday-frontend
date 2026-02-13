require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./config/db");
const { globalLimiter } = require("./middleware/rateLimit");
const cronJob = require("./cron/dailyCron");

const app = express();

// ── Security & Parsing ──────────────────────────────────────────
app.use(helmet());

// CORS configuration for production
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000"
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed.replace(/\/$/, '')))) {
      return callback(null, true);
    }
    return callback(null, true); // Allow all for now, tighten in production if needed
  },
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(globalLimiter);

// ── Static uploads ──────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ──────────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/chat",     require("./routes/chat"));
app.use("/api/letter",   require("./routes/letter"));
app.use("/api/memory",   require("./routes/memory"));
app.use("/api/mood",     require("./routes/mood"));
app.use("/api/future",   require("./routes/future"));
app.use("/api/secret",   require("./routes/secret"));
app.use("/api/daily",    require("./routes/daily"));
app.use("/api/admin",    require("./routes/admin"));

// ── Health check ────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "alive", timestamp: new Date().toISOString() });
});

// ── Error handler ───────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Server error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ── Start ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`💕  Server running on port ${PORT}`);
    cronJob.start();
    console.log("📅  Daily message cron job started");
  });
});
