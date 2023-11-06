import { discordAuthentication } from "../../../../middleware/discordAuthentication";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
    const auth = await discordAuthentication(req, res);
}
