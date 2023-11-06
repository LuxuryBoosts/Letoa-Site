const { Members } = require("@letoabackup/utils");
const mongoose = require("mongoose");

module.exports = mongoose.models?.members || mongoose.model("members", Members);
