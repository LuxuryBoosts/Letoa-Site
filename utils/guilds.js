/**
 *
 * @param {string} access_token
 */
export const updateGuilds = (access_token) => {};

/**
 *
 * @param {Array<Object>} guilds
 */
export const filterGuilds = (guilds) => {
    const results = [];
    guilds.map((guild, _) => {
        if ((guild.permissions & 0x08) === 0x0000000008) {
            results.push(guild);
        }
    });
    return results;
};
