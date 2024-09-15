import { count, eq } from "drizzle-orm";
import { defaultDb } from "..";
import { gallery } from "../schema";

export const getGalleryByNameFromDB = async (options: { name: string }) => {
  const { name } = options;

  return await defaultDb.query.gallery.findFirst({
    where: eq(gallery.name, name),
  });
};

export const getGalleryByIdFromDB = async (options: { id: string }) => {
  const { id } = options;

  return await defaultDb.query.gallery.findFirst({
    where: eq(gallery.id, id),
  });
};

export const getTotalGalleryAmount = async () => {
  const result = await defaultDb.select({ count: count() }).from(gallery);

  return result[0].count;
};

export const addGalleryToDB = async (options: {
  userId: string;
  name: string;
  description: string;
}) => {
  const result = await defaultDb
    .insert(gallery)
    .values({ ...options })
    .returning();

  return result[0];
};
