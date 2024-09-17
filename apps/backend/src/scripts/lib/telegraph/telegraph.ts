import parse from "node-html-parser";

export class Telegraph {
  name: string;
  imgUrls: string[];

  static async create(options: { url: string }) {
    let { url } = options;

    url = url.trim();
    const html = await this.getHTML({ url });
    const root = parse(html);
    let name = options.url.split("https://telegra.ph/").at(-1) || "";
    name = decodeURI(name).trim();
    console.log(`name: ${name}`);

    const imgUrls = root.querySelectorAll("img").map((img) => {
      if (img.attributes.src.startsWith("http")) {
        return img.attributes.src;
      } else {
        return `https://telegra.ph${img.attributes.src}`;
      }
    });

    return new Telegraph({ name, imgUrls });
  }

  private static async getHTML(options: { url: string }) {
    let { url } = options;

    const response = await fetch(url);
    const html = await response.text();

    return html;
  }

  private constructor(options: { name: string; imgUrls: string[] }) {
    this.name = options.name;
    this.imgUrls = options.imgUrls;
  }
}
