import { encodeToBase64 } from "./hash";

/**
 *
 * @param {window} window
 */
export const generateSuperProperties = (window) => {
    return encodeToBase64(
        JSON.stringify({
            browser: window.navigator.appName,
            platform: window.navigator.platform,
            language: window.navigator.language,
            userAgent: window.navigator.userAgent,
        })
    );
};
