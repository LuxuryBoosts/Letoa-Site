import { hash } from "../../../../../lib/hash";
import DatabaseClient from "../../../../../lib/mongoose";
import recaptcha from "recaptcha-validator";
import { generateToken, generateUserId } from "../../../../../lib/users";
import * as EmailValidator from "email-validator";
import { verify } from "hcaptcha";
import { sendEmailCustom } from "../../../../../lib/emailSender";
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
    const email = req.body.e;
    const username = req.body.u;
    const password = req.body.p;
    const fingerprint = req.body.f;

    const isFingerprintValid = BotDetection.isValidFingerprint(
        req.cache,
        req.headers["x-fingerprint"]
    );

    const isFingerprintValid2 = BotDetection.isValidFingerprint(
        req.cache,
        fingerprint
    );

    const isSuperPropertiesValid = BotDetection.isValidProperties(
        req.headers["x-super-properties"]
    );

    if (
        !isFingerprintValid ||
        !isSuperPropertiesValid ||
        !isFingerprintValid2
    ) {
        return res.status(403).json({
            code: 403,
            message: "403: You do not have access to this route",
        });
    }

    const hp = hash(password);
    const doesEmailExist = await DatabaseClient.fetchUserByEmail(email);
    const doesUsernameExist = await DatabaseClient.fetchUserByUsername(
        username
    );

    const errors = [];

    if (!captcha || !email || !password || !fingerprint) {
        return res.status(400).json({ code: 400, message: "Missing values" });
    }

    if (!EmailValidator.validate(email)) {
        errors.push({ type: "EMAIL", error: "Invalid Email Format" });
    }

    if (doesEmailExist) {
        errors.push({ type: "EMAIL", error: "Email already exists" });
    }

    if (doesUsernameExist) {
        errors.push({ type: "USERNAME", error: "Username already exists" });
    }

    if (errors.length !== 0) {
        return res.status(400).json({ code: 400, errors });
    }

    verify(process.env.HCAPTCHA_SECRET, captcha)
        .then(async (reply) => {
            if (reply.success === false) {
                return res
                    .status(400)
                    .json({ code: 400, message: "Invalid Captcha" });
            } else {
                const id = await generateUserId();
                const token = generateToken(id);
                await DatabaseClient.createLoginUser({
                    username,
                    password: hp,
                    email,
                    accountID: id,
                    token,
                });

                sendEmailCustom(
                    email,
                    "Welcome to Desipher",
                    "Welcome to Desipher",
                    `Thank you for signing  up to Desipher. You may link up your discord account <a href="https://desipher.io/link/discord">here</a>.` +
                        `<br>After linking your account you will be granted access to many features.` +
                        ` If you have any problems. Contact us at support@desipher.io or our <a href="https://desipher.io/discord">discord</a>`
                );
                return res.status(200).json({ code: 200, token });
            }
        })
        .catch((e) => {
            return res
                .status(400)
                .json({ code: 400, message: "Invalid Captcha" });
        });
};

export default handler;
