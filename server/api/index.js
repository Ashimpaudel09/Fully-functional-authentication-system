// server/api/index.js
import express from "express";
import cors from "cors";
import "dotenv/config.js";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";

import connectDB from "../config/mongodb.js";
import authRouter from "../routes/authRoutes.js";
import userRouter from "../routes/userRoutes.js";

const app = express();

// Connect to DB once per cold start
connectDB();

// Allow your local frontend + deployed frontend to talk to this API
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_ORIGIN?.trim(), // e.g. https://your-frontend.vercel.app
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow tools like Postman / server-to-server calls without origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true, // allow cookies to be sent
  })
);

app.use(express.json());
app.use(cookieParser());

// Health check for debugging
app.get("/", (req, res) => {
  res.send("API is working");
});

// Mount routers WITHOUT /api prefix here.
// Vercel will inject /api in the final URL automatically.
app.use("/auth", authRouter);
app.use("/user", userRouter);

// Export serverless handler for Vercel
export default serverless(app);
