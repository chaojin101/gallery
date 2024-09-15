import { eq } from "drizzle-orm";
import { defaultDb } from "..";
import { user } from "../schema";

export const getUserByEmailFromDB = async (options: { email: string }) => {
  const { email } = options;

  return await defaultDb.query.user.findFirst({
    where: eq(user.email, email),
  });
};

export const addUserToDB = async (options: {
  name?: string;
  email: string;
  hashedPassword: string;
}) => {
  const { name = options.email, email, hashedPassword } = options;

  const result = await defaultDb
    .insert(user)
    .values([{ name, email, hashedPassword }])
    .returning();

  return result[0];
};
