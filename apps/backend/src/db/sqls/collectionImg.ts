import { defaultDb } from "..";
import { collectionImg } from "../schema";
import { getCollectionImgCountByCollectionId } from "./collection";

export const appendToCollection = async (options: {
  collectionId: string;
  imgIds: string[];
}) => {
  const { collectionId, imgIds } = options;

  const startOrder = await getCollectionImgCountByCollectionId({
    collectionId,
  });

  await defaultDb.insert(collectionImg).values(
    imgIds.map((imgId, i) => ({
      collectionId,
      imgId,
      order: startOrder + i,
    }))
  );
};
