import DatabaseClient from "../../../../lib/mongoose";
import RequestClient from "../../../../lib/requestClient";
import { calculatePermissions } from "../../../../lib/calculate";
import { tokenMiddleware } from "../../../../middleware/tokenAuthentication";
import { LetoaDiscordAPIErrors } from "../../../../lib/codes";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
async function handler(req, res) {
    const t = await tokenMiddleware(req, res, { guilds: false });
    if (!t || t.code === 400)
        return res.status(t ? 200 : 401).json({
            code: t ? 5006 : 401,
            message: t ? t.message : "401: Unauthorized",
            errors: [t ? t.message : "INVALID_AUTHENTICATION"],
        });

    const { id } = req.body;

    if (!id) return res.status(400).json({ code: 400, message: "Bad Request" });

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

    // if (guild.owner_id !== t.discordId) {
    //     return res.status(403).json({
    //         code: LetoaDiscordAPIErrors.OWNER_REQUIRED,
    //         message:
    //             "You must have ownership of the server before linking it to your letoa account.",
    //     });
    // }

    const g = await DatabaseClient.getGuild(id);

    if (g.accountID && g.accountID !== t.accountID) {
        return res.status(400).json({
            code: LetoaDiscordAPIErrors.ALREADY_LINKED_TO_ACCOUNT,
            message:
                "This guild is already linked to another Desipher Account.",
        });
    }

    await DatabaseClient.guilds.findOneAndUpdate(
        { id },
        {
            accountID: t.accountID,
        }
    );

    return res.json({
        code: 200,
        message: `Successfully linked ${guild.name} to your Desipher Account.`,
    });
}

export default handler;
