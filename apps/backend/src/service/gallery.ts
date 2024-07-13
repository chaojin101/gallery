import { defaultDb } from "db";
import { gallery, galleryImg } from "db/schema";
import { asc, desc, eq } from "drizzle-orm";

export class GalleryService {
  static async addGallery(options: {
    userId: string;
    name: string;
    description: string;
  }) {
    const result = await defaultDb
      .insert(gallery)
      .values({ ...options })
      .returning();

    return result[0];
  }

  static async getGalleryByName(name: string) {
    const result = await defaultDb
      .select()
      .from(gallery)
      .where(eq(gallery.name, name));

    return result[0];
  }

  static async getGalleryById(id: string) {
    const result = await defaultDb
      .select()
      .from(gallery)
      .where(eq(gallery.id, id));

    return result[0];
  }

  static async getLatestGallery(options: { offset?: number; limit?: number }) {
    const { offset = 0, limit = 10 } = options;

    const result = await defaultDb.query.gallery.findMany({
      offset,
      limit,
      orderBy: [desc(gallery.createdAt)],
      with: {
        galleryImgs: {
          orderBy: [asc(galleryImg.order)],
          limit: 1,
          columns: {},
          with: {
            img: true,
          },
        },
      },
    });

    return result.map((gallery) => ({
      ...gallery,
      galleryImgs: undefined,
      imgs: gallery.galleryImgs.map((galleryImg) => ({
        ...galleryImg.img,
      })),
    }));
  }
}
