import { encodeToBase64 } from "./hash";
import DatabaseClient from "./mongoose";
import { v1 } from "uuid";
import RequestClient from "./requestClient";

export const generateRandomCharacters = (size = 16) => {
    var s = "";
    var randomchar = function () {
        var n = Math.floor(Math.random() * 62);
        if (n < 10) return n; //1-10
        if (n < 36) return String.fromCharCode(n + 55); //A-Z
        return String.fromCharCode(n + 61); //a-z
    };
    while (s.length < size) s += randomchar();
    return s;
};

export const generateToken = (accountId) => {
    const tokens = [];
    tokens.push(Buffer.from(accountId).toString("base64"));
    tokens.push(generateRandomCharacters(32));
    tokens.push(
        Buffer.from(new Date().getTime().toString()).toString("base64")
    );
    return tokens.join(".");
};

export const generateDiscordToken = (userId) => {
    const tokens = ["discord"];
    tokens.push(Buffer.from(userId).toString("base64"));
    tokens.push(generateRandomCharacters(32));
    tokens.push(
        Buffer.from(new Date().getTime().toString()).toString("base64")
    );
    return tokens.join(".");
};

/**
 *
 * @param {String} product_title
 * @returns
 */
export const getPremiumPlan = (product_title) => {
    const t = product_title.toLowerCase();

    if (t.includes("gold")) {
        return 1;
    } else if (t.includes("diamond")) {
        return 2;
    } else if (t.includes("platinum")) {
        return 3;
    } else {
        return 1;
    }
};

export const refreshToken = async (
    discordId,
    refreshToken,
    options = {
        old: false,
    }
) => {
    const data = await DatabaseClient.oauths.findOne({ discordId: discordId });
    if (!data) return { error: true };
    if (data.expires && data.expires >= new Date().getTime()) {
        return data.accessToken;
    }
    const client = new RequestClient();
    try {
        const test = await client.refreshToken({
            client_id: options.old
                ? process.env.BOT_ID
                : process.env.NEW_BOT_ID,
            client_secret: options.old
                ? process.env.BOT_CLIENT_SECRET
                : process.env.NEW_BOT_CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        });
        return test;
    } catch (e) {
        console.log(e);

        return null;
    }
};

export const addVerifiedUser = async (
    userId,
    guildId,
    options = {
        loggedIP: null,
    }
) => {
    const oauth = await DatabaseClient.oauths.findOne({ discordId: userId });
    const s = await DatabaseClient.discord.findOne({ discordId: userId });
    const member = await DatabaseClient.members.findOne({
        guild: guildId,
        discordId: userId,
    });
    if (!oauth) return null;
    let d;

    if (member) {
        d = await DatabaseClient.members.findOneAndUpdate(
            {
                guild: guildId,
                discordId: userId,
            },
            {
                discordId: userId,
                refreshToken: oauth.refreshToken,
                accessToken: oauth.accessToken,
                avatar: s.avatar,
                discordTag: s.username,
                guild: guildId,
                new: true,
                loggedIP: options.loggedIP,
            }
        );
    } else {
        d = await DatabaseClient.members.create({
            discordId: userId,
            refreshToken: oauth.refreshToken,
            accessToken: oauth.accessToken,
            avatar: s.avatar,
            discordTag: s.username,
            guild: guildId,
            new: true,
            loggedIP: options.loggedIP,
        });
    }

    return d;
};

export const refreshGuilds = async (accessToken) => {
    const client = new RequestClient(accessToken, { authPrefix: "Bearer" });
    try {
        const req = await client.fetchGuilds();
        return req;
    } catch (e) {
        return null;
    }
};

export const addVerifiedUserToGuild = async (discordId, guildId) => {
    const discord = await DatabaseClient.discord.findOne({ discordId });
    if (!discord) return;
    const { verifiedGuilds } = discord;
    const newVerifiedGuilds = [...verifiedGuilds, guildId];
    await DatabaseClient.discord.findOneAndUpdate(
        {
            discordId,
        },
        {
            verifiedGuilds: newVerifiedGuilds,
        }
    );
    return;
};

export const generateUserId = async () => {
    return v1();
};
