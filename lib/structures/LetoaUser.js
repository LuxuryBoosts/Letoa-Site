function LetoaUser(user) {
    /**
     * The username they chose when registering
     * @type {?string}
     */
    this.username = user.username;

    /**
     * The account ID generated when the account was registered
     * @type {?string}
     */
    this.accountID = user.accountID;

    /**
     * The discord account they have linked.
     * @type {?string}
     */
    this.discordId = user.discordId;

    /**
     * The email the user used to create their account.
     * @type {?string}
     */
    this.email = user.email;

    /**
     * If the user is banned from using the service.
     * @type {boolean}
     */
    this.banned = user.banned ?? false;

    /**
     * Indicates what premium plan they own.
     * @type {number}
     */
    this.premiumLevel = user.premiumLevel ?? 0;

    /**
     * When the users premium expires
     * @type {?number}
     */
    this.premiumExpire = user.premiumExpire ?? null;

    /**
     * The authentication token created at user generation
     * @type {string}
     */
    this.token = user.token;

    /**
     * The password the user used but hashed.
     * @type {String}
     */
    this.password = user.password ?? null;

    /**
     * @type {Array}
     */
    this.previousLinkedAccounts = user.previousLinkedAccounts ?? [];
}

module.exports = LetoaUser;
