import { Value } from "@sinclair/typebox/value";
import Elysia from "elysia";
import { GallerySQL } from "../db/sql";
import { authPlugin } from "../plugins";
import { GalleryService } from "../service/gallery";
import { ImgService } from "../service/img";
import {
  addGalleryReqBodySchema,
  addGalleryRespBodySchema,
  appendImgGalleryRespBodySchema,
  appendImgToGalleryReqBodySchema,
  getGalleryByIdRespBodySchema,
  getLatestGalleriesReqQuerySchema,
  getLatestGalleriesRespBodySchema,
  MSG_GALLERY_NAME_EXIST,
  MSG_GALLERY_NOT_FOUND,
} from "../types/routes/galleries";
import { authHeaderSchema, MSG_UNAUTHORIZED } from "../types/routes/users";

export const galleriesRoute = new Elysia({ prefix: "/v1/galleries" })
  .get(
    "/:id",
    async ({ params }) => {
      const resp = Value.Create(getGalleryByIdRespBodySchema);

      const gallery = await GalleryService.getGalleryById(params.id);
      if (!gallery) {
        resp.base.msg = MSG_GALLERY_NOT_FOUND;
        return resp;
      }

      const imgDBs = await ImgService.getImgByGalleryId({
        galleryId: params.id,
      });

      resp.base.success = true;
      resp.gallery = gallery;
      resp.imgs = imgDBs;
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

      resp.data.galleries = await GallerySQL.getLastest({
        page: page,
        limit: limit,
      });
      resp.data.totalCount = await GallerySQL.getTotalAmount();

      resp.base.success = true;
      return resp;
    },
    {
      query: getLatestGalleriesReqQuerySchema,
      response: getLatestGalleriesRespBodySchema,
    }
  )

  .use(authPlugin)
  .post(
    "/",
    async ({ body, tokenPayload }) => {
      const resp = Value.Create(addGalleryRespBodySchema);

      let gallery = await GalleryService.getGalleryByName(body.name);
      if (gallery) {
        resp.base.msg = MSG_GALLERY_NAME_EXIST;
        return resp;
      }

      gallery = await GalleryService.addGallery({
        ...body,
        userId: tokenPayload.userId,
      });

      resp.base.success = true;
      resp.gallery = gallery;
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

      const gallery = await GalleryService.getGalleryById(params.id);
      if (!gallery) {
        resp.base.msg = MSG_GALLERY_NOT_FOUND;
        return resp;
      }

      if (gallery.userId !== tokenPayload.userId) {
        resp.base.msg = MSG_UNAUTHORIZED;
        return resp;
      }

      await ImgService.appendImgToGallery({
        galleryId: params.id,
        urls: body.urls,
      });

      resp.base.success = true;
      return resp;
    },
    {
      headers: authHeaderSchema,
      body: appendImgToGalleryReqBodySchema,
      response: appendImgGalleryRespBodySchema,
    }
  );
