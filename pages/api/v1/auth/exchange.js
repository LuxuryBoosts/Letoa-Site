import { WebsiteConfig } from "../../../../lib/config";
import { convertJSON } from "../../../../lib/jwt";
import { LetoaDiscordAPIErrors } from "../../../../lib/codes";
import OAuth from "../../../../lib/Schema/OAuth";
import User from "../../../../lib/Schema/User";
import { encrypt } from "../../../../lib/encryption";
import DatabaseClient from "../../../../lib/mongoose";
import RequestClient from "../../../../lib/requestClient";
import { generateDiscordToken } from "../../../../lib/users";
import requestIp from "request-ip";

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
    const app = req.body["app"];
    if (!code)
        return res.status(400).json({
            code: 400,
            message: "400: Bad Request",
            errors: [
                { id: "MISSING_BODY_PARAMETER", value: "'Code' is missing." },
            ],
        });

    // const d = {
    //     client_id: process.env.TEMP_CLIENT_ID,
    //     client_secret: process.env.TEMP_CLIENT_SECRET,
    //     grant_type: "authorization_code",
    //     redirect_uri: WebsiteConfig.redirectUrl,
    //     code: code,
    // };

    const c = new RequestClient();

    let resp;

    try {
        resp = await c.exchangeToken(code, app ? true : false);
    } catch (e) {
        console.log(e);
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

    const { access_token } = resp;

    const client = new RequestClient(access_token, { authPrefix: "Bearer" });

    const user = await client.fetchMe({
        authPrefix: "Bearer",
    });

    const accessToken = encrypt(resp.access_token).toString();
    const refreshToken = encrypt(resp.refresh_token).toString();

    const dbUser = await DatabaseClient.getUserByToken(user.id);

    const saveUser = {
        discordId: user.id,
        discordTag: `${user.username}#${user.discriminator}`,
        avatar: user.avatar ? user.avatar : null,
    };

    if (!dbUser) {
        await User.create(saveUser);
    }

    if (req.body["token"] && !req.body["token"].startsWith("discord.")) {
        saveUser.guilds = await client.fetchGuilds();

        const results = await DatabaseClient.fetchLoginAccount({
            discordId: user.id,
        });

        const findC = await DatabaseClient.oauths.findOneAndUpdate(
            { discordId: user.id },
            { accessToken, refreshToken }
        );

        if (!findC) {
            await DatabaseClient.oauths.create({
                discordId: user.id,
                accessToken,
                refreshToken,
            });
        }

        if (results && results.token !== req.body["token"]) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.ALREADY_LINKED_TO_ANOTHER_LETOA_ACCOUNT,
                message:
                    "Provided discord account is already linked with another account.",
            });
        }

        const s = await DatabaseClient.updateLoginByToken(
            req.body["token"],
            user.id
        );

        if (s.premiumLevel >= 1) {
            try {
                const c = new RequestClient(process.env.NEW_BOT_TOKEN);
                c.addRole("882029568406466570", user.id, "882062251513765980", {
                    reason: "Premium User.",
                });
            } catch (e) {
                null;
            }
        }

        return res.status(200).json({
            code: 200,
            token: s.token,
        });
    }

    const findC = await DatabaseClient.oauths.findOneAndUpdate(
        { discordId: user.id },
        { accessToken, refreshToken }
    );
    if (!findC) {
        await DatabaseClient.oauths.create({
            discordId: user.id,
            accessToken,
            refreshToken,
        });
    }

    const r = await DatabaseClient.fetchDiscordAccountByUserId(user.id);

    if (!r) {
        const token = generateDiscordToken(user.id);
        const payload = {
            token,
            banned: false,
            creationTime: new Date().getTime(),
            registeredIP: requestIp.getClientIp(req),
            discordId: user.id,
            username: `${user.username}#${user.discriminator}`,
            avatar: user.avatar,
        };
        await DatabaseClient.createDiscordAccount(payload);
        return res.status(200).json({
            code: 200,
            token,
        });
    } else {
        return res.status(200).json({
            code: 200,
            token: r.token,
        });
    }
}

export default handler;
