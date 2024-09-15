import { Static, t } from "elysia";
import jwt from "jsonwebtoken";

export const JWTPayloadSchema = t.Object({
  userId: t.String(),
  email: t.String(),
  name: t.String(),
});
export type JWTPayload = Static<typeof JWTPayloadSchema>;

export class JWT {
  static verify(options: { token: string }) {
    const { token } = options;

    return jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
  }
}
