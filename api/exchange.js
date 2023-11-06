import axios from "axios";

export const exchangeCode = async ({ queryKey }) => {
    const [, { code, authorization = null }] = queryKey;
    const res = await axios.post(
        "/api/v1/auth/exchange",
        {
            code: code,
            token: authorization ? authorization : undefined,
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    if (res.status !== 200) {
        throw new Error("Invalid Code");
    }

    return res.data;
};
