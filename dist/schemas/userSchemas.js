"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is requried"),
    email: zod_1.z.email("Invalid email format"),
    password: zod_1.z.string().min(8, "Password must be atleast 8 characters"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.updateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    email: zod_1.z.email().optional(),
    password: zod_1.z.string().min(8).optional(),
});
