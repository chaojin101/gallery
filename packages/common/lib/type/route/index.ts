import { t } from "elysia";

export const baseRespSchema = t.Object({
  success: t.Boolean(),
  msg: t.String(),
});
