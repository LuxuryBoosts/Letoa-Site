/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
async function handler(req, res) {
    const { domain } = req.query;

    if (!domain) return res.redirect("/");

    return res.redirect(
        `https://discord.com/oauth2/authorize?client_id=${
            process.env.NEW_BOT_ID
        }&redirect_uri=${encodeURIComponent(
            process.env.CUSTOM_REDIRECT_URI
        )}&response_type=code&scope=${encodeURIComponent(
            "identify guilds guilds.join"
        )}&prompt=consent&state=${domain}`
    );
}

export default handler;
