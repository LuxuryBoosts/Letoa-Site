import { MiddlewareCodes } from "../lib/codes";
import DatabaseClient from "../lib/mongoose";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export const discordAuthentication = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        const token = req.headers["authorization"];
        if (!token)
            return resolve({
                error: true,
                reason: MiddlewareCodes.AUTHORIZATION_NOT_PROVIDED,
            });
        if (!token.startsWith("discord")) {
            return resolve({
                error: true,
                reason: MiddlewareCodes.INVALID_AUTHORIZATION,
            });
        }
        const user = await DatabaseClient.fetchDiscordAccount(token);

        // TODO: refresh token make sure it is valid.

        if (!user)
            return resolve({
                error: true,
                reason: MiddlewareCodes.INVALID_AUTHORIZATION,
            });
        if (user && user.banned) {
            return resolve({
                error: true,
                reason: MiddlewareCodes.INVALID_AUTHORIZATION,
            });
        }
        return resolve(user);
    });
};
