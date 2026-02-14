const User = require("../models/User");

/**
 * Get user config for AI services
 */
async function getUserConfig(userId) {
  if (!userId) {
    return {
      creatorName: process.env.MY_NAME || "Your Love",
      partnerName: process.env.HER_NAME || "My Love",
    };
  }

  try {
    const user = await User.findById(userId).select("creatorName partnerName relationshipStartDate");
    if (!user) {
      return {
        creatorName: process.env.MY_NAME || "Your Love",
        partnerName: process.env.HER_NAME || "My Love",
      };
    }
    return {
      creatorName: user.creatorName,
      partnerName: user.partnerName,
      relationshipStartDate: user.relationshipStartDate,
    };
  } catch {
    return {
      creatorName: process.env.MY_NAME || "Your Love",
      partnerName: process.env.HER_NAME || "My Love",
    };
  }
}

module.exports = { getUserConfig };
