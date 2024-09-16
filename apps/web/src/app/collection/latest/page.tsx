import { Suspense } from "react";
import { ClientPage } from "./client-page";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientPage />
    </Suspense>
  );
};

export default Page;
