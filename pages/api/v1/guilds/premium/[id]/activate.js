import { LetoaDiscordAPIErrors } from "../../../../../../lib/codes";
import DatabaseClient from "../../../../../../lib/mongoose";
import RequestClient from "../../../../../../lib/requestClient";
import { tokenMiddleware } from "../../../../../../middleware/tokenAuthentication";
import { calculatePermissions } from "../../../../../../lib/calculate";
import { getServerLimit } from "../../../../../../lib/utils";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            code: 405,
            message: "405: Invalid Method",
            errors: ["INVALID_METHOD"],
        });
    }

    const { id } = req.query;

    const t = await tokenMiddleware(req, res);

    if (!t || t.code === 400)
        return res.status(t ? 200 : 401).json({
            code: t ? 5006 : 401,
            message: t ? t.message : "401: Unauthorized",
            errors: [t ? t.message : "INVALID_AUTHENTICATION"],
        });

    const client = new RequestClient(process.env.NEW_BOT_TOKEN, {
        authPrefix: "Bot",
    });

    let guild;
    try {
        guild = await client.fetchGuild(id);
    } catch (e) {
        return res.status(200).json({
            code: LetoaDiscordAPIErrors.BOT_NOT_IN_SERVER,
            message: "400: Invalid Guild",
        });
    }

    if (!guild) {
        return res.json({
            code: 400,
            message: "400: Bad Request",
            errors: ["INVALID_GUILD"],
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
        calculatePermissions(roles, u.roles) || guild.owner_id === t.discordId;

    if (!isAdmin) {
        return res.status(200).json({
            code: LetoaDiscordAPIErrors.MISSING_ACCESS,
            message: "403: Missing Access",
        });
    }

    const { premiumLevel } = t;

    const g = await DatabaseClient.getGuild(id);

    if (g.activated) {
        return res.status(200).json({
            code: LetoaDiscordAPIErrors.PREMIUM_ALREADY_ACTIVATED,
            message: "This server has already been activated by premium.",
        });
    }

    if (g.accountID && g.accountID !== t.accountID) {
        return res.status(200).json({
            code: LetoaDiscordAPIErrors.INVALID_ACCESS_TO_ACTIVATE,
            message:
                "Another account is linked to this guild meaning you cannot activate premium using your account.",
        });
    }

    if (premiumLevel === 0) {
        return res.status(200).json({
            code: LetoaDiscordAPIErrors.INVALID_PREMIUM_LEVEL,
            message:
                "You do not have premium. You may not activate any sort of premium on this server.",
        });
    }

    const activatedGuilds = await DatabaseClient.guilds.find({
        activated: true,
        activatedBy: t.accountID,
    });

    if (activatedGuilds.length >= getServerLimit(premiumLevel)) {
        return res.status(200).json({
            code: LetoaDiscordAPIErrors.TOO_MANY_ACTIVATED_SERVERS,
            message:
                "You have too many servers activated. Please deactivate a server to continue.",
        });
    }

    await DatabaseClient.guilds.findOneAndUpdate(
        {
            id,
        },
        {
            activated: true,
            activatedBy: t.accountID,
        }
    );

    return res.status(200).json({
        code: 200,
        message: "You have successfully activated premium on this server.",
    });
}

export default handler;
