import { t } from "elysia";
import { baseRespSchema } from ".";
import { gallerySchema, imgSchema } from "../../db/schema";

export const addGalleryReqBodySchema = t.Object({
  name: t.String({ minLength: 1, maxLength: 100 }),
  description: t.String({ minLength: 0, maxLength: 1000 }),
});

export const addGalleryRespBodySchema = t.Object({
  base: baseRespSchema,
  gallery: gallerySchema,
});

export const appendImgToGalleryReqBodySchema = t.Object({
  urls: t.Array(t.String({ minLength: 1, maxLength: 1000, format: "uri" })),
});

export const appendImgGalleryRespBodySchema = t.Object({
  base: baseRespSchema,
  gallery: gallerySchema,
});

export const getGalleryByIdRespBodySchema = t.Object({
  base: baseRespSchema,
  gallery: gallerySchema,
  imgs: t.Array(imgSchema),
});

export const getLatestGalleriesReqQuerySchema = t.Object({
  page: t.Optional(t.Numeric({ minimum: 0, maximum: 10000, default: 1 })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 10 })),
});

export const getLatestGalleriesRespBodySchema = t.Object({
  base: baseRespSchema,
  data: t.Object({
    totalCount: t.Number(),
    galleries: t.Array(
      t.Object({
        id: t.String(),
        imgUrl: t.String(),
      })
    ),
  }),
});

export const MSG_GALLERY_NAME_EXIST = "Gallery name already exists";
export const MSG_GALLERY_NOT_FOUND = "Gallery not found";
