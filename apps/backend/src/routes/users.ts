import {
  MSG_EMAIL_EXISTS,
  MSG_INVALID_EMAIL_OR_PASSWORD,
} from "@gallery/common";
import { Value } from "@sinclair/typebox/value";
import Elysia from "elysia";
import { addUserToDB, getUserByEmailFromDB } from "../db/sqls/user";
import { Password } from "../libs/password";
import { JWTPlugin } from "../plugins";
import {
  SignInReqBodySchema,
  SignInRespBodySchema,
  SignUpReqBodySchema,
  SignUpRespBodySchema,
} from "../types/routes/users";

export const usersRoute = new Elysia({ prefix: "/v1/users" })
  .use(JWTPlugin)
  .post(
    "/sign-up",
    async ({ body, jwt }) => {
      const resp = Value.Create(SignUpRespBodySchema);

      const { email, password } = body;

      let user = await getUserByEmailFromDB({ email });
      if (user !== undefined) {
        resp.base.msg = MSG_EMAIL_EXISTS;
        return resp;
      }

      const hashedPassword = await Password.hash({ password });

      user = await addUserToDB({ email, hashedPassword });

      const token = await jwt.sign({
        email: user.email,
        userId: user.id,
        name: user.name,
      });

      resp.base.success = true;
      resp.data.token = token;

      resp.data.user.id = user.id;
      resp.data.user.email = user.email;
      resp.data.user.name = user.name;
      resp.data.user.verified = user.verified;
      resp.data.user.createdAt = user.createdAt.getTime();
      resp.data.user.updatedAt = user.updatedAt.getTime();

      return resp;
    },
    {
      body: SignUpReqBodySchema,
      response: SignUpRespBodySchema,
    }
  )
  .post(
    "/sign-in",
    async ({ body, jwt }) => {
      const { email, password } = body;

      const resp = Value.Create(SignInRespBodySchema);

      const user = await getUserByEmailFromDB({ email });
      if (!user) {
        resp.base.msg = MSG_INVALID_EMAIL_OR_PASSWORD;
        return resp;
      }

      if (
        !(await Password.compare({
          password,
          hashedPassword: user.hashedPassword,
        }))
      ) {
        resp.base.msg = MSG_INVALID_EMAIL_OR_PASSWORD;
        return resp;
      }

      const token = await jwt.sign({
        userId: user.id,
        email: user.email,
        name: user.name,
      });

      resp.base.success = true;

      resp.data.token = token;
      resp.data.user.id = user.id;
      resp.data.user.email = user.email;
      resp.data.user.name = user.name;
      resp.data.user.verified = user.verified;
      resp.data.user.createdAt = user.createdAt.getTime();
      resp.data.user.updatedAt = user.updatedAt.getTime();

      return resp;
    },
    {
      body: SignInReqBodySchema,
      response: SignInRespBodySchema,
    }
  );
