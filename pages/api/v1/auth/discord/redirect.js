import { WebsiteConfig } from "../../../../../lib/config";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
async function handler(req, res) {
    return res.redirect(
        `https://discord.com/oauth2/authorize?client_id=${
            process.env.NEW_BOT_ID
        }&redirect_uri=${encodeURIComponent(
            process.env.REDIRECT_URI
        )}&response_type=code&scope=${encodeURIComponent(
            "identify guilds guilds.join"
        )}&prompt=consent${
            req.query.redirect
                ? `&state=${encodeURIComponent(req.query.redirect)}`
                : "/"
        }`
    );
}

export default handler;
