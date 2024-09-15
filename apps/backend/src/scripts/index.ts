import { treaty } from "@elysiajs/eden";
import got from "got";
import parse from "node-html-parser";
import { app } from "../index";

export const backend = treaty<typeof app>("https://api.girli.xyz");

const main = async () => {
  const url = `
https://telegra.ph/Quan%E5%86%89%E6%9C%89%E7%82%B9%E9%A5%BF-%E7%BA%B3%E8%A5%BF%E5%A6%B2-46P-06-13
`;

  const { name, imgUrls } = await parseCosPlayNSFWTelegrahUrl({ url });

  await addGallery({ name, urls: imgUrls });

  process.exit(0);
};

const parseCosPlayNSFWTelegrahUrl = async (options: { url: string }) => {
  options.url = decodeURI(options.url);

  const r1 = await got.get(options.url);
  const root = parse(r1.body);
  const name = options.url.split("https://telegra.ph/").at(-1) || "";
  const imgUrls = root
    .querySelectorAll("img")
    .map((img) => `https://telegra.ph${img.attributes.src}`);
  return { name, imgUrls };
};

const addGallery = async (options: { name: string; urls: string[] }) => {
  const r1 = await backend.api.v1.users["sign-in"].post({
    email: "chaojin101@gmail.com",
    password: "111111",
  });

  const token = r1.data?.data.token;
  if (!token) {
    console.error("Failed to get token");
    process.exit(1);
  }

  const r2 = await backend.api.v1.galleries.post(
    {
      name: options.name,
      description: "",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const gid = r2.data?.data.gallery.id;
  if (!gid) {
    console.error("Failed to create gallery");
    process.exit(1);
  }

  const r3 = await backend.api.v1
    .galleries({ id: gid })
    .append.post(
      { urls: options.urls },
      { headers: { Authorization: `Bearer ${token}` } }
    );
};

main();
