import bcrypt from "bcrypt";
import { defaultDb } from "db";
import { user } from "db/schema";
import { eq } from "drizzle-orm";

export class UserService {
  static async getUserByEmail(email: string) {
    const result = await defaultDb
      .select()
      .from(user)
      .where(eq(user.email, email));

    return result[0];
  }

  static async isEmailTaken(email: string) {
    const result = await this.getUserByEmail(email);

    if (result) {
      return true;
    }

    return false;
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
      .returning({ userId: user.id, name: user.name, email: user.email });

    return result[0];
  }
}
