const mongoose = require("mongoose");

const dailyMessageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    date: { type: String, required: true, unique: true }, // YYYY-MM-DD
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyMessage", dailyMessageSchema);
