import { Value } from "@sinclair/typebox/value";
import Elysia from "elysia";
import { CollectionSQL, SQL } from "../db/sql";
import { authPlugin } from "../plugins";
import { CollectionService } from "../service/collection";
import { authHeaderSchema } from "../types/routes/auth";
import {
  addCollectionReqBodySchema,
  addCollectionRespBodySchema,
  appendToCollectionReqBodySchema,
  appendToCollectionRespBodySchema,
  getAddCollectionCardRespBodySchema,
  getCollectionByIdRespBodySchema,
  getLatestCollectionsReqQuerySchema,
  getLatestCollectionsRespBodySchema,
  MSG_COLLECTION_NAME_EXIST,
} from "../types/routes/collections";

export const collectionsRoute = new Elysia({ prefix: "/v1/collections" })
  .get(
    "/latest",
    async ({ query }) => {
      const { limit = 10, page = 0 } = query;
      const resp = Value.Create(getLatestCollectionsRespBodySchema);

      resp.data.collections = await CollectionSQL.getLastest({
        limit,
        page,
      });
      resp.data.totalCount = await CollectionSQL.getTotalCount();

      resp.base.success = true;
      return resp;
    },
    {
      query: getLatestCollectionsReqQuerySchema,
      response: getLatestCollectionsRespBodySchema,
    }
  )
  .get(
    "/:id",
    async ({ params }) => {
      const resp = Value.Create(getCollectionByIdRespBodySchema);

      const result = await SQL.getCollectionById({ id: params.id });
      if (!result) {
        resp.base.msg = "Collection not found";
        return resp;
      }

      resp.data.collection = result;
      resp.base.success = true;

      return resp;
    },
    {
      response: getCollectionByIdRespBodySchema,
    }
  )

  .use(authPlugin)
  .post(
    "",
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
