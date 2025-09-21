import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// Global cache for connection across hot reloads in dev
let cached = (global as any).mongoose as {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "recipe_app", 
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
