import { getClientIp } from "request-ip";
import { encrypt } from "../../../../../lib/encryption";
import DatabaseClient from "../../../../../lib/mongoose";
import RequestClient from "../../../../../lib/requestClient";
import User from "../../../../../lib/Schema/User";
import { generateDiscordToken } from "../../../../../lib/users";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
async function handler(req, res) {
    if (req.method !== "GET") {
        return res
            .status(405)
            .redirect({ code: 405, message: "Invalid Method" });
    }

    const { code, state } = req.query;
    if (!code || !state) {
        return res.redirect("/");
    }

    const client = new RequestClient();

    let resp;

    try {
        resp = await client.exchangeTokenAsCustomDomain(code);
    } catch (e) {
        return res.redirect(
            `${state === "localhost" ? "http" : "https"}://${state}`
        );
    }

    const { access_token, refresh_token } = resp;

    const c = new RequestClient(access_token, { authPrefix: "Bearer" });

    const user = await c.fetchMe({
        authPrefix: "Bearer",
    });

    const accessToken = encrypt(access_token).toString();
    const refreshToken = encrypt(refresh_token).toString();

    const u = await DatabaseClient.getUserByToken(user.id);

    const saveUser = {
        discordId: user.id,
        discordTag: `${user.username}#${user.discriminator}`,
        avatar: user.avatar ? user.avatar : null,
    };

    if (!u) {
        await User.create(saveUser);
    }

    const creds = await DatabaseClient.oauths.findOneAndUpdate(
        {
            discordId: user.id,
        },
        {
            accessToken,
            refreshToken,
        }
    );

    if (!creds) {
        await DatabaseClient.oauths.create({
            discordId: user.id,
            accessToken,
            refreshToken,
        });
    }

    const account = await DatabaseClient.fetchDiscordAccountByUserId(user.id);

    if (!account) {
        const token = generateDiscordToken(user.id);
        const payload = {
            token,
            banned: false,
            creationTime: Date.now(),
            registeredIP: getClientIp(req),
            discordId: user.id,
            username: `${user.username}#${user.discriminator}`,
            avatar: user.avatar,
        };
        await DatabaseClient.createDiscordAccount(payload);

        return res.redirect(
            `${
                state === "localhost" ? "http" : "https"
            }://${state}/redirect?token=${token}`
        );
    } else {
        return res.redirect(
            `${
                state === "localhost" ? "http" : "https"
            }://${state}/redirect?token=${account.token}`
        );
    }
}

export default handler;
