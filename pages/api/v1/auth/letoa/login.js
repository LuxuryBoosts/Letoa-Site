import { encodeFromBase64, hash } from "../../../../../lib/hash";
import DatabaseClient, { addLog } from "../../../../../lib/mongoose";
import recaptcha from "recaptcha-validator";
import { createLog } from "../../../../../lib/logs";
import requestIp from "request-ip";
import { verify } from "hcaptcha";
import { sendEmailCustom } from "../../../../../lib/emailSender";
import { getIPLocation } from "../../../../../lib/utils";
import { BotDetection } from "../../../../../client/BotDetection";

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

    const captcha = req.body.d;
    const username = req.body.u;
    const password = req.body.p;
    const fingerprint = req.body.f;

    if (!captcha || !username || !password || !fingerprint) {
        return res.status(400).json({
            code: 400,
            message: "Missing Values",
        });
    }

    const isFingerprintValid = BotDetection.isValidFingerprint(
        req.cache,
        fingerprint
    );

    const x_super_properties = BotDetection.isValidProperties(
        req.headers["x-super-properties"]
    );

    if (!isFingerprintValid || !x_super_properties) {
        return res.status(403).json({
            code: 403,
            message: "403: Forbidden",
        });
    }

    verify(process.env.HCAPTCHA_SECRET, captcha)
        .then(async (reply) => {
            if (!reply.success) {
                return res
                    .status(400)
                    .json({ code: 400, message: "Invalid Captcha" });
            } else {
                createLog({
                    accountID: null,
                    type: "LOGIN_ATTEMPT",
                    timestamp: new Date().getTime(),
                    loggedIP: requestIp.getClientIp(req),
                    body: req.body,
                    headers: req.headers,
                    endpoint: req.url,
                });

                const hp = hash(password);
                const user = await DatabaseClient.fetchUserByHashedPassword(
                    username,
                    hp
                );
                if (!user) {
                    return res.status(400).json({
                        code: 400,
                        message: "",
                        type: "INVALID_LOGIN",
                    });
                }

                if (requestIp.getClientIp(req) !== user.lastLoginIP) {
                    const details = await getIPLocation(
                        requestIp.getClientIp(req)
                    );

                    sendEmailCustom(
                        user.email,
                        "New Login Detected.",
                        "New Login",
                        `We have detected a new location login on your account. If this was not you, we consider asking you to quickly change your password and contact support.<br><br><strong>IP:</strong> ${requestIp.getClientIp(
                            req
                        )}<br><strong>Location:</strong> ${
                            details ? details.city : "UNKNOWN"
                        }, ${details ? details.country : "UNKNOWN"}`
                    );
                    await DatabaseClient.logins.findOneAndUpdate(
                        {
                            accountID: user.accountID,
                        },
                        {
                            lastLoginIP: requestIp.getClientIp(req),
                        }
                    );
                }

                return res.status(200).json({ code: 200, token: user.token });
            }
        })
        .catch((e) => {
            return res
                .status(400)
                .json({ code: 400, message: "Invalid Captcha" });
        });
};

export default handler;
