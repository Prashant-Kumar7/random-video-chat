import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import { addTurnUser } from "./turnServer"; // Import function from TURN server

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const TURN_SECRET = process.env.TURN_SECRET!;
const TURN_SERVER = process.env.TURN_SERVER!;
const TURN_PORT = process.env.TURN_PORT!;
const REALM = process.env.REALM!;

// Function to generate TURN credentials
function generateTurnCredentials(usernameTTL: number = 3600) {
    const timestamp = Math.floor(Date.now() / 1000) + usernameTTL;
    const username = `${timestamp}`;
    const hmac = crypto.createHmac("sha1", TURN_SECRET);
    hmac.update(username);
    const password = hmac.digest("base64");

    // Dynamically add the generated user to the TURN server
    addTurnUser(username, password);

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

// API Endpoint to Fetch TURN Credentials
app.get("/get-turn-credentials", (req, res) => {
    const credentials = generateTurnCredentials();
    res.json(credentials);
});

app.listen(PORT, () => {
    console.log(`TURN API running on http://localhost:${PORT}`);
});
