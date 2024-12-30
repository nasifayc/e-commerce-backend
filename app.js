import express from "express";
import routes from "./routes/index.js";
import db from "./config/database.js";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

db();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));

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
