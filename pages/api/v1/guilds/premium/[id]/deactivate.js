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

    const g = await DatabaseClient.getGuild(id);

    if (!g.activated) {
        return res.status(200).json({
            code: LetoaDiscordAPIErrors.SERVER_NOT_ACTIVATED,
            message: "This server has not been activated by premium.",
        });
    }

    if (g.activated && g.activatedBy !== t.accountID) {
        return res.status(200).json({
            code: LetoaDiscordAPIErrors.INVALID_ACCESS_TO_DEACTIVATE,
            message:
                "Another account has activated premium to this guild meaning you cannot deactivate premium using your account.",
        });
    }

    await DatabaseClient.guilds.findOneAndUpdate(
        {
            id,
        },
        {
            activated: false,
            activatedBy: null,
        }
    );

    return res.status(200).json({
        code: 200,
        message: "You have successfully deactivated premium on this server.",
    });
}

export default handler;
