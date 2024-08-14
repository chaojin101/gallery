import { backend } from "test-tools";

const main = async () => {
  const r = await backend.api.v1.collections.latest.get({ query: {} });

  console.log(r);

  process.exit(0);
};

main();
