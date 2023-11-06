function PartialMember(member) {
    /**
     * @description The discord id of the user
     * @type {string}
     */
    this.discordId = member.discordId;

    /**
     * @description The guild the user belongs to.
     * @type {string}
     */
    this.guild = member.guild;

    /**
     * @description When the access token expires.
     * @type {?number}
     */
    this.expires = member.expires ?? null;

    /**
     * @description Encrypted refresh token of the user
     * @type {?string}
     */
    this.refreshToken = member.refreshToken;

    /**
     * @description Encrypted access token of the user
     * @type {?string}
     */
    this.accessToken = member.accessToken;
}

module.exports.PartialMember;
