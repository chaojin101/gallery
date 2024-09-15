import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-typebox";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashedPassword").notNull(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  galleries: many(gallery),
  collections: many(collection),
}));

export const gallery = pgTable("gallery", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const galleryRelations = relations(gallery, ({ one, many }) => ({
  user: one(user, {
    fields: [gallery.userId],
    references: [user.id],
  }),
  galleryImgs: many(galleryImg),
}));

export const img = pgTable("img", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull(),
});

export const imgRelations = relations(img, ({ one, many }) => ({
  galleryImgs: many(galleryImg),
}));

export const galleryImg = pgTable(
  "galleryImg",
  {
    galleryId: uuid("galleryId").notNull(),
    imgId: uuid("imgId").notNull(),
    order: integer("order").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.galleryId, table.imgId, table.order] }),
  })
);

export const galleryImgRelations = relations(galleryImg, ({ one, many }) => ({
  gallery: one(gallery, {
    fields: [galleryImg.galleryId],
    references: [gallery.id],
  }),
  img: one(img, {
    fields: [galleryImg.imgId],
    references: [img.id],
  }),
}));

export const tag = pgTable("tag", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").unique().notNull(),
});
export type Tag = typeof tag.$inferSelect;

export const galleryTag = pgTable(
  "galleryTag",
  {
    galleryId: uuid("galleryId").notNull(),
    tagId: uuid("tagId").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.galleryId, table.tagId] }),
  })
);
export type GalleryTag = typeof galleryTag.$inferSelect;

export const galleryTagRelations = relations(galleryTag, ({ one, many }) => ({
  gallery: one(gallery, {
    fields: [galleryTag.galleryId],
    references: [gallery.id],
  }),
  tag: one(tag, {
    fields: [galleryTag.tagId],
    references: [tag.id],
  }),
}));

export const collection = pgTable("collection", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
export type Collection = typeof collection.$inferSelect;
export const collectionSchema = createSelectSchema(collection);

export const collectionRelations = relations(collection, ({ one, many }) => ({
  user: one(user, {
    fields: [collection.userId],
    references: [user.id],
  }),
  collectionImgs: many(collectionImg),
}));

export const collectionImg = pgTable(
  "collectionImg",
  {
    collectionId: uuid("collectionId").notNull(),
    imgId: uuid("imgId").notNull(),
    order: integer("order").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.collectionId, table.imgId, table.order] }),
  })
);
export type CollectionImg = typeof collectionImg.$inferSelect;

export const collectionImgRelations = relations(
  collectionImg,
  ({ one, many }) => ({
    collection: one(collection, {
      fields: [collectionImg.collectionId],
      references: [collection.id],
    }),
    img: one(img, {
      fields: [collectionImg.imgId],
      references: [img.id],
    }),
  })
);

export const likeGallery = pgTable(
  "likeGallery",
  {
    userId: uuid("userId").notNull(),
    galleryId: uuid("galleryId").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.galleryId] }),
  })
);
export type LikeGallery = typeof likeGallery.$inferSelect;

export const likeGalleryRelations = relations(likeGallery, ({ one, many }) => ({
  user: one(user, {
    fields: [likeGallery.userId],
    references: [user.id],
  }),
  gallery: one(gallery, {
    fields: [likeGallery.galleryId],
    references: [gallery.id],
  }),
}));

export const likeCollection = pgTable(
  "likeCollection",
  {
    userId: uuid("userId").notNull(),
    collectionId: uuid("collectionId").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.collectionId] }),
  })
);
export type LikeCollection = typeof likeCollection.$inferSelect;

export const likeCollectionRelations = relations(
  likeCollection,
  ({ one, many }) => ({
    user: one(user, {
      fields: [likeCollection.userId],
      references: [user.id],
    }),
    collection: one(collection, {
      fields: [likeCollection.collectionId],
      references: [collection.id],
    }),
  })
);
