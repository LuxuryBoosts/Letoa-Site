const { ConfigModel } = require("@letoabackup/utils");
const mongoose = require("mongoose");

module.exports =
    mongoose.models?.config || mongoose.model("config", ConfigModel);
