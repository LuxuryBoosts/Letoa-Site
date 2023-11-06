const mongoose = require("mongoose");

/**
 * @description
 * ```js
 * {
 *  type: "SERVER_RESTORE" | "SERVER_BACKUP" | "MEMBER_RESTORE",
 *  data: {
 *      guildId: string | null,
 *      createdAt: number | null,
 *      ...args
 *  }
 * }
 * ```
 */
const Intervals = new mongoose.Schema({});

module.exports =
    mongoose.models.intervals || mongoose.model("intervals", Intervals);
