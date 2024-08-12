import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { defaultDb } from "../db";
import { user } from "../db/schema";

export class UserService {
  static async getUserByEmail(email: string) {
    return await defaultDb.query.user.findFirst({
      where: eq(user.email, email),
    });
  }

  static async isEmailTaken(email: string) {
    const result = await this.getUserByEmail(email);

    return !!result;
  }

  static async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async addUser(options: {
    name?: string;
    email: string;
    hashedPassword: string;
  }) {
    const { name = options.email, email, hashedPassword } = options;

    const result = await defaultDb
      .insert(user)
      .values([{ name, email, hashedPassword }])
      .returning();

    return result[0];
  }
}
