import mongoose from "mongoose";

let isConnected = false; // global flag to track connection state

const connectDB = async () => {
  // If already connected, reuse the existing connection
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("MongoDB already connected ✅");
    return;
  }

  try {
    // Connect to MongoDB (reuse existing connections in serverless)
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "authentication", // specify your DB name explicitly
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log(`MongoDB connected successfully 🟢`);
  } catch (err) {
    console.error("MongoDB connection error ❌:", err.message);
    throw err;
  }
};

export default connectDB;
