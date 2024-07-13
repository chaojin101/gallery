import { t } from "elysia";

export const BaseRespSchema = t.Object({
  success: t.Boolean(),
  msg: t.String(),
});
