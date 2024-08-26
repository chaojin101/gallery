import { treaty } from "@elysiajs/eden";
import jwt from "jsonwebtoken";
import { app } from "../index";
import { JWTPayload } from "../types/routes/users";

export const backend = treaty(app);

export const decodeToken = (token: string) => {
  if (!token) {
    throw new Error("token not found");
  }

  const decoded = jwt.decode(token, { complete: true, json: true });
  return decoded?.payload as JWTPayload & jwt.Jwt;
};
