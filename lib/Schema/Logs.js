const { LogSchema } = require("@letoabackup/utils");
const mongoose = require("mongoose");

module.exports = mongoose.models?.logs || mongoose.model("logs", LogSchema);
