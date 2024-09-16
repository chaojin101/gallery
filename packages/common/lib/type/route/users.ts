import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@gallery/common";
import { type Static, t } from "elysia";
import { baseRespSchema } from ".";

const emailSchema = t.String({ format: "email" });
const passwordSchema = t.String({
  minLength: PASSWORD_MIN_LENGTH,
  maxLength: PASSWORD_MAX_LENGTH,
});
const tokenSchema = t.String();
const userSchema = t.Object({
  id: t.String(),
  email: t.String(),
  name: t.String(),
  verified: t.Boolean(),
  createdAt: t.Number(),
  updatedAt: t.Number(),
});

export const SignUpReqBodySchema = t.Object({
  email: emailSchema,
  password: passwordSchema,
});

export const SignUpRespBodySchema = t.Object({
  base: baseRespSchema,
  data: t.Object({
    token: tokenSchema,
    user: userSchema,
  }),
});

export const SignInReqBodySchema = t.Object({
  email: emailSchema,
  password: passwordSchema,
});

export const SignInRespBodySchema = t.Object({
  base: baseRespSchema,
  data: t.Object({
    token: tokenSchema,
    user: userSchema,
  }),
});

export const JWTPayloadSchema = t.Object({
  userId: t.String(),
  email: t.String(),
  name: t.String(),
});
export type JWTPayload = Static<typeof JWTPayloadSchema>;
