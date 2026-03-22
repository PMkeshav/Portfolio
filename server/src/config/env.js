import dotenv from "dotenv";

dotenv.config();

export const env = {
  host: process.env.HOST || "127.0.0.1",
  port: Number(process.env.PORT || 4000),
  mongodbUri:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio_cms",
  adminAccessKey: process.env.ADMIN_ACCESS_KEY || "change-me",
};
