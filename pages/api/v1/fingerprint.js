import { fingerPrinter } from "../../../lib/fingerprint";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
const handler = async (req, res) => {
    const { fingerprint } = fingerPrinter.fingerprint(req);
    req.cache.setItem(
        fingerprint,
        JSON.stringify({
            valid: true,
            createdAt: Date.now(),
        })
    );
    return res.status(200).json({ code: 200, fingerprint });
};

export default handler;
