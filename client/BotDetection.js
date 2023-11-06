export class BotDetection {
    static isValidProperties(properties) {
        const buff = Buffer.from(properties, "base64");
        const text = buff.toString("utf-8");
        const json = JSON.parse(text);

        const { browser, platform, language, userAgent } = json;

        if (!browser || !platform || !language || !userAgent) {
            return false;
        } else return true;
    }

    /**
     *
     * @param {*} cache
     * @param {string | null} fingerprint
     */
    static isValidFingerprint(cache, fingerprint) {
        if (!fingerprint) return true;
        const bool = cache.getItem(fingerprint);
        if (!bool) return false;
        else return true;
    }
}

const d = {
    browser: "Netscape",
    platform: "Win32",
    language: "en-GB",
    userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.83 Safari/537.36",
};
