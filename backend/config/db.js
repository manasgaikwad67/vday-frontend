const mongoose = require("mongoose");
const dns = require("dns");

// Use Google DNS for resolution
dns.setServers(["8.8.8.8", "8.8.4.4"]);

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`💾  MongoDB connected: ${conn.connection.host}`);
    isConnected = true;
  } catch (err) {
    console.error("⚠️  MongoDB connection failed:", err.message);
    console.log("🔄  Running in demo mode (no database)");
    isConnected = false;
  }
};

const getConnectionStatus = () => isConnected;

module.exports = connectDB;
module.exports.getConnectionStatus = getConnectionStatus;
