import DatabaseClient from "../../../../../lib/mongoose";
import RequestClient from "../../../../../lib/requestClient";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
async function handler(req, res) {
    if (req.method !== "POST") {
        return res
            .status(405)
            .json({ code: 405, message: "405: Invalid Method" });
    }

    const code = req.body["code"];

    if (!code) {
        return res.status(400).json({
            code: 400,
            message: "400: Bad Request",
            errors: [
                { id: "MISSING_BODY_PARAMETER", value: "'Code' is missing." },
            ],
        });
        w;
    }

    const c = new RequestClient();

    let resp;

    try {
        resp = await c.exchangeTokenAsInstantRestore(code);
    } catch (e) {
        return res.status(400).json({
            code: 400,
            message: "400: Bad Request",
            errors: [
                {
                    id: "INVALID_CODE",
                    value: "'Code' was an invalid property.",
                },
            ],
        });
    }

    const { access_token, refresh_token } = resp;

    const client = new RequestClient(access_token, { authPrefix: "Bearer" });

    const user = await client.fetchMe({
        authPrefix: "Bearer",
    });

    const linkedDiscord = await DatabaseClient.logins.findOne({
        discordId: user.id,
    });

    const saveUser = {
        accessToken: access_token,
        refreshToken: refresh_token,
        discordId: user.id,
        discordTag: `${user.username}#${user.discriminator}`,
        accountID: linkedDiscord.accountID,
    };

    const created = await DatabaseClient.instant.findOne({
        discordId: user.id,
    });

    if (!created) {
        await DatabaseClient.instant.create(saveUser);
        return res.status(200).json({
            code: 200,
            message: "Linked Instant Server Restore",
        });
    } else {
        await DatabaseClient.instant.findOneAndUpdate(
            {
                discordId: user.id,
            },
            saveUser
        );
        return res.status(200).json({
            code: 200,
            message: "Linked Instant Server Restore",
        });
    }
}

export default handler;
