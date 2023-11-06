import DatabaseClient from "../../../../../lib/mongoose";
import { tokenMiddleware } from "../../../../../middleware/tokenAuthentication";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
const handler = async (req, res) => {
    if (req.method !== "POST") {
        return res
            .status(405)
            .json({ code: 405, message: "405: Invalid Method" });
    }
    const t = await tokenMiddleware(req, res);
    if (!t)
        return res.status(401).json({
            code: 401,
            message: "401: Unauthorized",
            errors: ["INVALID_AUTHENTICATION"],
        });
    await DatabaseClient.updateLoginByToken(req.headers["authorization"], null);
    return res
        .status(200)
        .json({ code: 200, message: "Unlinked Discord Successfully" });
};

export default handler;
