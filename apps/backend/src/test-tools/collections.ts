import { faker } from "@faker-js/faker";
import {
  COLLECTION_DESCRIPTION_MAX_LENGTH,
  COLLECTION_DESCRIPTION_MIN_LENGTH,
  COLLECTION_NAME_MAX_LENGTH,
  COLLECTION_NAME_MIN_LENGTH,
} from "@gallery/common";
import { getImgsByCollectionId } from "db/sqls";
import { TestClient } from "./common";
import { randomGalleryWithImg } from "./galleries";
import { randomUser } from "./users";

export const randomCollectionName = () => {
  return faker.string.alphanumeric({
    length: {
      min: COLLECTION_NAME_MIN_LENGTH,
      max: COLLECTION_NAME_MAX_LENGTH,
    },
  });
};

export const randomCollectionDescription = () => {
  return faker.string.alphanumeric({
    length: {
      min: COLLECTION_DESCRIPTION_MIN_LENGTH,
      max: COLLECTION_DESCRIPTION_MAX_LENGTH,
    },
  });
};

export const apiAddCollection = async (
  options: { name?: string; description?: string; token?: string } = {}
) => {
  let {
    name = randomCollectionName(),
    description = randomCollectionDescription(),
    token,
  } = options;

  if (token === undefined) {
    const user = await randomUser();
    token = user.token;
  }

  return await TestClient.api.v1.collections.post(
    { name, description },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const randomCollection = async (
  options: { name?: string; description?: string; token?: string } = {}
) => {
  const { data } = await apiAddCollection(options);

  if (data === null) {
    throw new Error("randomGallery: Failed to call apiAddGallery");
  }

  return data.data.collection;
};

export const apiAppendToCollection = async (options: {
  collectionId: string;
  imgIds?: string[];
  token: string;
}) => {
  let { collectionId, imgIds, token } = options;

  if (imgIds === undefined) {
    const gallery = await randomGalleryWithImg();
    imgIds = gallery.imgs.map((img) => img.id);
  }

  return await TestClient.api.v1.collections.append.post(
    { collectionId, imgIds },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const randomCollectionWithImgs = async (
  options: { name?: string; description?: string; token?: string } = {}
) => {
  let {
    name = randomCollectionName(),
    description = randomCollectionDescription(),
    token,
  } = options;

  if (token === undefined) {
    const user = await randomUser();
    token = user.token;
  }

  const collection = await randomCollection({ name, description, token });

  const { data } = await apiAppendToCollection({
    collectionId: collection.id,
    token,
  });

  if (data === null) {
    throw new Error("randomGallery: Failed to call apiAddGallery");
  }

  const imgs = await getImgsByCollectionId({ collectionId: collection.id });

  return {
    ...collection,
    imgs,
  };
};

export const apiGetCurrentUserCollections = async (options: {
  token: string;
}) => {
  const { token } = options;

  return await TestClient.api.v1.collections.currentUser.get({
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const apiGetCollectionById = async (options: {
  collectionId: string;
}) => {
  const { collectionId } = options;

  return await TestClient.api.v1.collections({ id: collectionId }).get();
};
