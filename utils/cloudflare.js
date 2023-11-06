const axios = require("axios");

module.exports = {
    /**
     *
     * @param {"off" | "essentially_off" | "low" "medium" | "high" | "under_attack"} level
     */
    async changeSecurityLevel(level) {
        axios.default.patch(
            `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE_ID}/settings/security_level`,
            {
                value: level,
            },
            {
                headers: {
                    "X-Auth-Email": process.env.CF_AUTH_EMAIL,
                    "X-Auth-Key": process.env.CF_AUTH_KEY,
                    "Content-Type": "application/json",
                },
            }
        );
    },
};
