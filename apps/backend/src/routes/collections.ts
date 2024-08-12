import { Value } from "@sinclair/typebox/value";
import Elysia from "elysia";
import { authPlugin } from "../plugins";
import { CollectionService } from "../service/collection";
import {
  addCollectionReqBodySchema,
  addCollectionRespBodySchema,
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
  );
