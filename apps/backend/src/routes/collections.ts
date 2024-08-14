import { Value } from "@sinclair/typebox/value";
import Elysia from "elysia";
import { SQL } from "../db/sql";
import { authPlugin } from "../plugins";
import { CollectionService } from "../service/collection";
import {
  addCollectionReqBodySchema,
  addCollectionRespBodySchema,
  appendToCollectionReqBodySchema,
  appendToCollectionRespBodySchema,
  getAddCollectionCardRespBodySchema,
  MSG_COLLECTION_NAME_EXIST,
} from "../types/routes/collections";
import { authHeaderSchema } from "../types/routes/users";

export const collectionsRoute = new Elysia({ prefix: "/v1/collections" })
  .use(authPlugin)
  .post(
    "/",
    async ({ body, tokenPayload }) => {
      const resp = Value.Create(addCollectionRespBodySchema);

      let collection = await CollectionService.getCollectionByName(body.name);
      if (collection) {
        resp.base.msg = MSG_COLLECTION_NAME_EXIST;
        return resp;
      }

      collection = await CollectionService.addCollection({
        ...body,
        userId: tokenPayload.userId,
      });

      resp.base.success = true;
      resp.collection = collection;
      return resp;
    },
    {
      headers: authHeaderSchema,
      body: addCollectionReqBodySchema,
      response: addCollectionRespBodySchema,
    }
  )
  .get(
    "/addCollectionCard",
    async ({ tokenPayload }) => {
      const resp = Value.Create(getAddCollectionCardRespBodySchema);

      resp.data.collections = await SQL.getAddCollectionCard({
        userId: tokenPayload.userId,
      });

      resp.base.success = true;
      return resp;
    },
    {
      headers: authHeaderSchema,
      response: getAddCollectionCardRespBodySchema,
    }
  )
  .post(
    "/appendToCollection",
    async ({ body, tokenPayload }) => {
      const resp = Value.Create(appendToCollectionRespBodySchema);

      const collection = await CollectionService.getCollectionById({
        id: body.collectionId,
      });
      if (!collection) {
        resp.base.msg = "Collection not found";
        return resp;
      }
      if (collection.userId !== tokenPayload.userId) {
        resp.base.msg = "You are not the owner of this collection";
        return resp;
      }

      await SQL.appendToCollection({
        collectionId: body.collectionId,
        imgIds: body.imgIds,
        startOrder: body.amount,
      });

      resp.base.success = true;
      return resp;
    },
    {
      headers: authHeaderSchema,
      body: appendToCollectionReqBodySchema,
      response: appendToCollectionRespBodySchema,
    }
  );
