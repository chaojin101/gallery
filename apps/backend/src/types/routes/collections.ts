import {
  COLLECTION_DESCRIPTION_MAX_LENGTH,
  COLLECTION_DESCRIPTION_MIN_LENGTH,
  COLLECTION_NAME_MAX_LENGTH,
  COLLECTION_NAME_MIN_LENGTH,
} from "@gallery/common";
import { createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { baseRespSchema } from ".";
import { collection } from "../../db/schema";
import { imgSchema } from "./imgs";

export const collectionSchema = createSelectSchema(collection, {
  createdAt: t.Number(),
  updatedAt: t.Number(),
});

export const collectionWithImgsSchema = t.Intersect([
  collectionSchema,
  t.Object({ imgs: t.Array(imgSchema) }),
]);

export const addCollectionReqBodySchema = t.Object({
  name: t.String({
    minLength: COLLECTION_NAME_MIN_LENGTH,
    maxLength: COLLECTION_NAME_MAX_LENGTH,
  }),
  description: t.String({
    minLength: COLLECTION_DESCRIPTION_MIN_LENGTH,
    maxLength: COLLECTION_DESCRIPTION_MAX_LENGTH,
  }),
});

export const addCollectionRespBodySchema = t.Object({
  base: baseRespSchema,
  data: t.Object({ collection: collectionSchema }),
});

export const getAddCollectionCardRespBodySchema = t.Object({
  base: baseRespSchema,
  data: t.Object({
    collections: t.Array(
      t.Intersect([
        collectionSchema,
        t.Object({ amount: t.Number() }),
        t.Object({ imgs: t.Array(imgSchema) }),
      ])
    ),
  }),
});

export const appendToCollectionReqBodySchema = t.Object({
  collectionId: t.String(),
  imgIds: t.Array(t.String()),
});

export const appendToCollectionRespBodySchema = t.Object({
  base: baseRespSchema,
  data: t.Object({
    collection: collectionWithImgsSchema,
  }),
});

export const getLatestCollectionsReqQuerySchema = t.Object({
  page: t.Optional(t.Numeric({ minimum: 0, maximum: 10000, default: 1 })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 10 })),
});

export const getLatestCollectionsRespBodySchema = t.Object({
  base: baseRespSchema,
  data: t.Object({
    totalCount: t.Number(),
    collections: t.Array(collectionWithImgsSchema),
  }),
});

export const getCollectionByIdRespBodySchema = t.Object({
  base: baseRespSchema,
  data: t.Object({
    collection: collectionWithImgsSchema,
  }),
});
