import axios from "axios";

export const getStats = async () => {
    const res = await axios.get("/api/v1/stats");

    return res.data;
};
