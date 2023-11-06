import { tokenMiddleware } from "../../../../../../../middleware/tokenAuthentication";

const ALLOWED_METHODS = ["DELETE", "PUT", "GET"];

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
async function handler(req, res) {
    if (!ALLOWED_METHODS.includes(req.method)) {
        return res
            .status(405)
            .json({ code: 405, message: "405: Method Not Allowed" });
    }

    const { guildId, userId } = req.query;

    const banning = req.method === "DELETE" ? false : true;

    const t = await tokenMiddleware(req, res, { guilds: true });

    if (!t || t.code === 400)
        res.status(t ? 200 : 401).json({
            code: t ? 5006 : 401,
            message: t ? t.message : "401: Unauthorized",
            errors: [t ? t.message : "INVALID_AUTHENTICATION"],
        });

    let resp;

    return res.json({ method: req.method, guildId, userId });
}

export default handler;
