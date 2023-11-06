const { ResetPassword } = require("@letoabackup/utils");
const mongoose = require("mongoose");

module.exports =
    mongoose.models?.reset_passwords ||
    mongoose.model("reset_passwords", ResetPassword);
