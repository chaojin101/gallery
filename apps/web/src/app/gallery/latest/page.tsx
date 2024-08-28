"use client";

import { backend } from "@/backend";
import { MyPagination } from "@/components/my/my-pagination";
import { usePageSearchParams } from "@/use-hooks/use-page-search-params";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const Page = () => {
  const pageLimit = 5;
  const { page, setPage } = usePageSearchParams();

  const q = useQuery({
    queryKey: ["query latest gallery", page],
    queryFn: async () => {
      return await backend.api.v1.galleries.latest.get({
        query: {
          limit: pageLimit,
          page: page,
        },
      });
    },
  });

  const totalPages = Math.ceil(
    (q.data?.data?.data.totalCount || 0) / pageLimit
  );

  if (q.isLoading) {
    return <div>Loading...</div>;
  }

  if (q.error) {
    return <div>Error: {q.error.message}</div>;
  }

  return (
    <>
      <div className="grid-container">
        {q.data?.data?.data.galleries.map((gallery) => (
          <Link href={`/gallery/${gallery.id}`} key={gallery.id}>
            <div className="aspect-[3/4]">
              <img
                className="object-cover w-full h-full"
                src={gallery.imgUrl}
                alt=""
              />
            </div>
          </Link>
        ))}
      </div>
      <MyPagination page={page} setPage={setPage} totalPages={totalPages} />
    </>
  );
};

export default Page;
