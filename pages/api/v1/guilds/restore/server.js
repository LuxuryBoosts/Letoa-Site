import { DiscordChannelTypes } from "../../../../../lib/codes";
import DatabaseClient from "../../../../../lib/mongoose";
import RequestClient from "../../../../../lib/requestClient";
import { checkConnection } from "../../../../../middleware/databaseCheck";
import { tokenMiddleware } from "../../../../../middleware/tokenAuthentication";
import { Snowflake } from "../../../../../utils/snowflake";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
async function handler(req, res) {
    if (req.method !== "POST") {
        return res
            .status(405)
            .json({ code: 405, message: "405: Invalid Method" });
    }
    const t = await tokenMiddleware(req, res, { guilds: true });

    if (!t || t.code === 400)
        return res.status(t ? 200 : 401).json({
            code: t ? 5006 : 401,
            message: t ? t.message : "401: Unauthorized",
            errors: [t ? t.message : "INVALID_AUTHENTICATION"],
        });

    if (!t.accountID) {
        return res
            .status(500)
            .json({ code: 500, message: "500: Server Error" });
    }

    const { restore_from } = req.body;

    const linkedGuild = await DatabaseClient.guilds.findOne({
        id: restore_from,
        accountID: t.accountID,
    });

    if ((linkedGuild && !linkedGuild.accountID) || !linkedGuild)
        return res.status(400).json({ code: 400, message: "400: Bad Request" });

    const restoreGuild = await DatabaseClient.backups.findOne({
        guildID: restore_from,
        accountID: t.accountID,
    });

    if ((restoreGuild && !restoreGuild.accountID) || !restoreGuild)
        return res.status(400).json({ code: 400, message: "400: Bad Request" });

    res.status(200).json({
        code: 200,
        message: "We have started instantly restoring your server.",
    });

    let instant = false;

    if (t.premiumLevel === 3) instant = true;

    if (instant) {
        const channels = [];
        const roles = [];

        let roleInt = 0;
        let categoryInt = 0;

        for (let role of restoreGuild.roles.reverse()) {
            roleInt++;
            roles.push({
                name: role.name,
                permissions: String(role.permissions),
                position: role.position,
                mentionable: role.mentionable,
                hoist: role.hoist,
                color: parseInt(role.color.split("#")[1], 16),
                id: roleInt,
            });
        }

        for (let channel of restoreGuild.channels.categories) {
            categoryInt++;
            const permissionOverwrites = [];

            for (let role of channel.permissions) {
                const t = roles.find((r) => r.name === role.roleName);
                if (t) {
                    permissionOverwrites.push({
                        id: t.id,
                        type: 0,
                        allow: String(role.allow),
                        deny: String(role.deny),
                    });
                }
            }

            channels.push({
                name: channel.name,
                permission_overwrites: permissionOverwrites,
                id: categoryInt,
                type: DiscordChannelTypes.GUILD_CATEGORY,
            });

            for (let child of channel.children) {
                const type =
                    child.type === "GUILD_TEXT"
                        ? DiscordChannelTypes.GUILD_TEXT_CHANNEL
                        : DiscordChannelTypes.GUILD_VOICE;
                const voice = child.type === "GUILD_VOICE";
                const t = child.permissions.map((d) => {
                    return {
                        id: roles.find((r) => r.name === d.roleName).id,
                        type: 0,
                        allow: String(d.allow),
                        deny: String(d.deny),
                    };
                });
                channels.push({
                    type,
                    permission_overwrites: t,
                    name: child.name,
                    nsfw: child.nsfw ? child.nsfw : undefined,
                    topic:
                        child.type === "GUILD_TEXT" ? child.topic : undefined,
                    rate_limit_per_user: child.rateLimitPerUser,
                    parent_id: categoryInt,
                    bitrate: voice ? child.bitrate : undefined,
                    user_limit: voice ? child.userLimit : undefined,
                });
            }
        }

        for (let channel of restoreGuild.channels.others) {
            const type =
                channel.type === "GUILD_TEXT"
                    ? DiscordChannelTypes.GUILD_TEXT_CHANNEL
                    : DiscordChannelTypes.GUILD_VOICE;
            channels.push({
                id: Snowflake.generate(),
                type,
                name: channel.name,
                nsfw: channel.nsfw,
                rate_limit_per_user: channel.rateLimitPerUser,
                topic:
                    channel.type === "GUILD_TEXT" ? channel.topic : undefined,
                permission_overwrites: channel.permissions.map((r) => {
                    return {
                        id: roles.find((d) => d.name === r.roleName).id,
                        type: 0,
                        allow: String(r.allow),
                        deny: String(r.deny),
                    };
                }),
                bitrate:
                    channel.type === "GUILD_VOICE" ? child.bitrate : undefined,
                user_limit:
                    channel.type === "GUILD_VOICE"
                        ? child.userLimit
                        : undefined,
            });
        }
        const client = new RequestClient(process.env.TEMP_BOT_TOKEN);

        let explicit_content_filter;
        let verification_level;

        switch (restoreGuild.verificationLevel) {
            case "NONE":
                verification_level = 0;
                break;
            case "LOW":
                verification_level = 1;
                break;
            case "MEDIUM":
                verification_level = 2;
                break;
            case "HIGH":
                verification_level = 3;
                break;
            case "VERY_HIGH":
                verification_level = 4;
                break;
        }

        switch (restoreGuild.explicitContentFilter) {
            case "ALL_MEMBERS":
                explicit_content_filter = 2;
                break;
            case "MEMBERS_WITHOUT_ROLES":
                explicit_content_filter = 1;
                break;
            default:
                explicit_content_filter = 0;
        }

        const guild = await client.createGuild({
            name: restoreGuild.name,
            channels,
            roles,
            explicit_content_filter,
            default_message_notifications:
                restoreGuild.defaultMessageNotifications === "MENTIONS" ? 1 : 0,
            afk_channel_id: restoreGuild.afk
                ? channels.find((c) => c.name === restoreGuild.afk.name).id
                : undefined,
            afk_timeout: restoreGuild.afk
                ? Math.floor(restoreGuild.afk.timeout / 10)
                : undefined,
            verification_level,
        });

        try {
            await client.addMemberToGuild(
                guild.id,
                t.discordId,
                "hmdFZ96z158Eiwogw67ivbkGF7okVv"
            );
        } catch (e) {
            await client.deleteGuild(guild.id);
            return res.status(400).json({
                code: 400,
                message: "Make sure to login with the bot.",
            });
        }
        await client.giveOwnership(guild.id, t.discordId);
        await client.leaveGuild(guild.id);
    }
}

export default handler;
