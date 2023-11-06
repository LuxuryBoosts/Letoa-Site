import { checkConnection } from "../../../../../middleware/databaseCheck";
import { tokenMiddleware } from "../../../../../middleware/tokenAuthentication";
import { LetoaDiscordAPIErrors } from "../../../../../lib/codes";
import DatabaseClient from "../../../../../lib/mongoose";
import { filterMembers } from "../../../../../lib/filtering";
import RequestClient from "../../../../../lib/requestClient";
import { generateGuildServerIcon } from "../../../../../lib/cdn";

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
    const guilds = await DatabaseClient.fetchGuildsByLetoaAccount(accountID);
    const temp = [];
    for (let guild of guilds) {
        const members = await DatabaseClient.members.find({ guild: guild.id });

        const hasBackup = await DatabaseClient.guilds.findOne({
            id: guild.id,
        });

        const users = filterMembers(members);
        temp.push({
            guildID: guild.id,
            name: hasBackup && hasBackup.name ? hasBackup.name : "Unknown",
            iconURL:
                hasBackup && hasBackup.iconURL
                    ? hasBackup.iconURL
                    : "/default.png",
            users,
        });
    }
    return res
        .status(200)
        .json({ code: 200, users: temp, admin: t.admin ? true : undefined });
}

export default handler;
