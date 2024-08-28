import { app } from "./index";

type App = typeof app;

export { SignReqSchema } from "./types/routes/users";
export type { JWTPayload } from "./types/routes/users";

export type { App };
