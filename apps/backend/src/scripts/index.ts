import got from "got";
import parse from "node-html-parser";
import { backend } from "test-tools";

const main = async () => {
  const url =
    "https://telegra.ph/%E9%98%BF%E5%8C%85%E4%B9%9F%E6%98%AF%E5%85%94%E5%A8%98-%E5%8A%A0%E5%86%95%E5%9B%BE-%E4%BC%98%E8%8F%88-28P-536MB-08-25";

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
    email: "x@x.com",
    password: "666666",
  });

  const token = r1.data?.data.token;
  if (!token) {
    console.error("Failed to get token");
    process.exit(1);
  }
  const authorization = `Bearer ${token}`;

  const r2 = await backend.api.v1.galleries.index.post(
    {
      name: options.name,
      description: "",
    },
    {
      headers: {
        authorization,
      },
    }
  );
  const gid = r2.data?.gallery.id;
  if (!gid) {
    console.error("Failed to create gallery");
    process.exit(1);
  }

  const r3 = await backend.api.v1
    .galleries({ id: gid })
    .append.post({ urls: options.urls }, { headers: { authorization } });
};

main();
