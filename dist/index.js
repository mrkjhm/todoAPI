"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
require("dotenv/config");
const client_1 = require("./prisma/client");
const authRoute_1 = __importDefault(require("./route/authRoute"));
const todoRoute_1 = __importDefault(require("./route/todoRoute"));
const projectRoute_1 = __importDefault(require("./route/projectRoute"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
const corsOptions = {
    origin: env_1.ALLOWED_ORIGINS,
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get("/", async (_req, res) => {
    res.send("Hello TypeScript + Express!");
});
const PORT = env_1.ENV.PORT;
app.use("/api/auth", authRoute_1.default);
app.use("/api/todos", todoRoute_1.default);
app.use("/api/projects", projectRoute_1.default);
app.use(errorHandler_1.errorHandler);
app.listen(PORT, async () => {
    await client_1.prisma.$connect();
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Prisma connected to Neon PostgressSQL successfully`);
});
