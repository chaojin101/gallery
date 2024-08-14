import {
  COLLECTION_DESCRIPTION_MAX_LENGTH,
  COLLECTION_DESCRIPTION_MIN_LENGTH,
  COLLECTION_NAME_MAX_LENGTH,
  COLLECTION_NAME_MIN_LENGTH,
} from "@gallery/common";
import { t } from "elysia";
import { baseRespSchema } from ".";
import { collectionSchema } from "../../db/schema";

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
  collection: collectionSchema,
});

export const getAddCollectionCardRespBodySchema = t.Object({
  base: baseRespSchema,
  data: t.Object({
    collections: t.Array(
      t.Object({
        id: t.String(),
        name: t.String(),
        amount: t.Number(),
      })
    ),
  }),
});

export const appendToCollectionReqBodySchema = t.Object({
  amount: t.Number(),
  collectionId: t.String(),
  imgIds: t.Array(t.String()),
});

export const appendToCollectionRespBodySchema = t.Object({
  base: baseRespSchema,
});

export const getLatestCollectionsReqQuerySchema = t.Object({
  page: t.Optional(t.Numeric({ minimum: 0, maximum: 10000, default: 1 })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 10 })),
});

export const getLatestCollectionsRespBodySchema = t.Object({
  base: baseRespSchema,
  data: t.Object({
    collections: t.Array(
      t.Object({
        id: t.String(),
        imgUrl: t.String(),
      })
    ),
  }),
});

export const MSG_COLLECTION_NAME_EXIST = "collection name already exists";
export const MSG_COLLECTION_NOT_FOUND = "collection not found";
