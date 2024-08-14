import { defaultDb } from "db";
import { gallery } from "db/schema";
import { count } from "drizzle-orm";

const main = async () => {
  const amount = await defaultDb.select({ amount: count() }).from(gallery);

  console.log(amount);

  process.exit(0);
};

main();
