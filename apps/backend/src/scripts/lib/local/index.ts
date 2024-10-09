import fs from "fs";
import { addGallery } from "..";
import { upload } from "../../lib/upload";

const uploadLocalImgSet = async (options: { folder: string }) => {
  // const folder = `./src/scripts/img-set/e6/e6-1`;
  const { folder } = options;

  const name = folder.split("/").pop();
  if (name === undefined) {
    throw new Error("Invalid folder name");
  }

  const files = fs.readdirSync(folder);

  files.sort();

  const imgUrls: string[] = [];

  for (const file of files) {
    const filePath = `${folder}/${file}`;
    const url = await upload({ filename: filePath });

    console.log(`Uploading ${file}`);

    imgUrls.push(url);
  }

  await addGallery({ name, urls: imgUrls });
};
