const { models, model } = require("mongoose");
const { InstantSchema } = require("@letoabackup/utils");

module.exports = models?.instant || model("instant", InstantSchema);
