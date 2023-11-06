export const generateGuildAdd = (
    guild_id,
    options = {
        PROMPT: "none",
        SCOPES: "bot%20guilds%20guilds.join%20identify%20applications.commands",
        REDIRECT_URI: "https://desipher.io/discord/login",
        CLIENT_ID: "1057147856781328455",
        PERMISSIONS: "8",
        GUILD_SELECT: true,
    }
) => {
    return (
        `https://discord.com/api/oauth2/authorize?client_id=${options.CLIENT_ID}&permissions=${options.PERMISSIONS}` +
        `&redirect_uri=${encodeURIComponent(
            options.REDIRECT_URI
        )}&response_type=code` +
        `&scope=${options.SCOPES}&guild_id=${guild_id}&prompt=${
            options.PROMPT
        }&disable_guild_select=${options.GUILD_SELECT ? "true" : "false"}`
    );
};
