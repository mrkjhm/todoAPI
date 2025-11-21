// VERY IMPORTANT → use "express" NOT "express-serve-static-core"
import "express";

declare module "express" {
  interface Request {
    user?: {
      id: string | Number;
      isAdmin: boolean;
    };
  }
}
