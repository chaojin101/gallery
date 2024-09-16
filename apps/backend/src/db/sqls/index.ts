import { asc, desc, eq } from "drizzle-orm";
import { defaultDb } from "..";
import { collectionImg, gallery, galleryImg, img } from "../schema";
import { getNextImgOrderByGalleryId } from "./galleryImg";
import { addImgs } from "./img";

export const appendImgToGallery = async (options: {
  galleryId: string;
  urls: string[];
}) => {
  const { galleryId, urls } = options;

  const imgOffset = await getNextImgOrderByGalleryId({ galleryId });

  await defaultDb.transaction(async (tx) => {
    const imgDBs = await addImgs({ db: tx, urls });

    const galleryImgValues = imgDBs.map((imgDB, index) => ({
      galleryId,
      imgId: imgDB.id,
      order: index + imgOffset,
    }));

    await tx.insert(galleryImg).values(galleryImgValues);
  });
};

export const getImgsByGalleryId = async (options: { galleryId: string }) => {
  const { galleryId } = options;
  const imgs = await defaultDb.query.galleryImg.findMany({
    columns: {},
    where: eq(galleryImg.galleryId, galleryId),
    orderBy: [asc(galleryImg.order)],
    with: {
      img: true,
    },
  });
  return imgs.map((img) => img.img);
};

export const getLastestGallery = async (options: {
  offset: number;
  limit: number;
}) => {
  const { offset, limit } = options;

  const rows = await defaultDb
    .select()
    .from(gallery)
    .innerJoin(galleryImg, eq(gallery.id, galleryImg.galleryId))
    .innerJoin(img, eq(galleryImg.imgId, img.id))
    .where(eq(galleryImg.order, 0))
    .orderBy(desc(gallery.createdAt))
    .offset(offset)
    .limit(limit);

  return rows;
};

export const getImgsByCollectionId = async (options: {
  collectionId: string;
}) => {
  const { collectionId } = options;

  const r = await defaultDb.query.collectionImg.findMany({
    columns: {},
    where: eq(collectionImg.collectionId, collectionId),
    orderBy: [asc(collectionImg.order)],
    with: {
      img: true,
    },
  });

  return r.map((img) => img.img);
};
