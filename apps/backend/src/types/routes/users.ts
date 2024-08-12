import { Static, t } from "elysia";
import { baseRespSchema } from ".";

export const SignReqSchema = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({
    minLength: 6,
    maxLength: 20,
  }),
});

export const SignRespSchema = t.Object({
  base: baseRespSchema,
  data: t.Object({
    token: t.String(),
    user: t.Object({
      id: t.String(),
      email: t.String(),
      name: t.String(),
      verified: t.Boolean(),
      createdAt: t.Date(),
      updatedAt: t.Date(),
    }),
  }),
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
