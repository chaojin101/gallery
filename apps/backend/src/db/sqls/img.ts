import { DB, defaultDb } from "..";
import { img } from "../schema";

export const IMG_PLACEHOLDER_URL =
  "https://image.acg.lol/file/2024/09/15/empty9850c0f2d75d155b.jpg";

export const addImgs = async (options: { db?: DB; urls: string[] }) => {
  const { db = defaultDb, urls } = options;

  const imgValues = urls.map((url) => ({
    url,
  }));

  return await db.insert(img).values(imgValues).returning();
};
