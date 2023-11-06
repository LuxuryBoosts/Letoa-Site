const CryptoJS = require("crypto-js");

export function encrypt(token) {
    return CryptoJS.AES.encrypt(token, process.env.SECRET_PASS);
}

export function decrypt(token) {
    return CryptoJS.AES.decrypt(token, process.env.SECRET_PASS);
}
