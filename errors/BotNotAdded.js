class BotNotAdded extends Error {
    constructor(message) {
        super(message);
        this.name = "BotNotAdded";
    }
}

export default BotNotAdded;
