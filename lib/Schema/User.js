const { UserModel } = require("@letoabackup/utils");
const mongoose = require("mongoose");

module.exports = mongoose.models?.users || mongoose.model("users", UserModel);
