import { treaty } from "@elysiajs/eden";
import { app } from "index";
import jwt from "jsonwebtoken";
import { JWTPayload } from "types/routes/users";

export const backend = treaty(app);

export const decodeToken = (token: string | undefined) => {
  if (!token) {
    throw new Error("token not found");
  }

  const decoded = jwt.decode(token, { complete: true, json: true });
  return decoded?.payload as JWTPayload & jwt.Jwt;
};
