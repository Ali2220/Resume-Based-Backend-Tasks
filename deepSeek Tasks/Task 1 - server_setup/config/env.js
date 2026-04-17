const dotenv = require("dotenv");
dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV is not defined in environment variables");
}

if (!process.env.CLIENT_URL) {
  throw new Error("Client-url is not defined in environment variables");
}

const config = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  mongoUri: process.env.MONGODB_URI,
  clientUrl: process.env.CLIENT_URL,
};

module.exports = config;
