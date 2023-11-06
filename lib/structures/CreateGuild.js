function CreateGuild(data) {
    /**
     * @type {string}
     */
    this.name = user.data ?? "Restored Server";

    /**
     * @type {array}
     */
    this.channels = data.channels ?? [];

    /**
     * @type {array}
     */
    this.roles = data.roles ?? [];

    /**
     * @type {?number}
     */
    this.afk_channel_id = data.afk_channel_id ?? undefined;

    /**
     * @type {?number}
     */
    this.afk_timeout = data.afk_timeout ?? undefined;

    /**
     * @type {?number}
     */
    this.system_channel_id = data.system_channel_id ?? undefined;

    /**
     * @description
     * ```js
     * SUPPRESS_JOIN_NOTIFICATIONS: 1 << 0
     * SUPPRESS_PREMIUM_SUBSCRIPTIONS: 1 << 1
     * SUPPRESS_GUILD_REMINDER_NOTIFICATIONS: 1 << 2
     * SUPPRESS_JOIN_NOTIFICATION_REPLIES: 1 << 3
     *
     * ```
     * @type {?number}
     */
    this.system_channel_flags = data.system_channel_flags ?? undefined;

    /**
     * @description
     * ```js
     * DISABLED: 0
     * MEMBERS_WITHOUT_ROLES: 1
     * ALL_MEMBERS: 2
     * ```
     * @type {?number}
     */
    this.explicit_content_filter = data.explicit_content_filter ?? 0;

    /**
     * @description
     * ```js
     *  NONE:       0.      unrestricted
     *  LOW:        1.      must have verified email on account
     *  MEDIUM:     2.      must be registered on Discord for longer than 5 minutes
     *  HIGH:       3.      must be a member of the server for longer than 10 minutes
     *  VERY_HIGH:  4.      must have a verified phone number
     * ```
     * @type {?number}
     */
    this.verification_level = data.verification_level ?? 0;
}

module.exports = CreateGuild;
