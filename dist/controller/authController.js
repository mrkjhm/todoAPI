"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.updateUser = exports.refreshToken = exports.deleteUser = exports.getUserById = exports.logoutUser = exports.login = exports.signup = exports.getAllUser = void 0;
const bcrypt_1 = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("../prisma/client");
const jwt_1 = require("../utils/jwt");
const cookies_1 = require("../utils/cookies");
const env_1 = require("../config/env");
const getAllUser = async (_req, res, next) => {
    try {
        const users = await client_1.prisma.user.findMany();
        res.status(200).json({
            message: "Get all users",
            users,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUser = getAllUser;
const signup = async (req, res, next) => {
    try {
        // Summary
        // 1. declare mo muna yung form fields need
        // 2. Check mo kung meron existing user
        // 3. Create user
        // 4. return message na successful ang creation
        // 5. catch error
        const { name, email, password } = req.body;
        const existingUser = await client_1.prisma.user.findFirst({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exist!" });
        }
        const user = await client_1.prisma.user.create({
            data: {
                name,
                email,
                password: (0, bcrypt_1.hashSync)(password, 10),
            },
        });
        return res.status(201).json({
            message: "User signup successfully",
            user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.signup = signup;
const login = async (req, res, next) => {
    try {
        // Summary
        // 1. Validate user credentials
        // 2. Compare passwords
        // 3. Generate access & refresh tokens
        // 4. Store both tokens in secure HttpOnly cookies
        // 5. Return user profile (without password)
        // 6. Handle errors
        const { email, password } = req.body;
        const user = await client_1.prisma.user.findFirst({ where: { email } });
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }
        // Compare password
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // create tokens
        const accessToken = (0, jwt_1.createAccessToken)({
            sub: String(user.id),
            isAdmin: Boolean(user.isAdmin),
        });
        const refreshToken = (0, jwt_1.createRefreshToken)({
            sub: String(user.id),
        });
        res.cookie("accessToken", accessToken, cookies_1.accessTokenCookieOptions);
        res.cookie("refreshToken", refreshToken, cookies_1.refreshTokenCookieOptions);
        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        return res.status(200).json({
            message: "Login successful",
            user: safeUser,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const logoutUser = async (req, res, next) => {
    res.clearCookie("accessToken", cookies_1.accessTokenCookieOptions);
    res.clearCookie("refreshToken", cookies_1.refreshTokenCookieOptions);
    res.json({ message: "Logget out successfully" });
};
exports.logoutUser = logoutUser;
const getUserById = async (req, res, next) => {
    try {
        // Summary
        // 1. Extract the user ID from URL params
        // 2. Validate that it is a valid number
        // 3. Query the user (selecting only safe fields)
        // 4. Return the user or 404 if not found
        // 5. Handle errors
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const user = await client_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserById = getUserById;
const deleteUser = async (req, res, next) => {
    try {
        // Summary
        // 1. Extract the user ID from the URL parameters
        // 2. Validate that the ID is a valid number
        // 3. Check if the user exists in the database
        // 4. Delete the user using Prisma
        // 5. Return a success response with basic user info
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const user = await client_1.prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await client_1.prisma.user.delete({ where: { id } });
        return res.status(200).json({
            message: "User deleted successfully",
            deleteUser: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
const refreshToken = async (req, res, next) => {
    try {
        // Summary
        // 1. Read refresh token from cookies
        // 2. Verify if the token is valid and not expired
        // 3. Decode the user ID (payload.sub)
        // 4. Look up the user in the database
        // 5. Generate new access & refresh tokens
        // 6. Store them in cookies
        // 7. Return the new access token
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json({ message: "Missing refresh token" });
        }
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(token, env_1.ENV.REFRESH_TOKEN_SECRET);
        }
        catch (error) {
            return res
                .status(401)
                .json({ message: "Invalid or expired refresh token" });
        }
        const user = await client_1.prisma.user.findUnique({
            where: { id: Number(payload.sub) },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const newAccessToken = (0, jwt_1.createAccessToken)({
            sub: String(user.id),
            isAdmin: Boolean(user.isAdmin),
        });
        const newRefreshToken = (0, jwt_1.createRefreshToken)({
            sub: String(user.id),
        });
        res.cookie("accessToken", newAccessToken, cookies_1.accessTokenCookieOptions);
        res.cookie("refreshToken", newRefreshToken, cookies_1.refreshTokenCookieOptions);
        return res.json({
            message: "Tokens refreshed",
            accessToken: newAccessToken,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
const updateUser = async (req, res, next) => {
    try {
        // 1. Extract fields
        const { name, email, password } = req.body;
        const id = Number(req.params.id);
        // 2. Validate ID
        if (!id) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        // 3. Check if user exists
        const user = await client_1.prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // 4. Check if email already exists (optional)
        if (email && email !== user.email) {
            const emailExist = await client_1.prisma.user.findUnique({ where: { email } });
            if (emailExist) {
                return res.status(409).json({ message: "Email already exists" });
            }
        }
        // 5. Prepare updated data
        const updatedData = {};
        if (name)
            updatedData.name = name;
        if (email)
            updatedData.email = email;
        if (password)
            updatedData.password = bcrypt_1.default.hashSync(password, 10);
        // 6. Update user
        const updatedUser = await client_1.prisma.user.update({
            where: { id },
            data: updatedData,
        });
        // 7. Return successful response
        return res.status(200).json({
            message: "User updated successfully",
            updatedUser: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
const getProfile = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const id = Number(req.user.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const user = await client_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
