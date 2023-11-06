class VerificationError extends Error {
    constructor(type, message) {
        super(message);
        this.name = type;
    }
}

export default VerificationError;
