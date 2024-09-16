import {
  MSG_COLLECTION_NAME_EXIST,
  MSG_COLLECTION_NOT_FOUND,
  MSG_UNAUTHENTICATED,
  MSG_UNAUTHORIZED,
} from "@gallery/common";
import { describe, expect, it } from "bun:test";
import { getImgsByCollectionId } from "db/sqls";
import { getCollectionByIdFromDB } from "db/sqls/collection";
import { Static } from "elysia";
import { randomInt, randomUUID } from "test-tools";

import {
  apiAddCollection,
  apiAppendToCollection,
  apiGetCollectionById,
  apiGetCurrentUserCollections,
  randomCollection,
  randomCollectionWithImgs,
} from "test-tools/collections";
import { TestClient } from "test-tools/common";
import { randomGalleryWithImg } from "test-tools/galleries";
import { randomUser } from "test-tools/users";
import { collectionWithImgsSchema } from "types/routes/collections";

describe("POST /api/v1/collections - add collection", async () => {
  it("success", async () => {
    const user = await randomUser();

    const { data, error } = await apiAddCollection({ token: user.token });
    expect(error).toBeNull();

    if (!data) {
      throw new Error("apiAddCollection: empty data");
    }

    expect(data.base.success).toBe(true);
    expect(data.base.msg).toBe("");

    const collection = await getCollectionByIdFromDB({
      id: data.data.collection.id,
    });
    if (!collection) {
      throw new Error("apiAddCollection: not new collection added in db");
    }

    expect(data.data.collection.id).toBe(collection.id);
    expect(data.data.collection.name).toBe(collection.name);
    expect(data.data.collection.description).toBe(collection.description);
    expect(data.data.collection.userId).toBe(collection.userId);
    expect(data.data.collection.createdAt).toBe(collection.createdAt.getTime());
    expect(data.data.collection.updatedAt).toBe(collection.updatedAt.getTime());
  });

  it("not authenticated", async () => {
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
      const { data, error } = await apiAddCollection({ token: token });
      expect(error).toBeNull();

      if (!data) {
        throw new Error("apiAddCollection: empty data");
      }

      expect(data.base.success).toBe(false);
      expect(data.base.msg).toBe(MSG_UNAUTHENTICATED);
    }
  });

  it("duplicate name", async () => {
    const collection = await randomCollection();

    const { data, error } = await apiAddCollection({
      name: collection.name,
    });
    expect(error).toBeNull();

    expect(data?.base.success).toBe(false);
    expect(data?.base.msg).toBe(MSG_COLLECTION_NAME_EXIST);

    expect(data?.data.collection.id).toBe("");
    expect(data?.data.collection.name).toBe("");
    expect(data?.data.collection.description).toBe("");
    expect(data?.data.collection.userId).toBe("");
    expect(data?.data.collection.createdAt).toBe(0);
    expect(data?.data.collection.updatedAt).toBe(0);
  });
});

describe("POST /api/v1/collections/append - append imgs to collection", async () => {
  it("success", async () => {
    const user = await randomUser();

    const collection = await randomCollection({ token: user.token });

    const gallery = await randomGalleryWithImg();

    const { data, error } = await apiAppendToCollection({
      collectionId: collection.id,
      token: user.token,
      imgIds: gallery.imgs.map((img) => img.id),
    });
    expect(error).toBeNull();

    if (!data) {
      throw new Error("apiAddCollection: empty data");
    }

    expect(data.base.success).toBe(true);
    expect(data.base.msg).toBe("");

    const imgs = await getImgsByCollectionId({ collectionId: collection.id });

    expect(data.data.collection.imgs.length).toBe(gallery.imgs.length);
    for (let i = 0; i < imgs.length; i++) {
      expect(data.data.collection.imgs[i].id).toBe(imgs[i].id);
      expect(data.data.collection.imgs[i].url).toBe(imgs[i].url);
    }
  });

  it("not authenticated", async () => {
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

    const collection = await randomCollection();

    for (const { name, token } of testCases) {
      const { data, error } = await apiAppendToCollection({
        collectionId: collection.id,
        token: token,
      });
      expect(error).toBeNull();

      if (!data) {
        throw new Error("apiAddCollection: empty data");
      }

      expect(data.base.success).toBe(false);
      expect(data.base.msg).toBe(MSG_UNAUTHENTICATED);
    }
  });

  it("collection not found", async () => {
    const user = await randomUser();
    const { data, error } = await apiAppendToCollection({
      collectionId: randomUUID(),
      token: user.token,
    });
    expect(error).toBeNull();

    expect(data?.base.success).toBe(false);
    expect(data?.base.msg).toBe(MSG_COLLECTION_NOT_FOUND);
  });

  it("not authorized to append other user's collection", async () => {
    const collection = await randomCollection();
    const user = await randomUser();

    const { data, error } = await apiAppendToCollection({
      collectionId: collection.id,
      token: user.token,
    });
    expect(error).toBeNull();

    expect(data?.base.success).toBe(false);
    expect(data?.base.msg).toBe(MSG_UNAUTHORIZED);
  });
});

describe("POST /api/v1/collections/currentUser - get current user's collections", async () => {
  it("success", async () => {
    const user = await randomUser();

    const collections: Static<typeof collectionWithImgsSchema>[] = [];
    for (let i = 0; i < 2; i++) {
      const collection = await randomCollectionWithImgs({ token: user.token });
      collections.push(collection);
    }
    collections.reverse();

    const { data, error } = await apiGetCurrentUserCollections({
      token: user.token,
    });
    expect(error).toBeNull();

    if (!data) {
      throw new Error("apiGetCurrentUserCollections: empty data");
    }

    expect(data.base.success).toBe(true);
    expect(data.base.msg).toBe("");

    expect(data.data.collections.length).toBe(collections.length);
    for (let i = 0; i < collections.length; i++) {
      expect(data.data.collections[i].id).toBe(collections[i].id);
      expect(data.data.collections[i].name).toBe(collections[i].name);
      expect(data.data.collections[i].description).toBe(
        collections[i].description
      );
      expect(data.data.collections[i].userId).toBe(collections[i].userId);
      expect(data.data.collections[i].createdAt).toBe(collections[i].createdAt);
      expect(data.data.collections[i].updatedAt).toBe(collections[i].updatedAt);
    }
  });

  it("not authenticated", async () => {
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
      const { data, error } = await apiGetCurrentUserCollections({
        token: token,
      });
      expect(error).toBeNull();

      if (!data) {
        throw new Error("apiGetCurrentUserCollections: empty data");
      }

      expect(data.base.success).toBe(false);
      expect(data.base.msg).toBe(MSG_UNAUTHENTICATED);
    }
  });
});

describe("GET /api/v1/collections/:id - get collection by id", async () => {
  it("success", async () => {
    const collection = await randomCollectionWithImgs();

    const { data, error } = await apiGetCollectionById({
      collectionId: collection.id,
    });
    expect(error).toBeNull();

    if (!data) {
      throw new Error("apiGetCollectionById: empty data");
    }

    expect(data.base.success).toBe(true);
    expect(data.base.msg).toBe("");

    expect(data.data.collection.id).toBe(collection.id);
    expect(data.data.collection.userId).toBe(collection.userId);
    expect(data.data.collection.name).toBe(collection.name);
    expect(data.data.collection.description).toBe(collection.description);
    expect(data.data.collection.userId).toBe(collection.userId);
    expect(data.data.collection.createdAt).toBe(collection.createdAt);
    expect(data.data.collection.updatedAt).toBe(collection.updatedAt);

    expect(data.data.collection.imgs.length).toBe(collection.imgs.length);
    for (let i = 0; i < collection.imgs.length; i++) {
      expect(data.data.collection.imgs[i].id).toBe(collection.imgs[i].id);
      expect(data.data.collection.imgs[i].url).toBe(collection.imgs[i].url);
    }
  });

  it("collection not found", async () => {
    const { data, error } = await apiGetCollectionById({
      collectionId: randomUUID(),
    });
    expect(error).toBeNull();

    expect(data?.base.success).toBe(false);
    expect(data?.base.msg).toBe(MSG_COLLECTION_NOT_FOUND);
  });
});

describe("GET /api/v1/collections/latest: get latest collections", async () => {
  it("success", async () => {
    const count = randomInt();
    const collections: Static<typeof collectionWithImgsSchema>[] = [];
    const user = await randomUser();

    for (let i = 0; i < count; i++) {
      const collection = await randomCollectionWithImgs({ token: user.token });
      collections.push(collection);
    }
    collections.reverse();

    const { data, error } = await TestClient.api.v1.collections.latest.get({
      query: { limit: count },
    });
    expect(error).toBeNull();

    expect(data?.base.success).toBe(true);
    expect(data?.base.msg).toBe("");

    expect(data?.data.collections.length).toBe(count);
    for (let i = 0; i < count; i++) {
      expect(data?.data.collections[i].id).toBe(collections[i].id);
      expect(data?.data.collections[i].imgs.length).toBe(1);
    }
  });
});
