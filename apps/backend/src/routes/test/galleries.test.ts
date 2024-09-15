import {
  MSG_GALLERY_NAME_EXIST,
  MSG_GALLERY_NOT_FOUND,
  MSG_UNAUTHENTICATED,
  MSG_UNAUTHORIZED,
} from "@gallery/common";
import { describe, expect, it } from "bun:test";
import { getImgsByGalleryId } from "db/sqls";

import { getGalleryByNameFromDB } from "db/sqls/gallery";
import { Static } from "elysia";
import { randomInt, randomUUID } from "test-tools";
import { TestClient } from "test-tools/common";
import {
  apiAddGallery,
  apiAppendGallery,
  randomGallery,
  randomGalleryWithImg,
} from "test-tools/galleries";
import { randomImgUrls } from "test-tools/img";
import { randomUser } from "test-tools/users";
import { gallerySchema } from "types/routes/galleries";

describe("POST /api/v1/galleries: add gallery", async () => {
  it("success", async () => {
    const user = await randomUser();

    const { data, error } = await apiAddGallery({ token: user.token });
    expect(error).toBeNull();

    if (!data) {
      throw new Error("apiAddGallery: empty data");
    }

    expect(data.base.success).toBe(true);
    expect(data.base.msg).toBe("");

    const gallery = await getGalleryByNameFromDB({
      name: data.data.gallery.name,
    });
    if (!gallery) {
      throw new Error("apiAddGallery: not new gallery in db");
    }

    expect(data.data.gallery.id).toBe(gallery.id);
    expect(data.data.gallery.name).toBe(gallery.name);
    expect(data.data.gallery.description).toBe(gallery.description);
    expect(data.data.gallery.userId).toBe(gallery.userId);
    expect(data.data.gallery.createdAt).toBe(gallery.createdAt.getTime());
    expect(data.data.gallery.updatedAt).toBe(gallery.updatedAt.getTime());
  });

  it("not authorized", async () => {
    const testCases = [
      {
        name: "empty token",
        token: "",
      },
      {
        name: "invalid token",
        token: "invalid",
      },
    ];

    for (const { name, token } of testCases) {
      const { data, error } = await apiAddGallery({ token: token });
      expect(error).toBeNull();

      if (!data) {
        throw new Error("apiAddGallery: empty data");
      }

      expect(data.base.success).toBe(false);
      expect(data.base.msg).toBe(MSG_UNAUTHENTICATED);

      expect(data.data.gallery.id).toBe("");
      expect(data.data.gallery.name).toBe("");
      expect(data.data.gallery.description).toBe("");
      expect(data.data.gallery.userId).toBe("");
      expect(data.data.gallery.createdAt).toBe(0);
      expect(data.data.gallery.updatedAt).toBe(0);
    }
  });

  it("duplicate name", async () => {
    const gallery = await randomGallery();

    const { data, error } = await apiAddGallery({
      name: gallery.name,
    });
    expect(error).toBeNull();

    expect(data?.base.success).toBe(false);
    expect(data?.base.msg).toBe(MSG_GALLERY_NAME_EXIST);

    expect(data?.data.gallery.id).toBe("");
    expect(data?.data.gallery.name).toBe("");
    expect(data?.data.gallery.description).toBe("");
    expect(data?.data.gallery.userId).toBe("");
    expect(data?.data.gallery.createdAt).toBe(0);
    expect(data?.data.gallery.updatedAt).toBe(0);
  });
});

describe("POST /api/v1/galleries/:id/append: append images to gallery", async () => {
  it("success", async () => {
    const user = await randomUser();
    const gallery = await randomGallery({ token: user.token });
    const urls = randomImgUrls();

    const { data, error } = await apiAppendGallery({
      token: user.token,
      galleryId: gallery.id,
      urls,
    });
    expect(error).toBeNull();

    expect(data?.base.success).toBe(true);
    expect(data?.base.msg).toBe("");

    expect(data?.data.gallery.id).toBe(gallery.id);
    expect(data?.data.gallery.name).toBe(gallery.name);
    expect(data?.data.gallery.description).toBe(gallery.description);
    expect(data?.data.gallery.userId).toBe(gallery.userId);
    expect(data?.data.gallery.createdAt).toBe(gallery.createdAt);
    expect(data?.data.gallery.updatedAt).toBe(gallery.updatedAt);

    expect(data?.data.imgs.length).toBe(urls.length);

    const imgs = await getImgsByGalleryId({ galleryId: gallery.id });
    for (let i = 0; i < urls.length; i++) {
      expect(imgs[i].url).toBe(urls[i]);
      expect(imgs[i].id).not.toBe("");
    }
  });

  it("unauthenticatied", async () => {
    const urls = randomImgUrls();

    const { data, error } = await TestClient.api.v1
      .galleries({ id: randomUUID() })
      .append.post(
        {
          urls,
        },
        {
          headers: {},
        }
      );
    expect(error).toBeNull();

    expect(data?.base.success).toBe(false);
    expect(data?.base.msg).toBe(MSG_UNAUTHENTICATED);
  });

  it("gallery not found", async () => {
    const user = await randomUser();
    const urls = randomImgUrls();

    const { data, error } = await apiAppendGallery({
      token: user.token,
      galleryId: randomUUID(),
      urls,
    });
    expect(error).toBeNull();

    expect(data?.base.success).toBe(false);
    expect(data?.base.msg).toBe(MSG_GALLERY_NOT_FOUND);
  });

  it("gallery unauthorized", async () => {
    const user = await randomUser();
    const gallery = await randomGallery();
    const urls = randomImgUrls();

    const { data, error } = await apiAppendGallery({
      token: user.token,
      galleryId: gallery.id,
      urls,
    });
    expect(error).toBeNull();

    expect(data?.base.success).toBe(false);
    expect(data?.base.msg).toBe(MSG_UNAUTHORIZED);
  });
});

describe("GET /api/v1/galleries/:id: get gallery by id", async () => {
  it("success: not imgs", async () => {
    const gallery = await randomGallery();

    const { data, error } = await TestClient.api.v1
      .galleries({ id: gallery.id })
      .get();
    expect(error).toBeNull();

    expect(data?.base.success).toBe(true);
    expect(data?.base.msg).toBe("");

    expect(data?.data.gallery.id).toBe(gallery.id);
    expect(data?.data.gallery.name).toBe(gallery.name);
    expect(data?.data.gallery.description).toBe(gallery.description);
    expect(data?.data.gallery.userId).toBe(gallery.userId);
    expect(data?.data.gallery.createdAt).toBe(gallery.createdAt);

    expect(data?.data.imgs.length).toBe(0);
  });

  it("success: with imgs", async () => {
    const { gallery, imgs } = await randomGalleryWithImg();

    const { data, error } = await TestClient.api.v1
      .galleries({ id: gallery.id })
      .get();
    expect(error).toBeNull();

    expect(data?.base.success).toBe(true);
    expect(data?.base.msg).toBe("");

    expect(data?.data.gallery.id).toBe(gallery.id);
    expect(data?.data.gallery.name).toBe(gallery.name);
    expect(data?.data.gallery.description).toBe(gallery.description);
    expect(data?.data.gallery.userId).toBe(gallery.userId);
    expect(data?.data.gallery.createdAt).toBe(gallery.createdAt);

    expect(data?.data.imgs.length).toBe(imgs.length);
    for (let i = 0; i < imgs.length; i++) {
      expect(data?.data.imgs[i].id).toBe(imgs[i].id);
      expect(data?.data.imgs[i].url).toBe(imgs[i].url);
    }
  });

  it("not found", async () => {
    const { data, error } = await TestClient.api.v1
      .galleries({ id: randomUUID() })
      .get();
    expect(error).toBeNull();

    expect(data?.base.success).toBe(false);
    expect(data?.base.msg).toBe(MSG_GALLERY_NOT_FOUND);
  });
});

describe("GET /api/v1/galleries/latest: get latest galleries", async () => {
  it("success", async () => {
    const count = randomInt();
    const galleries: Static<typeof gallerySchema>[] = [];
    const user = await randomUser();
    for (let i = 0; i < count; i++) {
      const gallery = await randomGallery({ token: user.token });
      galleries.push(gallery);
    }
    galleries.reverse();

    const { data, error } = await TestClient.api.v1.galleries.latest.get({
      query: { limit: count },
    });
    expect(error).toBeNull();

    expect(data?.base.success).toBe(true);
    expect(data?.base.msg).toBe("");

    expect(data?.data.galleries.length).toBe(count);
    for (let i = 0; i < count; i++) {
      expect(data?.data.galleries[i].galleryId).toBe(galleries[i].id);
      expect(data?.data.galleries[i].firstImgUrl).not.toBe("");
    }
  });
});
