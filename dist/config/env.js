"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_ORIGINS = exports.ENV = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default("4000"),
    DATABASE_URL: zod_1.z.string().startsWith("postgresql://"),
    ACCESS_TOKEN_SECRET: zod_1.z.string().min(10),
    REFRESH_TOKEN_SECRET: zod_1.z.string().min(10),
    CORS_ORIGINS: zod_1.z.string().default("http://localhost:3000"),
});
exports.ENV = envSchema.parse(process.env);
exports.ALLOWED_ORIGINS = exports.ENV.CORS_ORIGINS.split(",") || [];
