/*jshint esversion: 8 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pinoLogger = require("./logger");

const connectToDatabase = require("./models/db");
const { loadData } = require("./util/import-mongo/index");

const app = express();
app.use(
  cors({
    origin:
      "https://daniel123448-9000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const port = 3060;

// Connect to MongoDB; we just do this one time
connectToDatabase()
  .then(() => {
    pinoLogger.info("Connected to DB");
  })
  .catch((e) => console.error("Failed to connect to DB", e));

app.use(express.json());

// Route files
const giftRoutes = require("./routes/giftRoutes");
const authRoutes = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");
const pinoHttp = require("pino-http");
const logger = require("./logger");

app.use(pinoHttp({ logger }));

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    // Check database connection
    const db = await connectToDatabase();
    if (!db) {
      return res.status(503).json({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        checks: {
          database: "failed",
          server: "healthy",
        },
      });
    }

    // If we get here, all checks passed
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      checks: {
        database: "healthy",
        server: "healthy",
      },
      version: process.env.npm_package_version || "1.0.0",
    });
  } catch (error) {
    logger.error("Health check failed:", error);
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      checks: {
        database: "failed",
        server: "healthy",
      },
    });
  }
});

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/gifts", giftRoutes);
app.use("/api/search", searchRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

/**
 * Remove later!!
 * Temporary Logging of Requests
 */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Inside the server");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
