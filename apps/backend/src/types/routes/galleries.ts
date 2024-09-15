import {
  GALLERY_DESCRIPTION_MAX_LENGTH,
  GALLERY_DESCRIPTION_MIN_LENGTH,
  GALLERY_NAME_MAX_LENGTH,
  GALLERY_NAME_MIN_LENGTH,
} from "@gallery/common";
import { createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { baseRespSchema } from ".";
import { gallery, img } from "../../db/schema";

const galleryNameSchema = t.String({
  minLength: GALLERY_NAME_MIN_LENGTH,
  maxLength: GALLERY_NAME_MAX_LENGTH,
});
const galleryDescriptionSchema = t.String({
  minLength: GALLERY_DESCRIPTION_MIN_LENGTH,
  maxLength: GALLERY_DESCRIPTION_MAX_LENGTH,
});

export const gallerySchema = createSelectSchema(gallery, {
  createdAt: t.Number(),
  updatedAt: t.Number(),
});

export const addGalleryReqBodySchema = t.Object({
  name: galleryNameSchema,
  description: galleryDescriptionSchema,
});

export const addGalleryRespBodySchema = t.Object({
  base: baseRespSchema,
  data: t.Object({ gallery: gallerySchema }),
});

export const imgSchema = createSelectSchema(img);

export const appendImgToGalleryReqBodySchema = t.Object({
  urls: t.Array(t.String({ minLength: 1, maxLength: 2000, format: "uri" })),
});

export const appendImgGalleryRespBodySchema = t.Object({
  base: baseRespSchema,
  data: t.Object({ gallery: gallerySchema, imgs: t.Array(imgSchema) }),
});

export const getGalleryByIdRespBodySchema = t.Object({
  base: baseRespSchema,
  data: t.Object({ gallery: gallerySchema, imgs: t.Array(imgSchema) }),
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
        galleryId: t.String(),
        firstImgUrl: t.String(),
      })
    ),
  }),
});
