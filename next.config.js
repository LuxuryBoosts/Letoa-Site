const DatabaseClient = require("./lib/mongoose");
const path = require("path");

/** @type {import ("next").NextConfig} */
module.exports = {
    async redirects() {
        return [
            {
                source: "/discord",
                destination: "https://t.me/desipherio",
                permanent: false,
            },
            {
                source: "/api/login",
                destination: "/api/v1/auth/discord/redirect",
                permanent: false,
            },
            {
                source: "/bot",
                destination: `https://discord.com/api/oauth2/authorize?client_id=${
                    process.env.NEXT_PUBLIC_BOT_ID
                }&permissions=8&redirect_uri=${encodeURIComponent(
                    process.env.NEXT_PUBLIC_REDIRECT_URI
                )}&response_type=code&scope=identify%20guilds%20guilds.join%20bot%20applications.commands`,
                permanent: false,
            },
        ];
    },
    images: {
        domains: ["cdn.discordapp.com", "cdn.desipher.io", "i.imgur.com"],
    },
    optimizeFonts: false,
};
