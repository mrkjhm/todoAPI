"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const requireAuth = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const payload = jsonwebtoken_1.default.verify(
      token,
      env_1.ENV.ACCESS_TOKEN_SECRET
    );
    // attach to request for later use
    req.user = { id: payload.sub, isAdmin: payload.isAdmin ?? false };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
exports.requireAuth = requireAuth;
