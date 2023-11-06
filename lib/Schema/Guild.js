const { GuildModel } = require("@letoabackup/utils");
const mongoose = require("mongoose");

module.exports =
    mongoose.models?.guilds || mongoose.model("guilds", GuildModel);
