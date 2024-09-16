import { t, type Static } from "elysia";
import jwt from "jsonwebtoken";

export const JWTPayloadSchema = t.Object({
  userId: t.String(),
  email: t.String(),
  name: t.String(),
});
export type JWTPayload = Static<typeof JWTPayloadSchema>;

export class JWT {
  static decode(options: { token: string }) {
    const { token } = options;

    const decoded = jwt.decode(token, { complete: true, json: true });
    return decoded?.payload as JWTPayload & jwt.Jwt;
  }

  static verify(options: { token: string; secret: string }) {
    const { token, secret } = options;

    return jwt.verify(token, secret) as JWTPayload;
  }
}
