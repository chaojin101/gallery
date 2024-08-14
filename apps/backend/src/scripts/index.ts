import { SQL } from "db/sql";

const main = async () => {
  const r = await SQL.getCollectionById({
    id: "3052dd0a-6478-4483-8d99-b15f7dafe1ca",
  });

  // console.log(r?.);

  process.exit(0);
};

main();
