import DatabaseClient from "./mongoose";

/**
 *
 * @param {Array<Object>} backups
 */
export const filterBackups = (backups) => {
    const filtered = [];
    for (let backup of backups) {
        const { guildID, name, createdTimestamp, iconURL, roles, bans } =
            backup;
        filtered.push({
            guildID,
            name,
            createdTimestamp,
            iconURL,
            rolesCount: roles.length,
            bansCount: bans.length,
        });
    }
    return filtered;
};

export const filterRestorableGuilds = async (guilds) => {
    const filtered = [];
    for (let guild of guilds) {
        const { id } = guild;
        const members = await DatabaseClient.members.find({ guild: id });
        filtered.push({
            id,
            verified: members.length,
            name: guild.name ? guild.name : "Unknown Server Name",
            iconURL: guild.iconURL
                ? guild.iconURL
                : "/default.png",
        });
    }
    return filtered;
};

/**
 *
 * @param {Array<Object>} guilds
 */
export const filterGuilds = (guilds) => {
    const filtered = [];
    for (let guild of guilds) {
        const { id } = guild;
        filtered.push(id);
    }
    return filtered;
};

/**
 *
 * @param {Array<Object>} members
 * @returns
 */
export const filterMembers = (members) => {
    const filtered = [];
    for (let member of members) {
        const { discordTag, discordId, avatar, guild } = member;
        filtered.push({ discordTag, discordId, avatar, guild });
    }
    return filtered;
};
