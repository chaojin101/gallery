import Elysia from "elysia";

export const recordRoute = new Elysia({ prefix: "/v1/record" }).post(
  "",
  async () => {
    console.log("Record created");
    return { message: "Record created successfully" };
  }
);
