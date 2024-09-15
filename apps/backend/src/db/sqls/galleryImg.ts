import { desc, eq } from "drizzle-orm";
import { defaultDb } from "..";
import { galleryImg } from "../schema";

export const getNextImgOrderByGalleryId = async (options: {
  galleryId: string;
}) => {
  const { galleryId } = options;

  const gi = await defaultDb.query.galleryImg.findFirst({
    where: eq(galleryImg.galleryId, galleryId),
    orderBy: [desc(galleryImg.order)],
    columns: {
      order: true,
    },
  });

  if (!gi) {
    return 0;
  }
  return gi.order + 1;
};
