import { checkConnection } from "../../../../../middleware/databaseCheck";
import { tokenMiddleware } from "../../../../../middleware/tokenAuthentication";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
async function handler(req, res) {
    const t = await tokenMiddleware(req, res, { guilds: true });
    if (!t)
        return res.status(401).json({
            code: 401,
            message: "401: Unauthorized",
            errors: ["INVALID_AUTHENTICATION"],
        });
    return res.json(t);
}

export default handler;
