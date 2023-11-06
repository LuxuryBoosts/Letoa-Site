import DatabaseClient from "../../../../../lib/mongoose";
import RequestClient from "../../../../../lib/requestClient";
import { sleep } from "../../../../../lib/utils";
import { decrypt, encrypt } from "../../../../../lib/encryption";
import { tokenMiddleware } from "../../../../../middleware/tokenAuthentication";
import { refreshToken } from "../../../../../lib/users";
import CryptoJS from "crypto-js";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */

async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            code: 405,
            message: "405: Invalid Method",
            errors: ["INVALID_METHOD"],
        });
    }

    const t = await tokenMiddleware(req, res, { guilds: true });

    if (!t || t.code === 400)
        res.status(t ? 200 : 401).json({
            code: t ? 5006 : 401,
            message: t ? t.message : "401: Unauthorized",
            errors: [t ? t.message : "INVALID_AUTHENTICATION"],
        });

    const client = new RequestClient(process.env.NEW_BOT_TOKEN, {
        authPrefix: "Bot",
    });
    const { restore_to, restore_from } = req.body;

    let restoreToGuild;
    try {
        restoreToGuild = await client.fetchGuild(restore_to);
    } catch (e) {
        return res.status(400).json({ code: 400, message: "400: Bad Request" });
    }

    if (!t.accountID) {
        return res
            .status(500)
            .json({ code: 500, message: "500: Server Error" });
    }

    const linkedGuild = await DatabaseClient.guilds.findOne({
        id: restore_from,
        accountID: t.accountID,
    });

    if (!linkedGuild) {
        return res.status(400).json({ code: 400, message: "400: Bad Request" });
    }

    const verifiedMembers = await DatabaseClient.fetchVerifiedMembers(
        {
            guild: restore_from,
        },
        {
            limit: t.premiumLevel !== 0 ? 250000 : 100,
        }
    );

    res.status(200).json({
        code: 200,
        message: "Members have started restoring.",
    });

    for (let member of verifiedMembers) {
        const c = new RequestClient(
            member.new ? process.env.NEW_BOT_TOKEN : process.env.BOT_TOKEN,
            {
                authPrefix: "Bot",
            }
        );
        try {
            let accessToken = decrypt(member.accessToken).toString(
                CryptoJS.enc.Utf8
            );
            try {
                const refreshableToken = decrypt(member.refreshToken).toString(
                    CryptoJS.enc.Utf8
                );

                accessToken = await refreshToken(
                    member.discordId,
                    refreshableToken,
                    {
                        old: !member.new,
                    }
                );

                if (!accessToken) continue;

                await DatabaseClient.members.findOneAndUpdate(
                    {
                        discordId: member.discordId,
                    },
                    {
                        accessToken: encrypt(
                            accessToken.access_token
                        ).toString(),
                        refreshToken: encrypt(
                            accessToken.refresh_token
                        ).toString(),
                    }
                );
            } catch (e) {
                console.log("Error Refreshing Token", e);
                continue;
            }
            const resp = await c.addMemberToGuild(
                restoreToGuild.id,
                member.discordId,
                accessToken.access_token
            );
        } catch (e) {
            console.log(`Member Restore Error ${e}`);
        }
    }
}

export default handler;
