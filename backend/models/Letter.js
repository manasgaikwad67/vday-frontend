const mongoose = require("mongoose");

const letterSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    style: {
      type: String,
      enum: ["romantic", "funny", "emotional", "bollywood", "future-husband", "comfort"],
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Letter", letterSchema);
