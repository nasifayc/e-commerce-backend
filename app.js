import express from "express";
import routes from "./routes/index.js";
import db from "./config/database.js";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

db();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));
app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res, path) => {
      res.set("Access-Control-Allow-Origin", "http://localhost:5173");
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit to 100 requests per window
});

app.use(limiter);

// Routes
app.use("/api", routes);

// 404 - Route not found

app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found. Please check the URL and try again.",
  });
});

// 500 - General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message:
      "Internal server error. Something went wrong, please try again later.",
  });
});

const PORT = process.env.PORT || 3000;
console.log(`Port: ${PORT}`);
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Gracefully shutting down...");
  server.close(() => {
    console.log("Closed all connections.");
    process.exit(0);
  });
});
