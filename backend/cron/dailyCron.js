const cron = require("node-cron");
const DailyMessage = require("../models/DailyMessage");
const { generateDailyMessage } = require("../services/groqService");

// Run every day at 7:00 AM
const dailyCronJob = cron.schedule(
  "0 7 * * *",
  async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Check if already generated today
      const exists = await DailyMessage.findOne({ date: today });
      if (exists) {
        console.log(`📅  Daily message already exists for ${today}`);
        return;
      }

      const message = await generateDailyMessage();
      await DailyMessage.create({ message, date: today });
      console.log(`💕  Daily message generated for ${today}`);
    } catch (error) {
      console.error("Daily message cron error:", error.message);
    }
  },
  { scheduled: false }
);

module.exports = dailyCronJob;
