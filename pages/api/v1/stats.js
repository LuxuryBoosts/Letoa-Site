import DatabaseClient, { backups } from "../../../lib/mongoose";
import { checkConnection } from "../../../middleware/databaseCheck";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
async function handler(req, res) {
    /**
     * Re-work on Stats.
     * TODO
     * Get exact member count + backups
     */
    return res.json({
        code: 200,
        stats: {
            guilds: "2500+",
            authorizedUsers: "200k+",
            backups: "500+",
        },
    });

    // return res.json({
    //     code: 200,
    //     stats: {
    //         guilds: guilds.length,
    //         authorizedUsers: "20k+",
    //         backups: "200+",
    //     },
    // });
}

export default handler;
