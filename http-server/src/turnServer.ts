import Turn from "node-turn";
import dotenv from "dotenv";

dotenv.config();

const TURN_PORT = process.env.TURN_PORT || 3478;
const REALM = process.env.REALM || "webrtc";

const server = new Turn({
    listeningPort: Number(TURN_PORT),
    realm: REALM,
    authMech: "long-term", // Long-term authentication
    credentials: {} // Initially empty; will be populated dynamically
});

server.start();

console.log(`TURN server running on port ${TURN_PORT}`);

// Function to dynamically add users
export function addTurnUser(username: string, password: string) {
    server.staticCredentials[username] = password;
    console.log(`Added TURN user: ${username}`);
}
