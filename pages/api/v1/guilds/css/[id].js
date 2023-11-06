/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
async function handler(req, res) {
    const { id } = req.query;

    res.send(`
* {
    background-color: #${id};
}
    `);
}

export default handler;
