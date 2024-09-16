import { redirect } from "next/navigation";

const Page = () => {
  redirect("/gallery/latest");
  return <div>page</div>;
};

export default Page;
