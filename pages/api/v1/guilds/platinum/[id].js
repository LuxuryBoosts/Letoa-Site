import DatabaseClient from "../../../../../lib/mongoose";
import RequestClient from "../../../../../lib/requestClient";
import { calculatePermissions } from "../../../../../lib/calculate";
import { tokenMiddleware } from "../../../../../middleware/tokenAuthentication";
import { LetoaDiscordAPIErrors } from "../../../../../lib/codes";
import { updateGuild } from "../../../../../lib/utils";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
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
        calculatePermissions(roles, u.roles) || guild.owner_id === t.discordId;

    if (!isAdmin) {
        return res.status(200).json({
            code: LetoaDiscordAPIErrors.MISSING_ACCESS,
            message: "403: Missing Access",
        });
    }

    let { customDomain } = req.body;

    let premiumLevel = t.premiumLevel;

    if (!customDomain) {
        return res.status(200).json({
            code: LetoaDiscordAPIErrors.SETUP_NOT_VALID,
            message: "Settings failed to apply",
        });
    }

    if (customDomain) {
        const d = await DatabaseClient.configs.findOne({ customDomain });
        if (d && d.id !== id) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.CUSTOM_DOMAIN_ALREADY_EXISTS,
                message:
                    "The Custom Domain you have provided is already being used.",
            });
        }
    }

    await DatabaseClient.configs.findOneAndUpdate(
        { id: id },
        {
            customDomain: premiumLevel >= 3 ? customDomain : null,
        }
    );

    return res.json({
        code: 200,
        message: "Settings have successfully been applied",
    });
}
