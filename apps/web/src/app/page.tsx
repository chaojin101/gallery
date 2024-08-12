import { redirect } from "next/navigation";

const page = () => {
  redirect("/gallery/latest");
  return <div>page</div>;
};

export default page;
