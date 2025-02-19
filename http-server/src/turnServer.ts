import crypto from "crypto";
const secret = "439a421a16dffcbef4569596292415af2af008db25f0ce94923507aa66c82793"; // Replace with your actual secret

export function generateTurnCredentials(ttl = 600) {
  const timestamp = Math.floor(Date.now() / 1000) + ttl;
  const username = `${timestamp}`;
  const hmac = crypto.createHmac("sha1", secret);
  hmac.update(username);
  const password = hmac.digest("base64");
  return { username, password };
}

// Example usage:
// const credentials = generateTurnCredentials();
// console.log(credentials);
