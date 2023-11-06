/**
 *
 * @param {Array<Record<string, string | number| object>} guildRoles
 * @param {Array<string} userRoles
 */
export const calculatePermissions = (guildRoles, userRoles) => {
    let d = false;
    for (let role of guildRoles) {
        if (
            userRoles.includes(role.id) &&
            (parseInt(role.permissions) & 0x08) === 0x0000000008
        )
            d = true;
    }
    return d;
};
