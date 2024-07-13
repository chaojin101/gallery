import { logger } from "@bogeychan/elysia-logger";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { galleriesRoute } from "routes/galleries";
import { usersRoute } from "./routes/users";

const myLogger = logger({
  transport: {
    target: "pino-pretty",
  },
});

export const app = new Elysia({ prefix: "/api" })
  .use(myLogger)
  .use(swagger())
  .use(usersRoute)
  .use(galleriesRoute)
  .get("/", ({}) => "Hello, world!")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
