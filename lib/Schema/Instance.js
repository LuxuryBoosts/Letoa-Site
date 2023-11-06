const { InstancesModel } = require("@letoabackup/utils");
const { models, model } = require("mongoose");

module.exports = models?.instances || model("instances", InstancesModel);
