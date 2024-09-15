import { faker } from "@faker-js/faker";

export const randomUUID = () => faker.string.uuid();

export const randomInt = (options: { min?: number; max?: number } = {}) => {
  const { min = 1, max = 10 } = options;

  return faker.number.int({ min, max });
};
