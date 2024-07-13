import { gallerySchema, imgSchema } from "db/schema";
import { t } from "elysia";
import { BaseRespSchema } from ".";

export const addGalleryReqBodySchema = t.Object({
  name: t.String({ minLength: 1, maxLength: 100 }),
  description: t.String({ minLength: 0, maxLength: 1000 }),
});

export const addGalleryRespBodySchema = t.Object({
  base: BaseRespSchema,
  gallery: gallerySchema,
});

export const appendImgToGalleryReqBodySchema = t.Object({
  urls: t.Array(t.String({ minLength: 1, maxLength: 1000, format: "uri" })),
});

export const appendImgGalleryRespBodySchema = t.Object({
  base: BaseRespSchema,
  gallery: gallerySchema,
});

export const getGalleryByIdReqQuerySchema = t.Object({
  offset: t.Optional(t.Numeric({ minimum: 0, maximum: 10000, default: 0 })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 10 })),
});

export const getGalleryByIdRespBodySchema = t.Object({
  base: BaseRespSchema,
  gallery: gallerySchema,
  imgs: t.Array(imgSchema),
});

export const getLatestGalleriesReqQuerySchema = t.Object({
  offset: t.Optional(t.Numeric({ minimum: 0, maximum: 10000, default: 0 })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 10 })),
});

export const getLatestGalleriesRespBodySchema = t.Object({
  base: BaseRespSchema,
  galleries: t.Array(
    t.Object({
      g: gallerySchema,
      imgs: t.Array(imgSchema),
    })
  ),
});

export const MSG_GALLERY_NAME_EXIST = "Gallery name already exists";
export const MSG_GALLERY_NOT_FOUND = "Gallery not found";
