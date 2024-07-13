// test/index.test.ts
import { describe, expect, it } from "bun:test";
import { defaultDb } from "db";
import { galleryImg } from "db/schema";
import { eq } from "drizzle-orm";
import { backend } from "test-tools";
import {
  apiAddGallery,
  apiAppendGallery,
  randomGallery,
  randomGalleryDescription,
  randomGalleryId,
  randomGalleryName,
} from "test-tools/galleries";
import { randomImgUrls } from "test-tools/img";
import { randomUser } from "test-tools/users";
import {
  MSG_GALLERY_NAME_EXIST,
  MSG_GALLERY_NOT_FOUND,
} from "types/routes/galleries";

describe("add gallery", async () => {
  it("success", async () => {
    const user = await randomUser();
    const name = randomGalleryName();
    const description = randomGalleryDescription();

    const { data, error } = await apiAddGallery({
      token: user.token,
      name,
      description,
    });

    expect(error).toBeNull();
    expect(data?.base.success).toBe(true);

    expect(data?.gallery.id).not.toBe("");
    expect(data?.gallery.name).toBe(name);
    expect(data?.gallery.description).toBe(description);
    expect(data?.gallery.userId).toBe(user.id);
  });

  it("duplicate name", async () => {
    const gallery = await randomGallery();

    const { data, error } = await apiAddGallery({
      name: gallery.name,
    });

    expect(error).toBeNull();
    expect(data?.base.success).toBe(false);
    expect(data?.base.msg).toBe(MSG_GALLERY_NAME_EXIST);

    expect(data?.gallery.id).toBe("");
  });
});

describe("get gallery by id", async () => {
  it("success", async () => {
    const gallery = await randomGallery();

    const { data, error } = await backend.api.v1
      .galleries({ id: gallery.id })
      .get();

    expect(error).toBeNull();
    expect(data?.base.success).toBe(true);

    expect(data?.gallery.id).toBe(gallery.id);
    expect(data?.gallery.name).toBe(gallery.name);
    expect(data?.gallery.description).toBe(gallery.description);
    expect(data?.gallery.userId).toBe(gallery.userId);
    expect(data?.gallery.createdAt).toBe(gallery.createdAt);
  });

  it("not found", async () => {
    const { data, error } = await backend.api.v1
      .galleries({ id: randomGalleryId() })
      .get();

    expect(error).toBeNull();
    expect(data?.base.success).toBe(false);
    expect(data?.base.msg).toBe(MSG_GALLERY_NOT_FOUND);
  });
});

describe("append images to gallery", async () => {
  it("success", async () => {
    const user = await randomUser();
    const galleryDB = await randomGallery({ token: user.token });
    const urls = randomImgUrls();

    const { data, error } = await apiAppendGallery({
      token: user.token,
      gallery: galleryDB,
      urls,
    });

    expect(error).toBeNull();
    expect(data?.base.success).toBe(true);

    const gotUrls: string[] = [];
    const result = await defaultDb.query.galleryImg.findMany({
      where: eq(galleryImg.galleryId, galleryDB.id),
      with: {
        img: {
          columns: {
            url: true,
          },
        },
      },
    });
    result.forEach((item) => {
      gotUrls.push(item.img.url);
    });
    expect(gotUrls).toEqual(urls);
  });
});
