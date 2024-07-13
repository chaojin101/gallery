import { faker } from "@faker-js/faker";
import { describe, expect, it } from "bun:test";
import { defaultDb } from "db";
import { galleryImg, img } from "db/schema";
import { ImgService } from "service/img";
import { randomGallery } from "test-tools/galleries";
import { randomImgUrl } from "test-tools/img";

describe("getNextImgOrderByGalleryId", async () => {
  it("should return the next image order by gallery id", async () => {
    const gallery = await randomGallery();

    const imgValues = [];
    const count = faker.number.int({ min: 1, max: 10 });
    for (let i = 0; i < count; i++) {
      imgValues.push({ url: randomImgUrl() });
    }
    const imgDBs = await defaultDb.insert(img).values(imgValues).returning();

    const galleryImgValues = imgDBs.map((imgDB, index) => ({
      galleryId: gallery.id,
      imgId: imgDB.id,
      order: index,
    }));
    await defaultDb.insert(galleryImg).values(galleryImgValues);

    const result = await ImgService.getNextImgOrderByGalleryId(gallery.id);
    expect(result).toBe(count);
  });
});
