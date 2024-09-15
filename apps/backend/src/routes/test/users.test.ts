import {
  MSG_EMAIL_EXISTS,
  MSG_INVALID_EMAIL_OR_PASSWORD,
} from "@gallery/common";
import { describe, expect, it } from "bun:test";
import { getUserByEmailFromDB } from "db/sqls/user";
import { JWT } from "libs/jwt";
import {
  apiSignIn,
  apiSignUp,
  randomEmail,
  randomPassword,
  randomUser,
} from "test-tools/users";

describe("POST /api/v1/users/sign-up", () => {
  it("success", async () => {
    const email = randomEmail();
    const password = randomPassword();

    const { data, error } = await apiSignUp({ email, password });
    expect(error).toBeNull();

    if (!data) {
      throw new Error("sign-up failed: empty data");
    }

    const userDB = await getUserByEmailFromDB({ email });
    if (!userDB) {
      throw new Error("sign-up failed: user not in db");
    }

    expect(data.base.success).toBe(true);
    expect(data.base.msg).toEqual("");

    const payload = JWT.verify({ token: data.data.token });
    expect(payload.email).toBe(userDB.email);
    expect(payload.userId).toBe(userDB.id);
    expect(payload.name).toBe(userDB.name);

    expect(data.data.user.id).toBe(userDB.id);
    expect(data.data.user.email).toBe(userDB.email);
    expect(data.data.user.name).toBe(userDB.name);
    expect(data.data.user.verified).toBe(userDB.verified);
    expect(data.data.user.createdAt).toBe(userDB.createdAt.getTime());
    expect(data.data.user.updatedAt).toBe(userDB.updatedAt.getTime());
  });

  it("duplicate email", async () => {
    const user = await randomUser();

    const { data, error } = await apiSignUp({
      email: user.email,
    });
    expect(error).toBeNull();

    if (!data) {
      throw new Error("sign-up failed: Failed to call apiSignUp");
    }

    expect(data.base.success).toBe(false);
    expect(data.base.msg).toBe(MSG_EMAIL_EXISTS);

    expect(data.data.token).toBe("");
    expect(data.data.user.id).toBe("");
    expect(data.data.user.email).toBe("");
    expect(data.data.user.name).toBe("");
    expect(data.data.user.verified).toBe(false);
    expect(data.data.user.createdAt).toBe(0);
    expect(data.data.user.updatedAt).toBe(0);
  });
});

describe("POST /api/v1/users/sign-in", () => {
  it("success", async () => {
    const password = randomPassword();
    const user = await randomUser({ password });

    const { data, error } = await apiSignIn({
      email: user.email,
      password,
    });
    expect(error).toBeNull();

    if (!data) {
      throw new Error("sign-in failed: apiSignIn returned empty data");
    }

    expect(data.base.success).toBe(true);
    expect(data.base.msg).toEqual("");

    const payload = JWT.verify({ token: data.data.token });
    expect(payload.email).toBe(user.email);
    expect(payload.userId).toBe(user.id);
    expect(payload.name).toBe(user.name);

    expect(data.data.user.id).toBe(user.id);
    expect(data.data.user.email).toBe(user.email);
    expect(data.data.user.name).toBe(user.name);
    expect(data.data.user.verified).toBe(user.verified);
    expect(data.data.user.createdAt).toBe(user.createdAt);
    expect(data.data.user.updatedAt).toBe(user.updatedAt);
  });

  it("wrong email", async () => {
    const email = randomEmail();
    const password = randomPassword();

    const { data, error } = await apiSignIn({ email, password });
    expect(error).toBeNull();

    if (!data) {
      throw new Error("sign-in failed: apiSignIn returned empty data");
    }

    expect(data.base.success).toBe(false);
    expect(data.base.msg).toBe(MSG_INVALID_EMAIL_OR_PASSWORD);

    expect(data.data.token).toBe("");
    expect(data.data.user.id).toBe("");
    expect(data.data.user.email).toBe("");
    expect(data.data.user.name).toBe("");
    expect(data.data.user.verified).toBe(false);
    expect(data.data.user.createdAt).toBe(0);
    expect(data.data.user.updatedAt).toBe(0);
  });

  it("wrong password", async () => {
    const user = await randomUser();

    const password = randomPassword();

    const { data, error } = await apiSignIn({
      email: user.email,
      password,
    });
    expect(error).toBeNull();

    if (!data) {
      throw new Error("sign-in failed: apiSignIn returned empty data");
    }

    expect(data.base.success).toBe(false);
    expect(data.base.msg).toBe(MSG_INVALID_EMAIL_OR_PASSWORD);

    expect(data.data.token).toBe("");
    expect(data.data.user.id).toBe("");
    expect(data.data.user.email).toBe("");
    expect(data.data.user.name).toBe("");
    expect(data.data.user.verified).toBe(false);
    expect(data.data.user.createdAt).toBe(0);
    expect(data.data.user.updatedAt).toBe(0);
  });
});
