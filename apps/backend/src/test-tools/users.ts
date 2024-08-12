import { faker } from "@faker-js/faker";
import { defaultDb } from "db";
import { user } from "db/schema";
import { eq } from "drizzle-orm";
import { SignReqSchema } from "exports";
import { backend, decodeToken } from "test-tools";

export class TestUserDBService {
  static async getUserByEmail(email: string) {
    return await defaultDb.query.user.findFirst({
      where: eq(user.email, email),
    });
  }
}

export const randomEmail = () => faker.internet.email();

export const randomPassword = () =>
  faker.internet.password({
    length: faker.number.int({
      min: SignReqSchema.properties.password.minLength,
      max: SignReqSchema.properties.password.maxLength,
    }),
  });

export const apiAddUser = async (
  options: {
    email?: string;
    password?: string;
  } = {}
) => {
  const { email = randomEmail(), password = randomPassword() } = options;

  return await backend.api.v1.users["sign-up"].post({
    email,
    password,
  });
};

export const randomUser = async (
  options: {
    email?: string;
    password?: string;
  } = {}
) => {
  const { email = randomEmail(), password = randomPassword() } = options;

  const { data } = await apiAddUser({ email, password });

  const token = data?.token;
  const payload = decodeToken(data?.token as string);

  return {
    id: payload.userId,
    email: payload.email,
    name: payload.name,
    token: token as string,
    payload,
  };
};

export const randomUser1 = async (
  options: {
    email?: string;
    password?: string;
  } = {}
) => {
  const { email = randomEmail(), password = randomPassword() } = options;

  const { data } = await apiAddUser({ email, password });

  const token = data?.token;
  const payload = decodeToken(data?.token as string);

  return {
    token: token as string,
    payload,
  };
};

export const apiLoginUser = async (options: {
  email: string;
  password: string;
}) => {
  const { email, password } = options;

  return await backend.api.v1.users["sign-in"].post({
    email,
    password,
  });
};

export const randomAuthHeader = async (options: { token?: string } = {}) => {
  const { token = (await randomUser()).token } = options;

  return {
    authorization: `Bearer ${token}`,
  };
};
