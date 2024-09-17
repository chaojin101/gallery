import { faker } from "@faker-js/faker";
import axios from "axios";
import FormData from "form-data";
import { createReadStream, createWriteStream } from "fs";
import { unlink } from "fs/promises";
import stream from "stream";
import util from "util";
const pipeline = util.promisify(stream.pipeline);

export const downloadAndUpload = async (options: { imgUrl: string }) => {
  const { imgUrl } = options;

  const tempFilename = `temp-${faker.string.uuid()}.png`;

  await download({ url: imgUrl, filename: tempFilename });
  const returnedUrl = await upload({ filename: tempFilename });

  await unlink(tempFilename);

  return returnedUrl;
};

export const download = async (options: { url: string; filename: string }) => {
  const { url, filename } = options;

  const response = await axios.get(url, { responseType: "stream" });

  const fileStream = createWriteStream(filename);
  await pipeline(response.data, fileStream);
};

export const upload = async (options: { filename: string }) => {
  const { filename } = options;

  const uploadUrl = "https://pic.moebox.io/json";

  const formData = new FormData();
  formData.append("source", createReadStream(filename));
  formData.append("type", "file");
  formData.append("action", "upload");
  formData.append("timestamp", `${new Date().getTime()}`);
  formData.append("auth_token", "d4ddb3d6136bd88274534ea8cf1837f9c90ce393");
  formData.append("expiration", "");
  formData.append("nsfw", "0");
  formData.append("mimetype", "image/png");

  const resp = await axios.post(uploadUrl, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Cookie: `PHPSESSID=70535573c37e801093ddb67e9cf9380f; _pk_id.7.ec17=02d663642c2eb6a3.1726365741.; CHV_COOKIE_LAW_DISPLAY=0; KEEP_LOGIN=z552%3A19fc72aedbac6cf6a33a432f9ea06d05fd79047fd0d9a443e5175afb1945f63eb98e8e51a98e47c8cdaf8f1b3e0341766a37d15f36d4ed737af73efbc73c48ffab6406ee4779f670468159ea5f6d669718bdc26c7af9acc5db0815072a5c2bfe4a7feb384b%3A1726365902; _pk_ref.7.ec17=%5B%22%22%2C%22%22%2C1726523073%2C%22https%3A%2F%2Fimage.acg.lol%2F%22%5D; _pk_ses.7.ec17=1`,
    },
  });

  return resp.data["image"]["image"]["url"] as string;
};
