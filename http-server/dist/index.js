"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTurnCredentials = void 0;
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// import { addTurnUser } from "./turnServer"; // Import function from TURN server
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const TURN_SECRET = process.env.TURN_SECRET;
const TURN_SERVER = process.env.TURN_SERVER;
const TURN_PORT = process.env.TURN_PORT;
const REALM = process.env.REALM;
// Function to generate TURN credentials
const secret = "439a421a16dffcbef4569596292415af2af008db25f0ce94923507aa66c82793"; // Replace with your actual secret
app.use(express_1.default.json());
app.use((0, cors_1.default)());
function generateTurnCredentials(ttl = 600) {
    const timestamp = Math.floor(Date.now() / 1000) + ttl;
    const username = `${timestamp}`;
    const hmac = crypto_1.default.createHmac("sha1", secret);
    hmac.update(username);
    const password = hmac.digest("base64");
    return { username, password };
}
exports.generateTurnCredentials = generateTurnCredentials;
// API Endpoint to Fetch TURN Credentials
app.get("/get-turn-credentials", (req, res) => {
    const credentials = generateTurnCredentials();
    console.log("stun/turn server was hit");
    res.json(credentials);
});
app.listen(PORT, () => {
    console.log(`TURN API running on http://localhost:${PORT}`);
});
