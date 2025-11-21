"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_ORIGINS = exports.ENV = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default("4000"),
    DATABASE_URL: zod_1.z.string().refine((val) => val.startsWith("postgresql://"), {
        message: "DATABASE_URL must start with 'postgresql://'",
    }),
    JWT_SECRET: zod_1.z.string().min(10, "JWT_SECRET must be at aleast 10 characters"),
    ACCESS_TOKEN_SECRET: zod_1.z
        .string()
        .min(10, "ACCESS_TOKEN_SECRET must be at least 10"),
    REFRESH_TOKEN_SECRET: zod_1.z
        .string()
        .min(10, "REFRESH_TOKEN_SECRET must be at least 10"),
    // Multiple origins separated by comma
    CORS_ORIGINS: zod_1.z.string().default("http://localhost:3000"),
});
exports.ENV = envSchema.parse(process.env);
exports.ALLOWED_ORIGINS = exports.ENV.CORS_ORIGINS.split(",") || [];
