const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // Creator's login credentials
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    // Unique URL slug for the couple's page
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Partner's entry password
    partnerPassword: {
      type: String,
      required: true,
    },

    // Personalization
    creatorName: {
      type: String,
      default: "Your Love",
    },
    partnerName: {
      type: String,
      default: "My Love",
    },
    relationshipStartDate: {
      type: Date,
      default: Date.now,
    },

    // Settings
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate unique slug
userSchema.statics.generateSlug = async function (baseName) {
  let slug = baseName.toLowerCase().replace(/[^a-z0-9]/g, "");
  let uniqueSlug = slug;
  let counter = 1;

  while (await this.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${slug}${counter}`;
    counter++;
  }

  return uniqueSlug;
};

module.exports = mongoose.model("User", userSchema);
