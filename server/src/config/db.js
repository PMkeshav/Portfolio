import mongoose from "mongoose";
import { env } from "./env.js";

let dbConnected = false;
let connectionPromise = null;

export async function connectDb() {
  mongoose.set("strictQuery", true);

  if (mongoose.connection.readyState === 1) {
    dbConnected = true;
    return true;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose
    .connect(env.mongodbUri)
    .then(() => {
      dbConnected = true;
      return true;
    })
    .catch(() => {
      dbConnected = false;
      connectionPromise = null;
      return false;
    });

  return connectionPromise;
}

export function isDbConnected() {
  return dbConnected || mongoose.connection.readyState === 1;
}
