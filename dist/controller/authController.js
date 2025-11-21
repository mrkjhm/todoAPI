"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = exports.getAllUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("../prisma/client");
const bcrypt_2 = require("bcrypt");
const jwt_1 = require("../utils/jwt");
const cookies_1 = require("../utils/cookies");
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
        const { name, email, password } = req.body;
        const existingUser = await client_1.prisma.user.findFirst({ where: { email } });
        if (existingUser) {
            return res.status(409).send({ message: "Email already exist!" });
        }
        const user = await client_1.prisma.user.create({
            data: {
                name,
                email,
                password: (0, bcrypt_2.hashSync)(password, 10),
            },
        });
        return res.status(201).send({
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
        const { email, password } = req.body;
        const user = await client_1.prisma.user.findFirst({ where: { email } });
        if (!user) {
            return res.send({
                message: "Invalid credentials.",
            });
        }
        // Compare password
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: "Invalid credentials" });
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
