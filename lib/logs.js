import DatabaseClient from "./mongoose";

/**
 *
 * @param {Object} data
 */
export const createLog = async (data) => {
    const t = await DatabaseClient.addLog(data);
    return t;
};
