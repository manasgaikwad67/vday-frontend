const User = require("../models/User");

/**
 * Get user config for AI personalization
 */
async function getUserConfig(userId) {
  try {
    if (!userId) return {};

    const user = await User.findById(userId).select("creatorName partnerName relationshipStartDate").lean();
    if (!user) return {};

    return {
      creatorName: user.creatorName || undefined,
      partnerName: user.partnerName || undefined,
      relationshipStartDate: user.relationshipStartDate || undefined,
    };
  } catch (error) {
    console.error("getUserConfig error:", error.message);
    return {};
  }
}

module.exports = { getUserConfig };
