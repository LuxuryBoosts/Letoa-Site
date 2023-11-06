const { LoginSchema } = require("@letoabackup/utils");
const { models, model } = require("mongoose");

module.exports = models?.logins || model("logins", LoginSchema);
