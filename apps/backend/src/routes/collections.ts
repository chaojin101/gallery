import {
  authHeaderSchema,
  MSG_COLLECTION_NAME_EXIST,
  MSG_COLLECTION_NOT_FOUND,
  MSG_UNAUTHORIZED,
} from "@gallery/common";
import { Value } from "@sinclair/typebox/value";
import Elysia from "elysia";
import { getImgsByCollectionId } from "../db/sqls";
import {
  addCollection,
  getCollectionByIdFromDB,
  getCollectionByName,
  getCollectionByUserIdFromDB,
  getCollectionImgCountByCollectionId,
  getLastesCollections,
  getTotalCollectionsWithImgAmount,
} from "../db/sqls/collection";
import { appendToCollection } from "../db/sqls/collectionImg";
import { imgPlaceHolder } from "../db/sqls/img";
import { authPlugin } from "../plugins";
import {
  addCollectionReqBodySchema,
  addCollectionRespBodySchema,
  appendToCollectionReqBodySchema,
  appendToCollectionRespBodySchema,
  getCollectionByIdRespBodySchema,
  getAddCollectionCardRespBodySchema as getCurrentUserCollectionsRespBodySchema,
  getLatestCollectionsReqQuerySchema,
  getLatestCollectionsRespBodySchema,
} from "../types/routes/collections";

export const collectionsRoute = new Elysia({ prefix: "/v1/collections" })
  .get(
    "/latest",
    async ({ query }) => {
      const { limit = 10, page = 0 } = query;
      const resp = Value.Create(getLatestCollectionsRespBodySchema);

      const rows = await getLastesCollections({
        offset: (page - 1) * limit,
        limit,
      });
      resp.data.totalCount = await getTotalCollectionsWithImgAmount();

      resp.base.success = true;

      resp.data.collections = rows.map((row) => {
        return {
          ...row.collection,
          createdAt: row.collection.createdAt.getTime(),
          updatedAt: row.collection.updatedAt.getTime(),
          imgs: [row.img],
        };
      });

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

      const collection = await getCollectionByIdFromDB({ id: params.id });
      if (collection === undefined) {
        resp.base.msg = MSG_COLLECTION_NOT_FOUND;
        return resp;
      }

      resp.base.success = true;

      resp.data.collection = {
        ...collection,
        updatedAt: collection.updatedAt.getTime(),
        createdAt: collection.createdAt.getTime(),
        imgs: await getImgsByCollectionId({ collectionId: collection.id }),
      };

      return resp;
    },
    {
      response: getCollectionByIdRespBodySchema,
    }
  )
  .guard(
    {
      headers: authHeaderSchema,
    },
    (app) =>
      app
        .use(authPlugin)
        .post(
          "",
          async ({ body, tokenPayload }) => {
            const resp = Value.Create(addCollectionRespBodySchema);

            let collection = await getCollectionByName({ name: body.name });
            if (collection) {
              resp.base.msg = MSG_COLLECTION_NAME_EXIST;
              return resp;
            }

            collection = await addCollection({
              ...body,
              userId: tokenPayload.userId,
            });

            resp.base.success = true;

            resp.data.collection.id = collection.id;
            resp.data.collection.userId = collection.userId;
            resp.data.collection.name = collection.name;
            resp.data.collection.description = collection.description;
            resp.data.collection.createdAt = collection.createdAt.getTime();
            resp.data.collection.updatedAt = collection.updatedAt.getTime();

            return resp;
          },
          {
            body: addCollectionReqBodySchema,
            response: addCollectionRespBodySchema,
          }
        )
        .post(
          "/append",
          async ({ body, tokenPayload }) => {
            const resp = Value.Create(appendToCollectionRespBodySchema);

            const collection = await getCollectionByIdFromDB({
              id: body.collectionId,
            });
            if (!collection) {
              resp.base.msg = MSG_COLLECTION_NOT_FOUND;
              return resp;
            }
            if (collection.userId !== tokenPayload.userId) {
              resp.base.msg = MSG_UNAUTHORIZED;
              return resp;
            }

            await appendToCollection({
              collectionId: body.collectionId,
              imgIds: body.imgIds,
            });

            const imgs = await getImgsByCollectionId({
              collectionId: body.collectionId,
            });

            resp.data.collection.id = collection.id;
            resp.data.collection.userId = collection.userId;
            resp.data.collection.name = collection.name;
            resp.data.collection.description = collection.description;
            resp.data.collection.createdAt = collection.createdAt.getTime();
            resp.data.collection.updatedAt = collection.updatedAt.getTime();

            resp.data.collection.imgs = imgs;

            resp.base.success = true;

            return resp;
          },
          {
            body: appendToCollectionReqBodySchema,
            response: appendToCollectionRespBodySchema,
          }
        )
        .get(
          "/currentUser",
          async ({ tokenPayload }) => {
            const resp = Value.Create(getCurrentUserCollectionsRespBodySchema);

            const collections = await getCollectionByUserIdFromDB({
              userId: tokenPayload.userId,
            });

            for (const collection of collections) {
              const amount = await getCollectionImgCountByCollectionId({
                collectionId: collection.id,
              });

              const imgs = await getImgsByCollectionId({
                collectionId: collection.id,
              });

              resp.data.collections.push({
                ...collection,
                id: collection.id,
                createdAt: collection.createdAt.getTime(),
                updatedAt: collection.updatedAt.getTime(),
                amount,
                imgs: [imgs[0] || imgPlaceHolder],
              });
            }

            resp.base.success = true;

            return resp;
          },
          {
            response: getCurrentUserCollectionsRespBodySchema,
          }
        )
  );
