import { hash } from "../../../../../lib/hash";
import DatabaseClient from "../../../../../lib/mongoose";
import recaptcha from "recaptcha-validator";
import { generateToken, generateUserId } from "../../../../../lib/users";
import { tokenMiddleware } from "../../../../../middleware/tokenAuthentication";
import * as EmailValidator from "email-validator";

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
    const t = await tokenMiddleware(req, res);
    if (!t)
        return res.status(401).json({
            code: 401,
            message: "401: Unauthorized",
            errors: ["INVALID_AUTHENTICATION"],
        });

    const email = req.body.e;
    const password = req.body.p;
    const new_password = req.body.np;
    const errors = [];

    if (!email || !password) {
        return res.status(400).json({ code: 400, message: "Missing values" });
    }

    let doesEmailExist = await DatabaseClient.fetchUserByEmail(email);

    // We check this just incase they didn't update their email as it would generate a false positive due to the active account.
    if (doesEmailExist && doesEmailExist.token === req.headers["authorization"])
        doesEmailExist = false;

    const userFetched = await DatabaseClient.fetchLoginByToken(
        req.headers["authorization"]
    );

    const doesPasswordMatch = userFetched.password === hash(password);

    if (!EmailValidator.validate(email)) {
        errors.push({ type: "EMAIL", error: "Invalid Email Format" });
    }

    if (!doesPasswordMatch)
        errors.push({
            type: "PASSWORD",
            error: "An invalid password was provided.",
        });

    if (doesEmailExist)
        errors.push({ type: "EMAIL", error: "Email Already Exists" });

    if (errors.length !== 0) {
        return res.status(400).json({ code: 400, errors });
    }

    const upload = {};

    // Change token when changing password.
    if (new_password) {
        upload.password = hash(new_password);
        upload.token = generateToken(userFetched.accountID);
    }

    if (email !== userFetched.email) upload.email = email;

    await DatabaseClient.updateLogin(
        { token: req.headers["authorization"] },
        upload
    );

    return res.status(200).json({
        code: 200,
        message: "Successfully updated account information",
        token: upload.token ? upload.token : undefined,
    });
};

export default handler;
