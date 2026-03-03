/*
 * db.js – MongoDB Connection
 * --------------------------
 * Connects to MongoDB using the MONGO_URL from .env
 * Called once when the server starts
 */

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      tls: true,
      maxPoolSize: 2,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Stop the server if DB fails
  }
};

export default connectDB;
