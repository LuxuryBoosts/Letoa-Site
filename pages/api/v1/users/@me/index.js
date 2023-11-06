import { LetoaDiscordAPIErrors } from "../../../../../lib/codes";
import DatabaseClient from "../../../../../lib/mongoose";
import { checkConnection } from "../../../../../middleware/databaseCheck";
import { tokenMiddleware } from "../../../../../middleware/tokenAuthentication";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
async function handler(req, res) {
    const t = await tokenMiddleware(req, res, {
        guilds: true,
    });
    if (!t || t.code === 400)
        return res.status(t ? 200 : 401).json({
            code: t ? LetoaDiscordAPIErrors.DISCORD_NOT_LINKED : 401,
            message: t ? t.message : "401: Unauthorized",
            errors: [t ? t.message : "INVALID_AUTHENTICATION"],
        });

    const acc = await DatabaseClient.instant.findOne({
        discordId: t.discordId,
    });

    const customBots = await DatabaseClient.instances.findOne({
        linkedAccountID: t.accountID,
    });

    if (customBots) {
        t.customBots = {
            config: customBots.customConfig,
            clientId: customBots.clientId,
            clientSecret: customBots.clientSecret,
            botToken: customBots.botToken,
            activeServer: customBots.activeServer,
        };
    } else {
        t.customBots = null;
    }

    t.platinum = {
        linked: acc ? acc.discordTag : null,
    };

    return res.json(t);
}

export default handler;
