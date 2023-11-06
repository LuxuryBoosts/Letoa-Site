import { createLog } from "../../../../../lib/logs";
import requestIp from "request-ip";
import recaptcha from "recaptcha-validator";
import DatabaseClient from "../../../../../lib/mongoose";
import { generateRandomCharacters } from "../../../../../lib/users";
import { sendEmail } from "../../../../../lib/emailSender";
import { generateToken } from "../../../../../lib/users";
import { hash } from "../../../../../lib/hash";
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

    const password = req.body.p;
    const captcha = req.body.c;
    const resetToken = req.body.t;

    if (!password || !captcha || !resetToken) {
        return res.status(400).json({ code: 400, message: "Missing values" });
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

    const fetchedResetPassword = await DatabaseClient.reset.findOne({
        resetToken,
    });

    if (
        (fetchedResetPassword && fetchedResetPassword.expired) ||
        !fetchedResetPassword
    ) {
        return res
            .status(400)
            .json({ code: 400, message: "400: Invalid Reset Token" });
    }

    const fetchedAccount = await DatabaseClient.fetchLoginByUserID(
        fetchedResetPassword.accountID
    );

    const upload = {};

    upload.password = hash(password);
    upload.token = generateToken(fetchedAccount.accountID);

    await DatabaseClient.updateLogin(
        {
            accountID: fetchedAccount.accountID,
        },
        upload
    );

    await DatabaseClient.reset.findOneAndUpdate(
        {
            resetToken,
        },
        {
            expired: true,
        }
    );

    return res.status(200).json({
        code: 200,
        message: "Successfully reset password.",
        token: upload.token,
    });
};

export default handler;
