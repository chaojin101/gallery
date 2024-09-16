import { createSelectSchema } from "drizzle-typebox";
import { img } from "../../db/schema";

export const imgSchema = createSelectSchema(img);
