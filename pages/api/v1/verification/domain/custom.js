import {
    LetoaDiscordAPIErrors,
    MiddlewareCodes,
} from "../../../../../lib/codes";
import DatabaseClient from "../../../../../lib/mongoose";
import RequestClient from "../../../../../lib/requestClient";
import { verify } from "hcaptcha";
import requestIp from "request-ip";
import {
    addVerifiedUser,
    addVerifiedUserToGuild,
} from "../../../../../lib/users";
import { proxyGetIpLocation, proxyCheck } from "../../../../../lib/utils";
import { discordAuthentication } from "../../../../../middleware/discordAuthentication";
import { Snowflake } from "../../../../../utils/snowflake";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
async function handler(req, res) {
    const custom = req.headers["x-letoa-custom"];
    const client = new RequestClient(process.env.NEW_BOT_TOKEN);

    if (req.method === "GET") {
        if (!custom)
            return res.status(400).json({ code: 400, message: "Invalid Body" });

        const auth = await discordAuthentication(req, res);
        if (
            auth.error &&
            auth.reason === MiddlewareCodes.AUTHORIZATION_NOT_PROVIDED
        ) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.USER_NOT_LOGGED_IN,
                message: "Login to discord to verify.",
            });
        }

        if (
            auth.error &&
            auth.reason === MiddlewareCodes.INVALID_AUTHORIZATION
        ) {
            return res.status(401).json({
                code: LetoaDiscordAPIErrors.USER_NOT_LOGGED_IN,
                message: "401: Unauthorized",
            });
        }

        const d = await DatabaseClient.configs.findOne({
            customDomain: custom,
        });

        if (!d) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.INVALID_DOMAIN,
                message:
                    "We could not find your server with your custom domain. Please make sure it is configured properly.",
            });
        }

        let guild;

        try {
            guild = await client.fetchGuild(d.id);
        } catch (e) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.INVALID_GUILD,
                message:
                    "An invalid guild was provided. Invite the bot here: https://desipher.io/bot",
            });
        }

        if (!guild) {
            return res
                .status(400)
                .json({ code: 400, message: "Invalid Guild" });
        }

        if (!d.verificationRole) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.SETUP_NOT_VALID,
                message: "Invalid Setup Provided",
            });
        }

        const g = await DatabaseClient.getGuild(d.id);

        let user = null;

        try {
            user = await client.fetchMemberFromGuild(g.id, auth.discordId);
        } catch (e) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.MEMBER_NOT_IN_SERVER,
                message: `You are not in the server. You are currently logged in as: ${auth.username}`,
            });
        }

        let premiumLevel = 0;

        const u = await DatabaseClient.fetchLoginByUserID(g.accountID);

        if (u) premiumLevel = u.premiumLevel;

        return res.json({
            code: 200,
            name: guild.name,
            id: guild.id,
            username: auth.username,
            customization: premiumLevel === 3 ? {} : undefined,
            captcha: {
                siteKey: "6Lcurg8bAAAAAEPb3zq0nR_hvI2zwErggXz9TCUD",
            },
        });
    } else if (req.method === "POST") {
        const { captcha } = req.body;
        if (!captcha) {
            return res
                .status(400)
                .json({ code: 400, message: "400: Missing Body" });
        }

        verify(process.env.HCAPTCHA_SECRET, captcha)
            .then((reply) => {
                if (!reply.success) {
                    return res
                        .status(400)
                        .json({ code: 400, message: "Invalid Captcha" });
                } else {
                }
            })
            .catch((e) => {
                console.error(e);
                return res
                    .status(400)
                    .json({ code: 400, message: "Invalid Captcha" });
            });

        const auth = await discordAuthentication(req, res);

        if (
            auth.error &&
            auth.reason === MiddlewareCodes.AUTHORIZATION_NOT_PROVIDED
        ) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.USER_NOT_LOGGED_IN,
                message: "Login to discord to verify.",
            });
        }

        if (
            auth.error &&
            auth.reason === MiddlewareCodes.INVALID_AUTHORIZATION
        ) {
            return res.status(401).json({
                code: LetoaDiscordAPIErrors.USER_NOT_LOGGED_IN,
                message: "401: Unauthorized",
            });
        }

        const data = await DatabaseClient.configs.findOne({
            customDomain: custom,
        });

        if (!data) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.INVALID_DOMAIN,
                message:
                    "We could not find your server with your custom domain. Please make sure it is configured properly.",
            });
        }

        const h = await DatabaseClient.getGuild(data.id);
        const c = await DatabaseClient.getConfig(data.id);

        let prem = 0;

        const a = await DatabaseClient.fetchLoginByUserID(h.accountID);

        let gu;

        try {
            gu = await client.fetchGuild(data.id);
        } catch (e) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.INVALID_GUILD,
                message:
                    "An invalid guild was provided. Invite the bot here: https://desipher.io/bot",
            });
        }

        if (a) prem = a.premiumLevel;

        if (prem < 3) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.INVALID_DOMAIN,
                message:
                    "We could not find your server with your custom domain. Please make sure it is configured properly.",
            });
        }

        if (!c.verificationRole) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.SETUP_NOT_VALID,
                message:
                    "Invalid Setup Provided. Please contact server admins.",
            });
        }

        const loggedIp = req.headers["x-user-ip"];

        const proxy = await proxyCheck(loggedIp);

        if (proxy && prem >= 1 && c.vpnCheck) {
            try {
                const deconstructed = Snowflake.deconstruct(t.discordId);

                await client.sendMessage(c.loggingChannel, {
                    embeds: [
                        {
                            color: 16711680,
                            title: "Blocked VPN / Proxy",
                            thumbnail: {
                                url: `https://cdn.discordapp.com/avatars/${auth.discordId}/${auth.avatar}.webp?size=256`,
                            },
                            description: `${auth.username} - \`${auth.discordId}\` has tried to verify with a VPN / Proxy!\n\nThis user has been blocked from being verified and must disable it to gain access to verify.`,
                            fields: [
                                {
                                    name: "Account Created",
                                    value: `<t:${Math.floor(
                                        deconstructed.timestamp / 1000
                                    )}:R>`,
                                },
                                {
                                    name: "VPN / Proxy IP",
                                    value: `${loggedIp}`,
                                },
                            ],
                            timestamp: new Date().toISOString(),
                            footer: {
                                text: "Letoa Backups",
                            },
                        },
                    ],
                });
                return res.status(200).json({
                    code: LetoaDiscordAPIErrors.VPN_PROXY_DETECTED,
                    message:
                        "We have detected a VPN / Proxy connection. Please disable your proxy or vpn to continue.",
                });
            } catch (e) {
                return res.status(200).json({
                    code: LetoaDiscordAPIErrors.VPN_PROXY_DETECTED,
                    message:
                        "We have detected a VPN / Proxy connection. Please disable your proxy or vpn to continue.",
                });
            }
        }

        let us = null;
        try {
            us = await client.fetchMemberFromGuild(data.id, auth.discordId);
        } catch (e) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.MEMBER_NOT_IN_SERVER,
                code: `You are not in the server. You are currently logged in as: ${auth.username}`,
            });
        }

        try {
            await client.addRole(gu.id, auth.discordId, c.verificationRole, {
                reason: "Thank you for using Desipher. Reason: Verification",
            });
        } catch (e) {
            return res.status(200).json({
                code: LetoaDiscordAPIErrors.INVALID_ROLE_PROVIDED,
                message: "An invalid role was provided. Please contact admins",
            });
        }

        try {
            const ipInfo = await proxyGetIpLocation(loggedIp);

            const deconstructed = Snowflake.deconstruct(auth.discordId);

            const fields = [
                {
                    name: "Account Created",
                    value: `<t:${Math.floor(
                        deconstructed.timestamp / 1000
                    )}:R>`,
                    inline: true,
                },
                ipInfo
                    ? {
                          name: "IP Info",
                          value: `Country: \`${ipInfo.country}\`\nContinent: \`${ipInfo.continent}\``,
                          inline: true,
                      }
                    : undefined,
            ];

            if (prem === 3)
                fields.push({
                    name: "Logged IP",
                    value: `${loggedIp}`,
                });

            await client.sendMessage(c.loggingChannel, {
                embeds: [
                    {
                        color: 3830487,
                        title: "Verified A User",
                        thumbnail: {
                            url: `https://cdn.discordapp.com/avatars/${auth.discordId}/${auth.avatar}.webp?size=256`,
                        },
                        description: `${auth.username} - \`${auth.discordId}\` has successfully verified!\n\nThis user has been added to the **verified member list** and will be eligible for transfer when needed.`,
                        fields: fields,
                        timestamp: new Date().toISOString(),
                        footer: {
                            text: "Desipher",
                        },
                    },
                ],
            });
        } catch (e) {
            console.log(e);
        }

        const redirectUrl = prem === 3 ? c.redirectLink : undefined;

        await addVerifiedUser(auth.discordId, gu.id, {
            loggedIP: loggedIp,
        });
        await addVerifiedUserToGuild(auth.discordId, gu.id);

        return res.status(200).json({
            code: 200,
            message: `You have successfully been verified in ${gu.name}!`,
            redirect: redirectUrl,
        });
    }
}

export default handler;
