"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenCookieOptions = exports.accessTokenCookieOptions = void 0;
/**
 * ACCESS TOKEN COOKIE
 * ---------------------
 * • Short-lived (15 minutes)
 * • Pang-check sa bawat request kung authenticated ang user
 * • HttpOnly para hindi manakaw ng JavaScript (XSS protection)
 * • SameSite at Secure para gumana sa cross-domain at HTTPS
 */
exports.accessTokenCookieOptions = {
    httpOnly: true,
    // 🔒 Hindi mababasa ng JavaScript (document.cookie)
    // Security: protects against XSS token theft
    secure: process.env.NODE_ENV === "production",
    // 🌍 PRODUCTION → HTTPS required
    // 🖥 DEVELOPMENT (localhost) → HTTP allowed
    // Needed para i-allow ng browser sa real deployments
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    // "none" → required kapag FRONTEND & BACKEND ay magkaibang URL/domain
    // "lax" → works sa localhost
    // Without "none", hindi mase-send ang cookies sa cross-site requests
    maxAge: 15 * 60 * 1000,
    // 🕒 15 minutes
    // Access token should expire fast for security
};
/**
 * REFRESH TOKEN COOKIE
 * ----------------------
 * • Long-lived (7 days)
 * • Pag expired ang access token, backend will auto-refresh using this
 * • Also HttpOnly for security
 * • SameSite + Secure for cross-site cookies
 */
exports.refreshTokenCookieOptions = {
    httpOnly: true,
    // 🔐 Prevents refresh token from being stolen via JS
    secure: process.env.NODE_ENV === "production",
    // 🔐 Must use HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    // Required for cross-site cookie usage (Frontend → Backend)
    maxAge: 7 * 24 * 60 * 60 * 1000,
    // 🕒 7 days
    // User stays logged in for a week without re-login
};
