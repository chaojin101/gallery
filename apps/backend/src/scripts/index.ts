import fs from "fs";
import got from "got";
import parse from "node-html-parser";
import { addGallery } from "./lib";
import { upload } from "./lib/upload";

const main = async () => {
  await add_e6_1_to_gallery();
  process.exit(0);
};

const add_e6_1_to_gallery = async () => {
  const folder = `./src/scripts/img-set/e6/e6-1`;
  const files = fs.readdirSync(folder);

  files.sort();

  const imgUrls: string[] = [];

  for (const file of files) {
    const filePath = `${folder}/${file}`;
    const url = await upload({ filename: filePath });

    console.log(`Uploading ${file}`);

    imgUrls.push(url);
  }

  const name = "糯美子-e6-1";
  await addGallery({ name, urls: imgUrls });
};

const rename_e6_2_to_e6_5 = async () => {
  const indexes = [3, 5];
  for (let i of indexes) {
    const folder = `./src/scripts/img-set/e6/e6-${i}`;
    const files = fs.readdirSync(folder);

    files.sort();

    for (const file of files) {
      const oldName = `${folder}/${file}`;
      const newName = `${folder}/${file.split("_")[1].split(".")[0].padStart(5, "0")}.jpg`;

      console.log(`oldName: ${oldName}`);
      console.log(`newName: ${newName}`);

      console.log();

      fs.renameSync(oldName, newName);
    }

    // break;
  }
};

const upload_e6_1 = async () => {
  const folder = "./src/scripts/img-set/e6";
  const files = fs.readdirSync(folder);

  const imgUrls: string[] = [];

  for (const file of files) {
    const filePath = `${folder}/${file}`;
    const url = await upload({ filename: filePath });

    console.log(`Uploading ${filePath} to ${url}`);

    imgUrls.push(url);
  }

  const name = "糯美子-e6";
  await addGallery({ name, urls: imgUrls });

  console.log("Done!");
};

const rename_e6_1 = async () => {
  const folder = "./src/scripts/img-set/e6/e6-1";
  const files = fs.readdirSync(folder);

  files.sort();

  for (const file of files) {
    const oldName = `${folder}/${file}`;
    const newName = `${folder}/${file.split(".")[0].padStart(5, "0")}.jpg`;

    console.log(`oldName: ${oldName}`);
    console.log(`newName: ${newName}`);

    console.log();

    // fs.renameSync(oldName, newName);
  }
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

main();
