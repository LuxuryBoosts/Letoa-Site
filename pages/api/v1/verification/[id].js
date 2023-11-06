import { LetoaDiscordAPIErrors, MiddlewareCodes } from "../../../../lib/codes";
import DatabaseClient from "../../../../lib/mongoose";
import RequestClient from "../../../../lib/requestClient";
import { discordAuthentication } from "../../../../middleware/discordAuthentication";
import { checkConnection } from "../../../../middleware/databaseCheck";
import { addVerifiedUser, addVerifiedUserToGuild } from "../../../../lib/users";
import recaptcha from "recaptcha-validator";
import { verify } from "hcaptcha";
import requestIp from "request-ip";
import {
    getIPLocation,
    proxyCheck,
    proxyGetIpLocation,
} from "../../../../lib/utils";
import { Snowflake } from "../../../../utils/snowflake";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
async function handler(req, res) {
    const { id } = req.query;
    const client = new RequestClient(process.env.NEW_BOT_TOKEN);

    switch (req.method) {
        case "POST":
            // const { captcha } = req.body;
            // if (!captcha) {
            //     return res
            //         .status(400)
            //         .json({ code: 400, message: "400: Missing Body" });
            // }

            // verify(process.env.HCAPTCHA_SECRET, captcha)
            //     .then((reply) => {
            //         if (!reply.success) {
            //             return res
            //                 .status(400)
            //                 .json({ code: 400, message: "Invalid Captcha" });
            //         } else {
            //         }
            //     })
            //     .catch((e) => {
            //         console.error(e);
            //         return res
            //             .status(400)
            //             .json({ code: 400, message: "Invalid Captcha" });
            //     });

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

            let gu = null;

            if (parseInt(id)) {
                try {
                    gu = await client.fetchGuild(id);
                } catch (e) {
                    return res.status(200).json({
                        code: LetoaDiscordAPIErrors.INVALID_GUILD,
                        message:
                            "An invalid guild was provided. Invite the bot here: https://desipher.io/bot",
                    });
                }
            } else {
                const af = await DatabaseClient.configs.findOne({
                    customLink: id,
                });
                try {
                    gu = await client.fetchGuild(af.id);
                } catch (e) {
                    return res.status(200).json({
                        code: LetoaDiscordAPIErrors.INVALID_GUILD,
                        message:
                            "An invalid guild was provided. Invite the bot here: https://desipher.io/bot",
                    });
                }
            }

            const h = await DatabaseClient.getGuild(gu.id);
            const c = await DatabaseClient.getConfig(gu.id);

            let prem = 0;

            const a = await DatabaseClient.fetchLoginByUserID(h.accountID);

            if (a) prem = a.premiumLevel;

            if (!parseInt(id) && prem < 2) {
                return res.status(200).json({
                    code: LetoaDiscordAPIErrors.INVALID_GUILD,
                    message:
                        "An invalid guild was provided. Invite the bot here: https://desipher.io/bot",
                });
            }

            if (!c.verificationRole) {
                return res.status(200).json({
                    code: LetoaDiscordAPIErrors.SETUP_NOT_VALID,
                    message:
                        "Invalid Setup Provided. Please contact server admins.",
                });
            }

            const loggedIp = requestIp.getClientIp(req);

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
                us = await client.fetchMemberFromGuild(gu.id, auth.discordId);
            } catch (e) {
                return res.status(200).json({
                    code: LetoaDiscordAPIErrors.MEMBER_NOT_IN_SERVER,
                    code: `You are not in the server. You are currently logged in as: ${auth.username}`,
                });
            }

            try {
                await client.addRole(
                    gu.id,
                    auth.discordId,
                    c.verificationRole,
                    {
                        reason: "Thank you for using Desipher. Reason: Verification",
                    }
                );
            } catch (e) {
                return res.status(200).json({
                    code: LetoaDiscordAPIErrors.INVALID_ROLE_PROVIDED,
                    message:
                        "An invalid role was provided. Please contact admins",
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

        case "GET":
            const t = await discordAuthentication(req, res);
            if (
                t.error &&
                t.reason === MiddlewareCodes.AUTHORIZATION_NOT_PROVIDED
            ) {
                return res.status(200).json({
                    code: LetoaDiscordAPIErrors.USER_NOT_LOGGED_IN,
                    message: "Login to discord to verify.",
                });
            }

            if (t.error && t.reason === MiddlewareCodes.INVALID_AUTHORIZATION) {
                return res.status(401).json({
                    code: LetoaDiscordAPIErrors.USER_NOT_LOGGED_IN,
                    message: "401: Unauthorized",
                });
            }

            let g;

            if (parseInt(id)) {
                try {
                    g = await client.fetchGuild(id);
                } catch (e) {
                    return res.status(200).json({
                        code: LetoaDiscordAPIErrors.INVALID_GUILD,
                        message:
                            "An invalid guild was provided. Invite the bot here: https://desipher.io/bot",
                    });
                }
            } else {
                const s = await DatabaseClient.configs.findOne({
                    customLink: id,
                });
                try {
                    g = await client.fetchGuild(s.id);
                } catch (e) {
                    return res.status(200).json({
                        code: LetoaDiscordAPIErrors.INVALID_GUILD,
                        message:
                            "An invalid guild was provided. Invite the bot here: https://desipher.io/bot",
                    });
                }
            }

            const guild = await DatabaseClient.getGuild(g.id);

            if (!guild) {
                return res
                    .status(400)
                    .json({ code: 400, message: "Invalid Guild" });
            }

            let premiumLevel = 0;

            const u = await DatabaseClient.fetchLoginByUserID(guild.accountID);

            if (u) premiumLevel = u.premiumLevel;

            if (!parseInt(id) && premiumLevel < 2) {
                return res.status(200).json({
                    code: LetoaDiscordAPIErrors.INVALID_GUILD,
                    message:
                        "An invalid guild was provided. Invite the bot here: https://desipher.io/bot",
                });
            }

            const config = await DatabaseClient.getConfig(g.id);

            if (!config.verificationRole) {
                return res.status(200).json({
                    code: LetoaDiscordAPIErrors.SETUP_NOT_VALID,
                    message: "Invalid Setup Provided",
                });
            }

            let user = null;

            try {
                user = await client.fetchMemberFromGuild(g.id, t.discordId);
            } catch (e) {
                return res.status(200).json({
                    code: LetoaDiscordAPIErrors.MEMBER_NOT_IN_SERVER,
                    message: `You are not in the server. You are currently logged in as: ${t.username}`,
                });
            }

            return res.json({
                code: 200,
                name: g.name,
                id: g.id,
                username: t.username,
                customization: premiumLevel === 3 ? {} : undefined,
                captcha: {
                    siteKey: "6Lcurg8bAAAAAEPb3zq0nR_hvI2zwErggXz9TCUD",
                },
            });
        default:
            return res
                .status(405)
                .json({ code: 405, message: "405: Method Not Allowed" });
    }
}

export default handler;
