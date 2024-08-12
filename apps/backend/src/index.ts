import { logger } from "@bogeychan/elysia-logger";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { collectionsRoute } from "./routes/collections";
import { galleriesRoute } from "./routes/galleries";
import { usersRoute } from "./routes/users";

const myLogger = logger({
  transport: {
    target: "pino-pretty",
  },
});

export const app = new Elysia({ prefix: "/api" })
  .onAfterHandle(({ set }) => {
    set.headers["Access-Control-Allow-Headers"] = "*";
  })
  .use(cors())
  .use(myLogger)
  .use(swagger())
  .use(usersRoute)
  .use(galleriesRoute)
  .use(collectionsRoute)
  .get("/", ({}) => "Hello, world!")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
