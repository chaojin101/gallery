import { faker } from "@faker-js/faker";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@gallery/common";
import { defaultDb } from "db";
import { user } from "db/schema";
import { eq } from "drizzle-orm";
import { TestClient } from "./common";

export const randomEmail = () => faker.internet.email();

export const randomPassword = () =>
  faker.internet.password({
    length: faker.number.int({
      min: PASSWORD_MIN_LENGTH,
      max: PASSWORD_MAX_LENGTH,
    }),
  });

export const apiSignUp = async (options: {
  email?: string;
  password?: string;
}) => {
  const { email = randomEmail(), password = randomPassword() } = options;

  return await TestClient.api.v1.users["sign-up"].post({
    email,
    password,
  });
};

export const apiSignIn = async (options: {
  email?: string;
  password?: string;
}) => {
  const { email = randomEmail(), password = randomPassword() } = options;

  return await TestClient.api.v1.users["sign-in"].post({
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

  const { data } = await apiSignUp({ email, password });
  if (!data) {
    throw new Error("randomUser: Failed to call apiSignUp");
  }

  return {
    token: data.data.token,
    ...data.data.user,
  };
};

export const getUserByEmailFromDB = async (options: { email: string }) => {
  const { email } = options;

  return await defaultDb.query.user.findFirst({
    where: eq(user.email, email),
  });
};

// export const randomUser = async (
//   options: {
//     email?: string;
//     password?: string;
//   } = {}
// ) => {
//   const { email = randomEmail(), password = randomPassword() } = options;

//   const { data } = await apiAddUser({ email, password });

//   const token = data?.token;
//   const payload = decodeToken(data?.token as string);

//   return {
//     id: payload.userId,
//     email: payload.email,
//     name: payload.name,
//     token: token as string,
//     payload,
//   };
// };

// export const randomUser1 = async (
//   options: {
//     email?: string;
//     password?: string;
//   } = {}
// ) => {
//   const { email = randomEmail(), password = randomPassword() } = options;

//   const { data } = await apiAddUser({ email, password });

//   const token = data?.token;
//   const payload = decodeToken(data?.token as string);

//   return {
//     token: token as string,
//     payload,
//   };
// };

// export const apiLoginUser = async (options: {
//   email: string;
//   password: string;
// }) => {
//   const { email, password } = options;

//   return await backend.api.v1.users["sign-in"].post({
//     email,
//     password,
//   });
// };

// export const randomAuthHeader = async (options: { token?: string } = {}) => {
//   const { token = (await randomUser()).token } = options;

//   return {
//     authorization: `Bearer ${token}`,
//   };
// };
