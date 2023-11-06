import DatabaseClient from "../../../../lib/mongoose";
import RequestClient from "../../../../lib/requestClient";
import { calculatePermissions } from "../../../../lib/calculate";
import { tokenMiddleware } from "../../../../middleware/tokenAuthentication";
import { LetoaDiscordAPIErrors } from "../../../../lib/codes";
import { updateGuild } from "../../../../lib/utils";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
async function handler(req, res) {
    const method = req.method;
    if (method === "GET") {
        const t = await tokenMiddleware(req, res, { guilds: true });
        if (!t || t.code === 400)
            return res.status(t ? 200 : 401).json({
                code: t ? 5006 : 401,
                message: t ? t.message : "401: Unauthorized",
                errors: [t ? t.message : "INVALID_AUTHENTICATION"],
            });
        const { id } = req.query;

        const client = new RequestClient(process.env.NEW_BOT_TOKEN);
        let guild;
        try {
            guild = await client.fetchGuild(id);
        } catch (e) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.BOT_NOT_IN_SERVER,
                message: "400: Invalid Guild",
            });
        }

        updateGuild(
            {
                id: id,
            },
            guild
        );

        let u;
        try {
            u = await client.fetchMemberFromGuild(id, t.discordId);
        } catch (e) {
            console.log(e);
            return res
                .status(200)
                .json({ code: 403, message: "403: Missing Access" });
        }

        const roles = await client.fetchRolesFromGuild(id);
        const isAdmin =
            calculatePermissions(roles, u.roles) ||
            guild.owner_id === t.discordId;
        const channels = await client.fetchChannelsFromGuild(id);

        if (!isAdmin) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.MISSING_ACCESS,
                message: "403: Missing Access",
            });
        }
        if (!guild) {
            return res.json({
                code: 400,
                message: "400: Bad Request",
                errors: ["INVALID_GUILD"],
            });
        }

        const guildDB = await DatabaseClient.getGuild(id);
        const {
            verificationRole,
            verificationEnabled,
            loggingChannel,
            redirectLink,
            customLink,
            customDomain,
            vpnCheck,
            customMessage,
            logIp,
            inAppCustomMessage,
            inAppButtonText,
            inAppEmbedColor,
            inAppCustomImage,
        } = await DatabaseClient.getConfig(id);
        const { onCooldown, accountID, activated } = guildDB;

        let premiumLevel = t.premiumLevel;

        return res.json({
            code: 200,
            guild: guild,
            verifiedUsers: [],
            recentBackups: [],
            premium: {
                level: premiumLevel,
                activated,
            },
            settings: {
                verification: {
                    role: verificationRole,
                    enabled: verificationEnabled,
                    logging: loggingChannel,
                    redirectUrl: redirectLink,
                    customLink,
                    vpnCheck,
                    customMessage,
                    logIp,
                    inAppCustomMessage,
                    inAppButtonText,
                    inAppEmbedColor,
                    inAppCustomImage,
                },
                backups: {
                    onCooldown: onCooldown,
                },
            },
            platinum: {
                customDomain,
            },
            important: {
                channels: channels.filter((e) => e.type === 0),
                roles: guild.roles
                    .filter((e) => e.position !== 0 && !e.managed)
                    .sort((a, b) => {
                        return a.position - b.position;
                    }),
            },
            channels: channels,
            linked: accountID ? true : false,
        });
    } else if (method === "POST") {
        const t = await tokenMiddleware(req, res, { guilds: true });
        if (!t || t.code === 400)
            return res.status(t ? 200 : 401).json({
                code: t ? 5006 : 401,
                message: t ? t.message : "401: Unauthorized",
                errors: [t ? t.message : "INVALID_AUTHENTICATION"],
            });
        const { id } = req.query;
        const client = new RequestClient(process.env.NEW_BOT_TOKEN);
        let guild;
        try {
            guild = await client.fetchGuild(id);
        } catch (e) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.BOT_NOT_IN_SERVER,
                message: "400: Invalid Guild",
            });
        }

        let u;
        try {
            u = await client.fetchMemberFromGuild(id, t.discordId);
        } catch (e) {
            return res
                .status(200)
                .json({ code: 403, message: "403: Missing Access" });
        }

        const roles = await client.fetchRolesFromGuild(id);
        const isAdmin =
            calculatePermissions(roles, u.roles) ||
            guild.owner_id === t.discordId;
        const channels = await client.fetchChannelsFromGuild(id);

        if (!isAdmin) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.MISSING_ACCESS,
                message: "403: Missing Access",
            });
        }

        const guildDB = await DatabaseClient.getGuild(id);

        let {
            verificationRole,
            verificationEnabled,
            loggingChannel,
            redirectUrl,
            customLink,
            inAppCustomMessage,
            inAppButtonText,
            inAppEmbedColor,
            inAppCustomImage,
            vpnCheck,
        } = req.body;

        let premiumLevel = t.premiumLevel;

        if (
            verificationEnabled === undefined ||
            verificationRole === undefined ||
            loggingChannel === undefined ||
            (premiumLevel === 3 && redirectUrl === undefined)
        ) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.SETUP_NOT_VALID,
                message: "Settings failed to apply",
            });
        }

        const botRole = roles.find((r) => r.managed && r.name === "Desipher");

        const validRole = roles.find(
            (r) => !r.managed && r.id === verificationRole
        );

        if (botRole.position < validRole.position) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.PROVIDED_ROLE_NOT_ACCESSABLE,
                message:
                    "Please make sure the bot role is above the provided role.",
            });
        }

        if (loggingChannel) {
            const channel = channels.find((ch) => ch.id === loggingChannel);
            if (!channel) {
                return res.status(200).json({
                    code: LetoaDiscordAPIErrors.INVALID_CHANNEL_PROVIDED,
                    message:
                        "Invalid Channel Provided. Make sure the bot has access to it.",
                });
            }
        }

        if (customLink && premiumLevel >= 2) {
            const result = await DatabaseClient.blacklists.findOne({
                text: customLink,
            });

            if (result) {
                return res.status(200).json({
                    code: LetoaDiscordAPIErrors.BLACKLISTED_CUSTOM_LINK,
                    message:
                        "The custom link you have provided is blacklisted and cannot be used.",
                });
            }

            const c = await DatabaseClient.configs.findOne({
                customLink,
            });

            if (c && c.id !== id) {
                return res.status(200).json({
                    code: LetoaDiscordAPIErrors.CUSTOM_LINK_ALREADY_EXISTS,
                    message:
                        "The custom link you have provided is already in use.",
                });
            }
        }

        await DatabaseClient.configs.findOneAndUpdate(
            { id: id },
            {
                verificationRole,
                verificationEnabled,
                loggingChannel,
                redirectLink: premiumLevel >= 3 ? redirectUrl : null,
                customLink: premiumLevel >= 2 ? customLink : null,
                inAppCustomMessage:
                    premiumLevel >= 1 ? inAppCustomMessage : null,
                inAppButtonText: premiumLevel >= 1 ? inAppButtonText : null,
                inAppEmbedColor: premiumLevel >= 1 ? inAppEmbedColor : null,
                inAppCustomImage: premiumLevel >= 1 ? inAppCustomImage : null,
                vpnCheck: premiumLevel >= 1 ? vpnCheck : false,
            }
        );

        return res.json({
            code: 200,
            message: "Settings have successfully been applied",
        });
    } else {
        return res
            .status(405)
            .json({ code: 405, message: "405: Invalid Method" });
    }
}

export default handler;
