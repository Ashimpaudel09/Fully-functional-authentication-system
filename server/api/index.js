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

// CORS configuration for separate deployments
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Allow localhost for development
      if (origin.includes('localhost')) return callback(null, true);
      
      // Allow Vercel domains
      if (origin.includes('.vercel.app')) return callback(null, true);
      
      // Allow custom domains if specified
      if (process.env.CLIENT_ORIGIN && origin === process.env.CLIENT_ORIGIN) {
        return callback(null, true);
      }
      
      // For production, you might want to be more restrictive
      if (process.env.NODE_ENV === 'production') {
        return callback(new Error("Not allowed by CORS: " + origin));
      }
      
      // Allow all origins in development
      return callback(null, true);
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
