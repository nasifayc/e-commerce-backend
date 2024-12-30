import express from "express";
import routes from "./routes/index.js";
import db from "./config/database.js";
// import crypto from "crypto";

const app = express();

app.use("/api", routes);
db();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
