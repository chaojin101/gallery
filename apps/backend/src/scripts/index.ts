import { randomGalleryWithImg } from "test-tools/galleries";

const main = async () => {
  const result = await randomGalleryWithImg();

  console.log(result.data?.base.success);

  process.exit(0);
};

main();
