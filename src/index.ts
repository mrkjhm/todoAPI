import express, { Express, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";

import { ALLOWED_ORIGINS, ENV } from "./config/env";
import "dotenv/config";
import { prisma } from "./prisma/client";
import authRoutes from "./route/authRoute";
import todoRoutes from "./route/todoRoute";
import projectRoutes from "./route/projectRoute";
import { errorHandler } from "./middleware/errorHandler";

const app: Express = express();

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // allow mobile apps / postman / server-side requests
    if (!origin) return callback(null, true);

    // allow exact domains from .env
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    // allow all Vercel deployments (prod + preview)
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    // else block
    callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
};



app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (_req: Request, res: Response) => {
  res.send("Hello TypeScript + Express!");
});

const PORT = ENV.PORT;
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/projects", projectRoutes);

app.use(errorHandler);

app.listen(PORT, async () => {
  await prisma.$connect();
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Prisma connected to Neon PostgressSQL successfully`);
});
