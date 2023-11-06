import { createLog } from "../../../../../lib/logs";
import requestIp from "request-ip";
import recaptcha from "recaptcha-validator";
import DatabaseClient from "../../../../../lib/mongoose";
import { generateRandomCharacters } from "../../../../../lib/users";
import { sendEmail } from "../../../../../lib/emailSender";
import { verify } from "hcaptcha";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
const handler = async (req, res) => {
    if (req.method !== "POST") {
        return res
            .status(405)
            .json({ code: 405, message: "405: Invalid Method" });
    }

    const msg = {
        code: 200,
        message:
            "We have sent an email to the email you provided. If an existing account is found, you will be able to reset your password.",
    };

    const email = req.body.e;
    const captcha = req.body.c;

    const errors = [];

    if (!email) errors.push({ type: "EMAIL", value: "Email is required" });
    if (!captcha) {
        return res
            .status(400)
            .json({ code: 400, message: "400: Missing Captcha" });
    }

    verify(process.env.HCAPTCHA_SECRET, captcha)
        .then((reply) => {
            if (!reply.success) {
                return res
                    .status(400)
                    .json({ code: 400, message: "400: Invalid Captcha" });
            }
        })
        .catch((e) => {
            return res
                .status(400)
                .json({ code: 400, message: "400: Invalid Captcha" });
        });

    createLog({
        accountID: null,
        type: "RESET_PASSWORD",
        timestamp: new Date().getTime(),
        loggedIP: requestIp.getClientIp(req),
        body: req.body,
        headers: req.headers,
        endpoint: req.url,
    });

    await DatabaseClient.reset.findOneAndDelete({ email });

    const account = await DatabaseClient.fetchUserByEmail(email);

    if (!account) {
        return res.status(200).json(msg);
    } else {
        const { accountID, username } = account;

        const resetToken = generateRandomCharacters(128);

        await DatabaseClient.createPasswordReset({
            accountID,
            email,
            loggedIP: requestIp.getClientIp(req),
            expired: false,
            visits: 0,
            createdAt: new Date().getTime(),
            resetToken,
        });
        sendEmail(email, {
            website: process.env.MAIN_URL,
            token: resetToken,
            user: username,
        });
        return res.status(200).json(msg);
    }
};

export default handler;
