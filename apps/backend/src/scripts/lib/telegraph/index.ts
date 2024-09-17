import { treaty } from "@elysiajs/eden";
import got from "got";
import { app } from "index";
import parse from "node-html-parser";
import { downloadAndUpload } from "../upload";
import { Telegraph } from "./telegraph";

export const backend = treaty<typeof app>("https://api.girli.xyz");

const main = async () => {
  const url = `
https://telegra.ph/YeEunSidam-001-08-30
`;
  const t = await Telegraph.create({ url });

  for (let i = 0; i < t.imgUrls.length; i++) {
    console.log(`${t.name} - Downloading ${i + 1}/${t.imgUrls.length}...`);
    const newImgUrl = await downloadAndUpload({ imgUrl: t.imgUrls[i] });
    t.imgUrls[i] = newImgUrl;
  }
  // console.log(`t.imgUrls:`, t.imgUrls);

  await addGallery({ name: t.name, urls: t.imgUrls });

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
    console.log(`r2.data: ${JSON.stringify(r2.data)}`);
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
