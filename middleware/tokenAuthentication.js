import { convertJWT } from "../lib/jwt";
import DatabaseClient from "../lib/mongoose";
import RequestClient from "../lib/requestClient";
import { decrypt, encrypt } from "../lib/encryption";
import { filterGuilds } from "../utils/guilds";
import { checkConnection } from "../middleware/databaseCheck";
import { refreshGuilds, refreshToken } from "../lib/users";
import CryptoJS from "crypto-js";
import { checkPremium } from "../lib/utils";

const client = new RequestClient(process.env.BOT_TOKEN);

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export const tokenMiddleware = (req, res, options = { guilds: false }) => {
    return new Promise(async (resolve, reject) => {
        if (req.headers["authorization"]) {
            let letoa = req.headers["authorization"].split(".").length === 3;
            const user = await DatabaseClient.fetchLoginAccount({
                token: req.headers["authorization"],
            });
            if (user && !user.banned) {
                if (letoa) {
                    const letoaDiscord = await DatabaseClient.getUserByToken(
                        user.discordId
                    );
                    if (user.token !== req.headers["authorization"]) {
                        return resolve(false);
                    }
                    if (!letoaDiscord) {
                        return resolve({
                            code: 400,
                            message:
                                "Your discord account must be linked before accessing this information.",
                        });
                    }
                    await checkPremium({
                        token: req.headers["authorization"],
                    });
                    const {
                        accountID,
                        username,
                        email,
                        premiumLevel,
                        premiumExpire,
                        discordId,
                        admin,
                        allowedCustomBots,
                    } = user;
                    const { guilds, discordTag } = letoaDiscord;
                    const safeUser = {
                        accountID,
                        username,
                        email,
                        premiumExpire,
                        discordTag,
                        premiumLevel,
                        discordId,
                        admin: admin ? true : undefined,
                        // CHANGE BACK WHEN RELEASING!!!
                        // allowedCustomBots: true,
                        allowedCustomBots: allowedCustomBots ? true : false,
                    };
                    if (options.guilds) {
                        try {
                            let oauthData = await DatabaseClient.oauths.findOne(
                                {
                                    discordId: discordId,
                                }
                            );

                            const refresh_token = decrypt(
                                oauthData.refreshToken
                            ).toString(CryptoJS.enc.Utf8);

                            const refreshData = await refreshToken(
                                discordId,
                                refresh_token
                            );

                            await DatabaseClient.oauths.findOneAndUpdate(
                                {
                                    discordId: discordId,
                                },
                                {
                                    accessToken: encrypt(
                                        refreshData.access_token
                                    ).toString(),
                                    refreshToken: encrypt(
                                        refreshData.refresh_token
                                    ).toString(),
                                }
                            );

                            const access_token = refreshData.access_token;

                            const client = new RequestClient(access_token, {
                                authPrefix: "Bearer",
                            });

                            const newGuilds = await client.fetchGuilds();

                            await DatabaseClient.updateUserGuilds({
                                discordId: discordId,
                                guilds: newGuilds,
                            });

                            safeUser.guilds = filterGuilds(
                                newGuilds.sort((a, b) =>
                                    a.name.localeCompare(b.name)
                                )
                            );
                            return resolve(safeUser);
                        } catch (e) {
                            console.log(e);
                            return resolve({
                                code: 400,
                                message:
                                    "Your discord account must be linked before accessing this information.",
                            });
                        }
                    } else {
                        return resolve(safeUser);
                    }
                } else {
                    const { discordId, discordTag, avatar, banned } = user;
                    const safeUser = {
                        discordId,
                        discordTag,
                        avatar,
                        banned,
                    };
                    return resolve(safeUser);
                }
            } else return resolve(false);
        } else {
            return resolve(false);
        }
    });
};
