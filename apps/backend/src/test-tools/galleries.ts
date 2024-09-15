import { faker } from "@faker-js/faker";
import {
  GALLERY_DESCRIPTION_MAX_LENGTH,
  GALLERY_DESCRIPTION_MIN_LENGTH,
  GALLERY_NAME_MAX_LENGTH,
  GALLERY_NAME_MIN_LENGTH,
} from "@gallery/common";
import { TestClient } from "./common";
import { randomImgUrls } from "./img";
import { randomUser } from "./users";

export const randomGalleryName = () => {
  return faker.string.alphanumeric({
    length: { min: GALLERY_NAME_MIN_LENGTH, max: GALLERY_NAME_MAX_LENGTH },
  });
};

export const randomGalleryDescription = () => {
  return faker.string.alphanumeric({
    length: {
      min: GALLERY_DESCRIPTION_MIN_LENGTH,
      max: GALLERY_DESCRIPTION_MAX_LENGTH,
    },
  });
};

export const apiAddGallery = async (
  options: { name?: string; description?: string; token?: string } = {}
) => {
  let {
    name = randomGalleryName(),
    description = randomGalleryDescription(),
    token,
  } = options;

  if (token === undefined) {
    const user = await randomUser();
    token = user.token;
  }

  return await TestClient.api.v1.galleries.post(
    { name, description },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const randomGallery = async (
  options: { name?: string; description?: string; token?: string } = {}
) => {
  const { data } = await apiAddGallery(options);

  if (data === null) {
    throw new Error("randomGallery: Failed to call apiAddGallery");
  }

  return {
    ...data.data.gallery,
  };
};

export const randomGalleryWithImg = async (
  options: {
    name?: string;
    description?: string;
    token?: string;
    min?: number;
    max?: number;
  } = {}
) => {
  let { name, description, token, min = 1, max = 10 } = options;

  if (token === undefined) {
    const user = await randomUser();
    token = user.token;
  }

  let { data } = await apiAddGallery({
    name,
    description,
    token,
  });

  if (data === null) {
    throw new Error("randomGalleryWithImg: Failed to call apiAddGallery");
  }

  const gallery = data.data.gallery;

  const urls = randomImgUrls({ min, max });

  const { data: appendedData } = await apiAppendGallery({
    token,
    galleryId: gallery.id,
    urls,
  });

  if (appendedData === null) {
    throw new Error("randomGalleryWithImg: Failed to call apiAppendGallery");
  }

  return {
    gallery,
    imgs: appendedData.data.imgs,
  };
};

export const apiAppendGallery = async (options: {
  galleryId: string;
  token: string;
  urls?: string[];
}) => {
  const { token, galleryId, urls = randomImgUrls() } = options;

  return await TestClient.api.v1.galleries({ id: galleryId }).append.post(
    {
      urls,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// import { faker } from "@faker-js/faker";
// import { TestClient } from "test-tools";
// import { Gallery } from "../db/schema";
// import { randomImgUrls } from "./img";
// import { randomAuthHeader, randomUser } from "./users";

// export const randomGalleryId = () => {
//   return faker.string.uuid();
// };

// export const randomGalleryName = () => {
//   return faker.string.alphanumeric({ length: { min: 1, max: 100 } });
// };

// export const randomGalleryDescription = () => {
//   return faker.string.alphanumeric({ length: { min: 0, max: 1000 } });
// };

// export const apiAddGallery = async (
//   options: {
//     token?: string;
//     name?: string;
//     description?: string;
//   } = {}
// ) => {
//   const {
//     token,
//     name = randomGalleryName(),
//     description = randomGalleryDescription(),
//   } = options;

//   const authHeaders = await randomAuthHeader({ token });

//   return await TestClient.api.v1.galleries.index.post(
//     {
//       name,
//       description,
//     },
//     {
//       headers: authHeaders,
//     }
//   );
// };

// export const randomGalleryWithImg = async (
//   options: {
//     token?: string;
//     min?: number;
//     max?: number;
//   } = {}
// ) => {
//   const { token = (await randomUser()).token, min = 1, max = 10 } = options;

//   const gallery = await randomGallery({ token });
//   const urls = randomImgUrls({ min, max });

//   const result = await apiAppendGallery({
//     token,
//     gallery,
//     urls,
//   });
//   return result;
// };
