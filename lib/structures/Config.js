function ConfigStructure(data) {
    /**
     * @type {string}
     */
    this.id = data.id;

    /**
     * @type {?string}
     */
    this.verificationRole = data.verificationRole ?? null;

    /**
     * @type {?string}
     */
    this.loggingChannel = data.loggingChannel ?? null;

    /**
     * @type {?string}
     */
    this.customDomain = data.customDomain ?? null;

    /**
     * @type {?number}
     */
    this.backupInterval = data.backupInterval ?? null;

    /**
     * @type {boolean}
     */
    this.backupAutomatically = data.backupAutomatically ?? false;

    /**
     * @type {?string}
     */
    this.customColour = data.customColour ?? null;

    /**
     * @type {?string}
     */
    this.redirectLink = data.redirectLink ?? null;
}

module.exports = ConfigStructure;
