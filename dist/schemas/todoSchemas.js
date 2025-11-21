"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTodoSchema = void 0;
const zod_1 = require("zod");
exports.createTodoSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1, "Title is required"),
    isCompleted: zod_1.z.boolean().default(false),
});
