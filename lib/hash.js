import sha1 from "sha1";

/**
 *
 * @param {string} text
 */
export const hash = (text) => {
    return sha1(text);
};

export const encodeFromBase64 = (hash) => {
    const b = new Buffer(hash, "base64");
    return b.toString();
};

/**
 *
 * @param {string} text
 * @returns
 */
export const encodeToBase64 = (text) => {
    return Buffer.from(text).toString("base64");
};
