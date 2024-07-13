import { faker } from "@faker-js/faker";
import { Gallery } from "db/schema";
import { backend } from "test-tools";
import { randomImgUrls } from "./img";
import { randomAuthHeader } from "./users";

export const randomGalleryId = () => {
  return faker.string.uuid();
};

export const randomGalleryName = () => {
  return faker.string.alphanumeric({ length: { min: 1, max: 100 } });
};

export const randomGalleryDescription = () => {
  return faker.string.alphanumeric({ length: { min: 0, max: 1000 } });
};

export const apiAddGallery = async (
  options: {
    token?: string;
    name?: string;
    description?: string;
  } = {}
) => {
  const {
    token,
    name = randomGalleryName(),
    description = randomGalleryDescription(),
  } = options;

  const authHeaders = await randomAuthHeader({ token });

  return await backend.api.v1.galleries.index.post(
    {
      name,
      description,
    },
    {
      headers: authHeaders,
    }
  );
};

export const apiAppendGallery = async (
  options: {
    token?: string;
    gallery?: Gallery;
    urls?: string[];
  } = {}
) => {
  const {
    token,
    gallery = await randomGallery(),
    urls = randomImgUrls(),
  } = options;

  const authHeaders = await randomAuthHeader({ token });

  return await backend.api.v1.galleries({ id: gallery.id }).append.post(
    {
      urls,
    },
    {
      headers: authHeaders,
    }
  );
};

export const randomGallery = async (
  options: {
    token?: string;
    name?: string;
    description?: string;
  } = {}
) => {
  let {
    token,
    name = randomGalleryName(),
    description = randomGalleryDescription(),
  } = options;

  const { data } = await apiAddGallery({ token, name, description });
  const gallery = data?.gallery as Gallery;

  return {
    ...gallery,
    token: token,
  };
};
