import { Value } from "@sinclair/typebox/value";
import Elysia from "elysia";
import { JWTPlugin } from "../plugins";
import { UserService } from "../service/user";
import {
  MSG_EMAIL_EXISTS,
  MSG_INVALID_EMAIL_OR_PASSWORD,
  SignReqSchema,
  SignRespSchema,
} from "../types/routes/users";

export const usersRoute = new Elysia({ prefix: "/v1/users" })
  .use(JWTPlugin)
  .post(
    "/sign-up",
    async ({ body, jwt }) => {
      const resp = Value.Create(SignRespSchema);

      const { email, password } = body;

      if (await UserService.isEmailTaken(email)) {
        resp.base.msg = MSG_EMAIL_EXISTS;
        return resp;
      }

      const hashedPassword = await UserService.hashPassword(password);

      const user = await UserService.addUser({ email, hashedPassword });

      const token = await jwt.sign({
        email: user.email,
        userId: user.id,
        name: user.name,
      });

      resp.base.success = true;
      resp.data.token = token;

      return resp;
    },
    {
      body: SignReqSchema,
      response: SignRespSchema,
    }
  )
  .post(
    "/sign-in",
    async ({ body, jwt }) => {
      const { email, password } = body;
      console.log(body);

      const resp = Value.Create(SignRespSchema);

      const user = await UserService.getUserByEmail(email);
      if (!user) {
        resp.base.msg = MSG_INVALID_EMAIL_OR_PASSWORD;
        return resp;
      }

      if (!(await UserService.comparePassword(password, user.hashedPassword))) {
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

      return resp;
    },
    {
      body: SignReqSchema,
      response: SignRespSchema,
    }
  );
