import jwt from "@elysiajs/jwt";
import { MSG_UNAUTHENTICATED } from "@gallery/common";
import { Value } from "@sinclair/typebox/value";
import Elysia from "elysia";
import { baseRespSchema } from "./types/routes";
import { JWTPayloadSchema } from "./types/routes/users";

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
      const resp = Value.Create(baseRespSchema);
      resp.success = false;
      resp.msg = MSG_UNAUTHENTICATED;
      throw error(200, { base: resp });
    }

    return { tokenPayload };
  });
