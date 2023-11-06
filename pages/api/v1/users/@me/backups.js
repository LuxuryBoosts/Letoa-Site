import { checkConnection } from "../../../../../middleware/databaseCheck";
import { tokenMiddleware } from "../../../../../middleware/tokenAuthentication";
import { LetoaDiscordAPIErrors } from "../../../../../lib/codes";
import DatabaseClient from "../../../../../lib/mongoose";
import { filterBackups } from "../../../../../lib/filtering";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
async function handler(req, res) {
    const t = await tokenMiddleware(req, res, {
        guilds: false,
    });
    if (!t || t.code === 400)
        return res.status(t ? 200 : 401).json({
            code: t ? LetoaDiscordAPIErrors.DISCORD_NOT_LINKED : 401,
            message: t ? t.message : "401: Unauthorized",
            errors: [t ? t.message : "INVALID_AUTHENTICATION"],
        });
    const { accountID } = t;
    const backups = await DatabaseClient.fetchBackupsByLetoaAccount(accountID);
    const filtered = filterBackups(backups);
    return res.status(200).json({ code: 200, backups: filtered });
}

export default handler;
