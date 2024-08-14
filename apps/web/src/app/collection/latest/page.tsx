"use client";

import { backend } from "@/backend";
import MyPagination from "@/components/my/my-pagination";
import { usePageSearchParams } from "@/use-hooks/use-page-search-params";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const page = () => {
  const { page, setPage, pageArr } = usePageSearchParams();

  const q = useQuery({
    queryKey: ["query latest collection", page],
    queryFn: async () => {
      return await backend.api.v1.collections.latest.get({
        query: {
          limit: 12,
          page: page,
        },
      });
    },
  });

  if (q.isLoading) {
    return <div>Loading...</div>;
  }

  if (q.error) {
    return <div>Error: {q.error.message}</div>;
  }

  return (
    <>
      <div className="grid-container">
        {q.data?.data?.data.collections.map((c) => (
          <Link href={`/collection/${c.id}`} key={c.id}>
            <div className="aspect-[3/4]">
              <img
                className="object-cover w-full h-full"
                src={c.imgUrl}
                alt=""
              />
            </div>
          </Link>
        ))}
      </div>
      <MyPagination page={page} setPage={setPage} pageArr={pageArr} />
    </>
  );
};

export default page;
