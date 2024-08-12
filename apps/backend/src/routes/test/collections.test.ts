// // test/index.test.ts
// import { describe, expect, it } from "bun:test";
// import {
//   apiAddGallery,
//   randomGallery,
//   randomGalleryDescription,
//   randomGalleryName,
// } from "test-tools/galleries";
// import { randomUser } from "test-tools/users";
// import { MSG_GALLERY_NAME_EXIST } from "types/routes/galleries";

// describe("add collection", async () => {
//   it("success", async () => {
//     const user = await randomUser();
//     const name = randomGalleryName();
//     const description = randomGalleryDescription();

//     const { data, error } = await apiAddGallery({
//       token: user.token,
//       name,
//       description,
//     });

//     expect(error).toBeNull();
//     expect(data?.base.success).toBe(true);

//     expect(data?.gallery.id).not.toBe("");
//     expect(data?.gallery.name).toBe(name);
//     expect(data?.gallery.description).toBe(description);
//     expect(data?.gallery.userId).toBe(user.id);
//   });

//   it("duplicate name", async () => {
//     const gallery = await randomGallery();

//     const { data, error } = await apiAddGallery({
//       name: gallery.name,
//     });

//     expect(error).toBeNull();
//     expect(data?.base.success).toBe(false);
//     expect(data?.base.msg).toBe(MSG_GALLERY_NAME_EXIST);

//     expect(data?.gallery.id).toBe("");
//   });
// });
