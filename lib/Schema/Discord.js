const { DiscordModel } = require("@letoabackup/utils");
const mongoose = require("mongoose");

module.exports =
    mongoose.models?.discords || mongoose.model("discords", DiscordModel);
