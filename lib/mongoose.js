const mongoose = require("mongoose");
const Colours = require("./colours");
const { Backups } = require("./Schema/Backups");
const Members = require("./Schema/Members");
const Config = require("./Schema/Config");
const Guild = require("./Schema/Guild");
const { convertJWT } = require("./jwt");
const User = require("./Schema/User");
const OAuth = require("./Schema/OAuth");
const Login = require("./Schema/Login");
const Logs = require("./Schema/Logs");
const LetoaAccount = require("./structures/LetoaUser");
const ResetPassword = require("./Schema/ResetPassword");
const Instances = require("./Schema/Instance");
const { default: PartialMember } = require("./structures/PartialMember");
const { default: ConfigStructure } = require("./structures/Config");
const Discord = require("./Schema/Discord");
const BlacklistsSchema = require("./Schema/Blacklists");
const Instant = require("./Schema/Instant");

class DatabaseClient {
    static connected = null;
    static connecting = false;
    static backups = Backups;
    static users = User;
    static oauths = OAuth;
    static configs = Config;
    static guilds = Guild;
    static logins = Login;
    static logs = Logs;
    static members = Members;
    static reset = ResetPassword;
    static discord = Discord;
    static blacklists = BlacklistsSchema;
    static instant = Instant;
    static instances = Instances;

    static async connect(
        url = process.env.MONGODB_URI,
        options = {
            autoCreate: true,
            bufferCommands: true,
            user: process.env.MONGO_USERNAME,
            pass: process.env.MONGO_PASSWORD,
            authSource: process.env.MONGO_AUTH,
        }
    ) {
        this.connecting = true;
        return mongoose
            .connect(url, options)
            .then(() => {
                this.connected = true;
                console.log(
                    `[DATABASE] Connected to the database successfully.`
                );
            })
            .catch((e) => {
                this.connected = false;
                Colours.DANGER(
                    `[DATABASE] Failed to connect to the database. ${e}`
                );
            });
    }

    static async updateUserGuilds(query, data) {
        return this.users.findOneAndUpdate(query, data);
    }

    /**
     *
     * @param {string} userToken
     */
    static async getUserByToken(userToken) {
        return this.users.findOne({ discordId: userToken });
    }

    static async getBackupCounts() {
        return await this.backups.find();
    }

    static async getMembersCount() {
        return this.members.find();
    }

    static async getGuildCount() {
        return await this.guilds.find();
    }

    /**
     * @param {string} guildId
     * @returns
     */
    static async getGuild(guildId) {
        const t = await Guild.findOne({ id: guildId });
        if (!t) return Guild.create({ id: guildId });
        return t;
    }

    /**
     * @param {string} guildId
     * @returns {ConfigStructure}
     */
    static async getConfig(guildId) {
        const t = await Config.findOne({ id: guildId });
        if (!t) return Config.create({ id: guildId });
        return t;
    }

    /**
     *
     * @param {string} guildId
     * @param {*} options
     * @returns
     */
    static async getVerifiedUsers(guildId, options = { CLEANED: true }) {
        if (options.CLEANED) {
            const data = [];
            for (let d of await Members.find({ guild: guildId }))
                data.push({
                    id: d.discordId,
                    tag: d.discordTag,
                    avatar: d.avatar,
                    guild: guildId,
                });
            return data;
        }
        return Members.find({ guild: guildId });
    }

    static async fetchUserByToken(token) {
        const t = convertJWT(token);
        return t ? this.users.findOne({ discordId: t.discordId }) : null;
    }

    /**
     *
     * @param {string} email
     * @returns {Promise<?LetoaAccount>}
     */
    static async fetchUserByEmail(email) {
        return this.logins.findOne({ email });
    }

    /**
     *
     * @param {string} username
     * @returns {Promise<?LetoaAccount>}
     */
    static async fetchUserByUsername(username) {
        return this.logins.findOne({ username });
    }

    /**
     *
     * @param {*} data
     * @returns {Promise<?LetoaAccount>}
     */
    static async createLoginUser(data) {
        return this.logins.create(data);
    }

    /**
     *
     * @param {*} data
     * @returns {Array<PartialMember>}
     */
    static async fetchVerifiedMembers(
        data,
        options = {
            limit: 10,
        }
    ) {
        return this.members.find(data, null, { limit: options.limit });
    }

    /**
     *
     * @param {string} password
     * @returns {Promise<?LetoaAccount>}
     */
    static async fetchUserByHashedPassword(username, password) {
        return this.logins.findOne({ username, password });
    }

    /**
     *
     * @param {string} token
     * @returns {Promise<?LetoaAccount>}
     */
    static async fetchLoginByToken(token) {
        return this.logins.findOne({ token });
    }

    /**
     *
     * @param {Object} query
     * @param {Object} info
     * @description
     * Example below:
     * ```js
     * DatabaseClient.updateLogin({token: "123"}, {username: "123"})
     * ```
     */
    static async updateLogin(query, info) {
        return this.logins.findOneAndUpdate(query, info);
    }

    /**
     *
     * @param {string} userId
     * @returns {Promise<?LetoaAccount>}
     */
    static async fetchLoginByUserID(userId) {
        return this.logins.findOne({ accountID: userId });
    }

    static async updateLoginByToken(token, discordId) {
        return this.logins.findOneAndUpdate({ token }, { discordId });
    }

    static async fetchLoginAccount(data) {
        return this.logins.findOne(data);
    }

    static async addLog(data) {
        return this.logs.create(data);
    }

    static async fetchBackupsByLetoaAccount(accountID) {
        return this.backups.find({ accountID });
    }

    static async fetchGuildsByLetoaAccount(accountID) {
        return this.guilds.find({ accountID });
    }

    static async createPasswordReset(data) {
        return this.reset.create(data);
    }

    /**
     *
     * @param {String} token
     */
    static async fetchDiscordAccount(token) {
        return this.discord.findOne({ token });
    }

    static async fetchDiscordAccountByUserId(discordId) {
        return this.discord.findOne({ discordId });
    }

    static async createDiscordAccount(data) {
        return this.discord.create(data);
    }
}

module.exports = DatabaseClient;
