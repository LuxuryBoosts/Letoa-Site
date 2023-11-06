const { OAuthSchema } = require("@letoabackup/utils");
const mongoose = require("mongoose");

module.exports =
    mongoose.models?.oauths || mongoose.model("oauths", OAuthSchema);
