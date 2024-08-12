import { describe, expect, it } from "bun:test";
import { decodeToken } from "test-tools";
import {
  apiAddUser,
  apiLoginUser,
  randomEmail,
  randomPassword,
  randomUser,
  TestUserDBService,
} from "test-tools/users";
import {
  MSG_EMAIL_EXISTS,
  MSG_INVALID_EMAIL_OR_PASSWORD,
} from "types/routes/users";

describe("sign-up", () => {
  it("success", async () => {
    const email = randomEmail();
    const password = randomPassword();

    const { data, error } = await apiAddUser({ email, password });

    expect(error).toBeNull();
    expect(data?.base.success).toBe(true);

    expect(data?.data.token).not.toBeUndefined();
    const payload = decodeToken(data?.data.token as string);

    const userDB = await TestUserDBService.getUserByEmail(email);
    if (!userDB) {
      throw new Error("user not created");
    }

    expect(payload.email).toBe(userDB.email);
    expect(payload.userId).toBe(userDB.id);
    expect(payload.name).toBe(userDB.name);
  });

  it("duplicate email", async () => {
    const user = await randomUser();

    const password = randomPassword();

    const { data, error } = await apiAddUser({
      email: user.email,
      password,
    });

    expect(error).toBeNull();
    expect(data?.base.success).toBe(false);
    expect(data?.base.msg).toBe(MSG_EMAIL_EXISTS);
    expect(data?.data.token).toBe("");
  });
});

describe("sign-in", () => {
  it("success", async () => {
    const password = randomPassword();

    const user = await randomUser({ password });
    const { data, error } = await apiLoginUser({ email: user.email, password });

    expect(error).toBeNull();
    expect(data?.base.success).toBe(true);

    expect(data?.data.token).not.toBeUndefined();
    const payload = decodeToken(data?.data.token as string);

    expect(payload.email).toBe(user.email);
    expect(payload.userId).toBe(user.id);
    expect(payload.name).toBe(user.name);
  });

  it("wrong email", async () => {
    const email = randomEmail();
    const password = randomPassword();

    const { data, error } = await apiLoginUser({ email, password });

    expect(error).toBeNull();
    expect(data?.base.success).toBe(false);
    expect(data?.base.msg).toBe(MSG_INVALID_EMAIL_OR_PASSWORD);
    expect(data?.data.token).toBe("");
  });

  it("wrong password", async () => {
    const user = await randomUser();

    const password = randomPassword();

    const { data, error } = await apiLoginUser({
      email: user.email,
      password,
    });

    expect(error).toBeNull();
    expect(data?.base.success).toBe(false);
    expect(data?.base.msg).toBe(MSG_INVALID_EMAIL_OR_PASSWORD);
    expect(data?.data.token).toBe("");
  });
});
