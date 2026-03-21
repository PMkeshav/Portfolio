import mongoose from "mongoose";
import { env } from "./env.js";

let dbConnected = false;

export async function connectDb() {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(env.mongodbUri);
    dbConnected = true;
    return true;
  } catch (error) {
    dbConnected = false;
    return false;
  }
}

export function isDbConnected() {
  return dbConnected;
}
