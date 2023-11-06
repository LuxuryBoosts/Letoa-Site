import { SellixConfig } from "../../../../../lib/sellix";
import { signHmacSha512 } from "../../../../../lib/webhooks";
import requestIp from "request-ip";
import DatabaseClient from "../../../../../lib/mongoose";
import RequestClient from "../../../../../lib/requestClient";
import { sendEmailCustom } from "../../../../../lib/emailSender";
import { getPremiumPlan } from "../../../../../lib/users";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
const handler = async (req, res) => {
    const data = req.body.data;

    if (req.method !== "POST") {
        return res
            .status(405)
            .json({ code: 405, message: "405: Invalid Method" });
    }

    switch (req.body.event) {
        case "order:paid:product":
            const { custom_fields } = req.body.data;
            const accountID =
                custom_fields[
                    "Desipher Account ID - https://desipher.io/dashboard/account"
                ];

            const account = await DatabaseClient.fetchLoginByUserID(accountID);

            if (!account) {
                const client = new RequestClient();
                try {
                    sendEmailCustom(
                        data.customer_email,
                        "Premium Failed To Process - Desipher",
                        "We failed to process your premium purchase.",
                        'We failed to process your premium payment due to you providing an invalid Desipher account id.<br>This has been alerted to admins and you may also contact them about this issue.<br>You may contact them <a href="https://desipher.io/discord">here</a>'
                    );
                    await client.client.post(process.env.DISCORD_WEBHOOK, {
                        auth: false,
                        body: {
                            embeds: [
                                {
                                    title: "Desipher Premium Error",
                                    description: `We failed to find an account with the Account ID: ${accountID}`,
                                    fields: [
                                        {
                                            name: "Customer Email",
                                            value: data.customer_email,
                                        },
                                        {
                                            name: "Product",
                                            value: data.product_title,
                                        },
                                    ],
                                    color: 3631321,
                                    timestamp: new Date().toISOString(),
                                    footer: {
                                        text: "Desipher",
                                    },
                                },
                            ],
                        },
                    });
                } catch (e) {
                    console.error(e);
                }
                return res.status(200).json({
                    code: 200,
                    message: "Invalid Account ID Provided.",
                });
            }

            const date = new Date();

            data.product_title.includes("Yearly")
                ? date.setFullYear(date.getFullYear() + 1)
                : date.setMonth(date.getMonth() + 1);

            const premiumExpire = date.getTime();

            let premiumLevel = getPremiumPlan(data.product_title);

            sendEmailCustom(
                data.customer_email,
                "Thank You For Purchasing Desipher Premium",
                "Thank You",
                `We have processed your payment and we have added the premium level ${premiumLevel} to your Desipher Account.<br>If you have any questions or problems you may visit <a href="https://desipher.io/help">our help page</a> or contact us on <a href="https://desipher.io/discord">discord</a>`
            );

            await DatabaseClient.logins.findOneAndUpdate(
                {
                    accountID: accountID,
                },
                {
                    premiumLevel,
                    premiumExpire,
                }
            );

            try {
                const c = new RequestClient(process.env.NEW_BOT_TOKEN);
                c.addRole(
                    "882029568406466570",
                    account.discordId,
                    "882062251513765980",
                    {
                        reason: "Premium User.",
                    }
                );
            } catch (e) {
                null;
            }

            return res
                .status(200)
                .json({ code: 200, response_code: 0, accountID });
        default:
            return res
                .status(200)
                .json({ code: 400, message: "Unhandled Webhook" });
    }
};

export default handler;
