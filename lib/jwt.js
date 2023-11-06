const jwt = require("jsonwebtoken");

module.exports.convertJWT = (text) => {
    try {
        const t = jwt.verify(text, process.env.JWT_SECRET);
        return t;
    } catch (e) {
        return null;
    }
};

module.exports.convertJSON = (text) => {
    return jwt.sign(text, process.env.JWT_SECRET);
};
