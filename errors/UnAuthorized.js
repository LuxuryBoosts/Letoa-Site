class UnAuthorized extends Error {
    constructor(message) {
        super(message);
        this.name = "UnAuthorized";
    }
}

export default UnAuthorized;
