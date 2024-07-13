import { faker } from "@faker-js/faker";

export const randomImgUrl = () => {
  return faker.image.url();
};

export const randomImgUrls = (options: { min?: number; max?: number } = {}) => {
  const { min = 1, max = 10 } = options;

  const urls = [];
  const count = faker.number.int({ min, max });
  for (let i = 0; i < count; i++) {
    urls.push(randomImgUrl());
  }

  return urls;
};
