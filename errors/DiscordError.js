class DiscordError extends Error {
    constructor(message) {
        super(message);
        this.name = "DiscordError";
    }
}

export default DiscordError;
