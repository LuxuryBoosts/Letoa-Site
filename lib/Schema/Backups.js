const mongoose = require("mongoose");

const { BackupsSchema } = require("@letoabackup/utils");

const Backups =
    mongoose.models?.backups || mongoose.model("backups", BackupsSchema);

module.exports = { Backups, BackupsSchema };
