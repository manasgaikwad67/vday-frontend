const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    caption: { type: String, required: true },
    date: { type: Date, required: true },
    imageUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

memorySchema.index({ date: 1 });

module.exports = mongoose.model("Memory", memorySchema);
