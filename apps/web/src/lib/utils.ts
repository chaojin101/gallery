import { JWTPayload } from "@gallery/backend";
import { type ClassValue, clsx } from "clsx";
import jwt from "jsonwebtoken";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const decodeToken = (token: string) => {
  const decoded = jwt.decode(token, { complete: true, json: true });
  return decoded?.payload as JWTPayload & jwt.Jwt;
};

export const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
