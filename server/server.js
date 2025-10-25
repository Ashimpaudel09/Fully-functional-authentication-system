// server/server.js
import express from "express";
import cors from "cors";
import "dotenv/config.js";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// DB connect
connectDB();

// CORS for local React dev
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// same health check
app.get("/api", (req, res) => {
  res.send("API is working (local)");
});

// Note that on local, we DO include /api prefix:
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
