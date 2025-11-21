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
const isProduction = process.env.NODE_ENV === "production";
exports.accessTokenCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
};
exports.refreshTokenCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
