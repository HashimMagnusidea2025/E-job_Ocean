

import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();
const url = process.env.DB_URL;

export default async function connectDB() { 
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB Error", error);
    process.exit(1);
  }
};
