import {
  MSG_GALLERY_NAME_EXIST,
  MSG_GALLERY_NOT_FOUND,
  MSG_UNAUTHORIZED,
} from "@gallery/common";
import { Value } from "@sinclair/typebox/value";
import Elysia from "elysia";
import {
  appendImgToGallery,
  getImgsByGalleryId,
  getLastestGallery,
} from "../db/sqls";
import {
  addGalleryToDB,
  getGalleryByIdFromDB,
  getGalleryByNameFromDB,
  getTotalGalleryAmount,
} from "../db/sqls/gallery";
import { IMG_PLACEHOLDER_URL } from "../db/sqls/img";
import { authPlugin } from "../plugins";
import { authHeaderSchema } from "../types/routes/auth";
import {
  addGalleryReqBodySchema,
  addGalleryRespBodySchema,
  appendImgGalleryRespBodySchema,
  appendImgToGalleryReqBodySchema,
  getGalleryByIdRespBodySchema,
  getLatestGalleriesReqQuerySchema,
  getLatestGalleriesRespBodySchema,
} from "../types/routes/galleries";

export const galleriesRoute = new Elysia({ prefix: "/v1/galleries" })
  .get(
    "/:id",
    async ({ params }) => {
      const resp = Value.Create(getGalleryByIdRespBodySchema);

      const gallery = await getGalleryByIdFromDB({ id: params.id });
      if (!gallery) {
        resp.base.msg = MSG_GALLERY_NOT_FOUND;
        return resp;
      }

      const imgs = await getImgsByGalleryId({
        galleryId: params.id,
      });

      resp.base.success = true;

      resp.data.gallery.id = gallery.id;
      resp.data.gallery.userId = gallery.userId;
      resp.data.gallery.name = gallery.name;
      resp.data.gallery.description = gallery.description;
      resp.data.gallery.createdAt = gallery.createdAt.getTime();
      resp.data.gallery.updatedAt = gallery.updatedAt.getTime();
      resp.data.imgs = imgs;

      return resp;
    },
    {
      response: getGalleryByIdRespBodySchema,
    }
  )
  .get(
    "/latest",
    async ({ query }) => {
      const { limit = 10, page = 1 } = query;
      const resp = Value.Create(getLatestGalleriesRespBodySchema);

      const galleries = await getLastestGallery({
        offset: (page - 1) * limit,
        limit: limit,
      });
      resp.data.totalCount = await getTotalGalleryAmount();

      resp.base.success = true;

      resp.data.galleries = galleries.map((gallery) => {
        return {
          galleryId: gallery.id,
          firstImgUrl: gallery.galleryImgs[0]?.img?.url || IMG_PLACEHOLDER_URL,
        };
      });
      return resp;
    },
    {
      query: getLatestGalleriesReqQuerySchema,
      response: getLatestGalleriesRespBodySchema,
    }
  )

  .use(authPlugin)
  .post(
    "",
    async ({ body, tokenPayload }) => {
      const resp = Value.Create(addGalleryRespBodySchema);

      let gallery = await getGalleryByNameFromDB({
        name: body.name,
      });
      if (gallery) {
        resp.base.msg = MSG_GALLERY_NAME_EXIST;
        return resp;
      }

      gallery = await addGalleryToDB({
        ...body,
        userId: tokenPayload.userId,
      });

      resp.base.success = true;

      resp.data.gallery.id = gallery.id;
      resp.data.gallery.userId = gallery.userId;
      resp.data.gallery.name = gallery.name;
      resp.data.gallery.description = gallery.description;
      resp.data.gallery.createdAt = gallery.createdAt.getTime();
      resp.data.gallery.updatedAt = gallery.updatedAt.getTime();

      return resp;
    },
    {
      headers: authHeaderSchema,
      body: addGalleryReqBodySchema,
      response: addGalleryRespBodySchema,
    }
  )
  .post(
    "/:id/append",
    async ({ params, body, tokenPayload }) => {
      const resp = Value.Create(appendImgGalleryRespBodySchema);

      const gallery = await getGalleryByIdFromDB({ id: params.id });
      if (!gallery) {
        resp.base.msg = MSG_GALLERY_NOT_FOUND;
        return resp;
      }

      if (gallery.userId !== tokenPayload.userId) {
        resp.base.msg = MSG_UNAUTHORIZED;
        return resp;
      }

      await appendImgToGallery({
        galleryId: params.id,
        urls: body.urls,
      });

      const imgs = await getImgsByGalleryId({ galleryId: params.id });

      resp.base.success = true;

      resp.data.gallery.id = gallery.id;
      resp.data.gallery.userId = gallery.userId;
      resp.data.gallery.name = gallery.name;
      resp.data.gallery.description = gallery.description;
      resp.data.gallery.createdAt = gallery.createdAt.getTime();
      resp.data.gallery.updatedAt = gallery.updatedAt.getTime();
      resp.data.imgs = imgs;

      return resp;
    },
    {
      headers: authHeaderSchema,
      body: appendImgToGalleryReqBodySchema,
      response: appendImgGalleryRespBodySchema,
    }
  );
