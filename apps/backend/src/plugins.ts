import jwt from "@elysiajs/jwt";
import { MSG_UNAUTHENTICATED } from "@gallery/common";
import { Value } from "@sinclair/typebox/value";
import Elysia from "elysia";
import { addGalleryRespBodySchema } from "types/routes/galleries";
import { JWTPayloadSchema } from "./types/routes/users";

export const JWTPlugin = jwt({
  name: "jwt",
  secret: process.env.JWT_SECRET,
  schema: JWTPayloadSchema,
});

const bearerPlugin = new Elysia().derive(
  { as: "global" },
  async ({ headers }) => ({
    get bearer() {
      const authorization = headers["authorization"];
      if (!authorization || !authorization.startsWith("Bearer ")) {
        return "";
      }
      return authorization.slice("Bearer ".length);
    },
  })
);

export const authPlugin = new Elysia()
  .use(JWTPlugin)
  .use(bearerPlugin)
  .derive({ as: "scoped" }, async ({ jwt, bearer, error }) => {
    const tokenPayload = await jwt.verify(bearer);

    if (!tokenPayload) {
      const resp = Value.Create(addGalleryRespBodySchema);
      resp.base.success = false;
      resp.base.msg = MSG_UNAUTHENTICATED;
      throw error(200, resp);
    }

    return { tokenPayload };
  });
