const { Blacklists } = require("@letoabackup/utils");
const mongoose = require("mongoose");

const BlacklistsSchema =
    mongoose.models.blacklists || mongoose.model("blacklists", Blacklists);

module.exports = BlacklistsSchema;
