import { logger } from "@bogeychan/elysia-logger";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { collectionsRoute } from "./routes/collections";
import { galleriesRoute } from "./routes/galleries";
import { recordRoute } from "./routes/record";
import { usersRoute } from "./routes/users";

const myLogger = logger({
  transport: {
    target: "pino-pretty",
  },
  autoLogging: {
    ignore: () => {
      return process.env.NODE_ENV === "test" || true;
    },
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
  .use(recordRoute)
  .get("", ({}) => "Hello, world!");
