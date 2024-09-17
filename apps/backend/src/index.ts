import { app } from "./app";
import { setupEnv } from "./util";

setupEnv();

app.listen(process.env.PORT!);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
