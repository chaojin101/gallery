import { DB, defaultDb } from "db";
import { galleryImg, img } from "db/schema";
import { desc, eq } from "drizzle-orm";

export class ImgService {
  static async getNextImgOrderByGalleryId(galleryId: string) {
    const gi = await defaultDb.query.galleryImg.findFirst({
      where: eq(galleryImg.galleryId, galleryId),
      orderBy: [desc(galleryImg.order)],
      columns: {
        order: true,
      },
    });

    if (!gi) {
      return 0;
    }
    return gi.order + 1;
  }

  static async addImgs(options: { db?: DB; urls: string[] }) {
    const { db = defaultDb, urls } = options;

    const imgValues = urls.map((url) => ({
      url,
    }));

    return await db.insert(img).values(imgValues).returning();
  }

  static async appendImgToGallery(options: {
    galleryId: string;
    urls: string[];
  }) {
    const { galleryId, urls } = options;

    const imgOffset = await this.getNextImgOrderByGalleryId(galleryId);

    await defaultDb.transaction(async (tx) => {
      const imgDBs = await this.addImgs({ db: tx, urls });

      const galleryImgValues = imgDBs.map((imgDB, index) => ({
        galleryId,
        imgId: imgDB.id,
        order: index + imgOffset,
      }));

      await tx.insert(galleryImg).values(galleryImgValues);
    });
  }

  static async getImgByGalleryId(options: {
    galleryId: string;
    offset?: number;
    limit?: number;
  }) {
    const { galleryId, offset = 0, limit = 10 } = options;

    const imgDBs = await defaultDb
      .select({ img })
      .from(img)
      .leftJoin(galleryImg, eq(img.id, galleryImg.imgId))
      .where(eq(galleryImg.galleryId, galleryId))
      .orderBy(galleryImg.order)
      .offset(offset)
      .limit(limit);

    return imgDBs.map((imgDB) => ({
      ...imgDB.img,
    }));
  }
}
