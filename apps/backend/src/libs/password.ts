import bcrypt from "bcrypt";

export class Password {
  static async hash(options: { password: string }) {
    const { password } = options;

    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async compare(options: { password: string; hashedPassword: string }) {
    const { password, hashedPassword } = options;

    return await bcrypt.compare(password, hashedPassword);
  }
}
