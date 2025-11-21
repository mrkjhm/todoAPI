import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

// ✔ The token your frontend uses to access protected routes
// ✔ Sent with every request (headers / cookies)
// ✔ Contains the user ID (sub)
// ✔ Contains the user's admin status (isAdmin)
// ✔ Only valid for 15 minutes for security reasons
export const createAccessToken = (payload: { sub: string; isAdmin: boolean }) =>
  jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

// ✔ Long-lived token (7 days) that allows the user to stay logged in
// ✔ Used ONLY to get a new access token
// ✔ Stored in HttpOnly cookies (safe from JS)
export const createRefreshToken = (payload: { sub: string }) =>
  jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
