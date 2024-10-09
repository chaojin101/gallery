import { treaty } from "@elysiajs/eden";
import { app } from "../../app";

const backend = treaty<typeof app>("https://api.girli.xyz");

export const addGallery = async (options: { name: string; urls: string[] }) => {
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
