import { t } from "elysia";

export const authHeaderSchema = t.Optional(
  t.Object({
    Authorization: t.Optional(t.String()),
  })
);
