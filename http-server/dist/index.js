"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const TURN_SECRET = process.env.TURN_SECRET;
const TURN_SERVER = process.env.TURN_SERVER;
const TURN_PORT = process.env.TURN_PORT;
const REALM = process.env.TURN_REALM;
// Function to generate time-limited TURN credentials
function generateTurnCredentials(usernameTTL = 3600) {
    const timestamp = Math.floor(Date.now() / 1000) + usernameTTL; // Expiry time
    const username = `${timestamp}`; // Username = timestamp
    const hmac = crypto_1.default.createHmac("sha1", TURN_SECRET);
    hmac.update(username);
    const password = hmac.digest("base64"); // HMAC-SHA1 password
    return {
        username,
        credential: password,
        ttl: usernameTTL,
        servers: [
            {
                urls: `turn:${TURN_SERVER}:${TURN_PORT}`,
                username,
                credential: password,
            },
            {
                urls: `stun:${TURN_SERVER}:${TURN_PORT}`,
            },
        ],
    };
}
// API Route to Get TURN Credentials
app.get("/get-turn-credentials", (req, res) => {
    const credentials = generateTurnCredentials();
    res.json(credentials);
});
app.listen(PORT, () => {
    console.log(`TURN API running on http://localhost:${PORT}`);
});
