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

export const MSG_COLLECTION_NAME_EXIST = "collection name already exists";
export const MSG_COLLECTION_NOT_FOUND = "collection not found";