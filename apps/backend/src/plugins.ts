import jwt from "@elysiajs/jwt";
import { Value } from "@sinclair/typebox/value";
import Elysia from "elysia";
import { addGalleryRespBodySchema } from "./types/routes/galleries";
import { JWTPayloadSchema, MSG_UNAUTHORIZED } from "./types/routes/users";

export const JWTPlugin = jwt({
  name: "jwt",
  secret: process.env.JWT_SECRET!,
  schema: JWTPayloadSchema,
});

const bearerPlugin = new Elysia().derive(
  { as: "global" },
  async ({ headers }) => ({
    get bearer() {
      const authorization = headers["authorization"];
      if ((authorization as string)?.startsWith("Bearer "))
        return (authorization as string).slice("Bearer ".length);
    },
  })
);

export const authPlugin = new Elysia()
  .use(JWTPlugin)
  .use(bearerPlugin)
  .derive({ as: "scoped" }, async ({ jwt, bearer, error }) => {
    const resp = Value.Create(addGalleryRespBodySchema);

    const tokenPayload = await jwt.verify(bearer);

    if (!tokenPayload) {
      resp.base.msg = MSG_UNAUTHORIZED;

      throw error(401, resp);
    }

    return { tokenPayload };
  });
