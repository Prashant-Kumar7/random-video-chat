"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTurnCredentials = void 0;
const crypto_1 = __importDefault(require("crypto"));
const secret = "439a421a16dffcbef4569596292415af2af008db25f0ce94923507aa66c82793"; // Replace with your actual secret
function generateTurnCredentials(ttl = 600) {
    const timestamp = Math.floor(Date.now() / 1000) + ttl;
    const username = `${timestamp}`;
    const hmac = crypto_1.default.createHmac("sha1", secret);
    hmac.update(username);
    const password = hmac.digest("base64");
    return { username, password };
}
exports.generateTurnCredentials = generateTurnCredentials;
// Example usage:
// const credentials = generateTurnCredentials();
// console.log(credentials);
