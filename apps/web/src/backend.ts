import { treaty } from "@elysiajs/eden";
import { type App } from "@gallery/backend";

export const backend = treaty<App>("localhost:3000");

async function signUp() {
  const response = await backend.api.v1.users["sign-up"].post({
    email: "string",
    password: "string",
  });
}
