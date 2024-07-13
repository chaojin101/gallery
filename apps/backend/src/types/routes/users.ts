import { Static, t } from "elysia";
import { BaseRespSchema } from ".";

export const SignReqSchema = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({
    minLength: 6,
    maxLength: 20,
  }),
});

export const SignRespSchema = t.Object({
  base: BaseRespSchema,
  token: t.String(),
});

export const JWTPayloadSchema = t.Object({
  userId: t.String(),
  email: t.String(),
  name: t.String(),
});
export type JWTPayload = Static<typeof JWTPayloadSchema>;

export const authHeaderSchema = t.Object({
  authorization: t.String(),
});

export const MSG_EMAIL_EXISTS = "Email already exists";
export const MSG_INVALID_EMAIL_OR_PASSWORD = "Invalid email or password";
export const MSG_UNAUTHORIZED = "Unauthorized";
