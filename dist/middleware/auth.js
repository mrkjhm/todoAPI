"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const requireAuth = (req, res, next) => {
    // 🔍 1. Get access token from HttpOnly cookies
    // If the cookie is missing → user is not authenticated
    const token = req.cookies?.accessToken;
    if (!token) {
        // 🔥 401 = Unauthorized (Authentication required)
        // This message indicates their login session has ended
        return res
            .status(401)
            .json({ message: "Session expired. Please login again." });
    }
    try {
        // 🔐 2. Verify JWT using the ACCESS_TOKEN_SECRET
        // If token is valid → we extract its payload
        const payload = jsonwebtoken_1.default.verify(token, env_1.ENV.ACCESS_TOKEN_SECRET);
        // 👤 3. Attach authenticated user info to the request object
        // This allows any route/controller to access req.user
        req.user = {
            id: payload.sub,
            isAdmin: payload.isAdmin ?? false, // default to false if missing
        };
        // ✅ 4. Continue to next middleware or controller
        next();
    }
    catch (error) {
        // ⚠️ Token verification failed (expired, tampered, wrong secret)
        console.error("JWT error:", error);
        // 401 again because the token is invalid or expired
        return res.status(401).json({ message: "Invalid token. Access denied." });
    }
};
exports.requireAuth = requireAuth;
