"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
// ✔ The token your frontend uses to access protected routes
// ✔ Sent with every request (headers / cookies)
// ✔ Contains the user ID (sub)
// ✔ Contains the user's admin status (isAdmin)
// ✔ Only valid for 15 minutes for security reasons
const createAccessToken = (payload) => jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
exports.createAccessToken = createAccessToken;
// ✔ Long-lived token (7 days) that allows the user to stay logged in
// ✔ Used ONLY to get a new access token
// ✔ Stored in HttpOnly cookies (safe from JS)
const createRefreshToken = (payload) => jsonwebtoken_1.default.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
exports.createRefreshToken = createRefreshToken;
