"use client";

import { backend } from "@/backend";
import MyPagination from "@/components/my/my-pagination";
import { usePageSearchParams } from "@/use-hooks/use-page-search-params";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const page = () => {
  const { page, setPage, pageArr } = usePageSearchParams();

  const q = useQuery({
    queryKey: ["query latest gallery", page],
    queryFn: async () => {
      return await backend.api.v1.galleries.latest.get({
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
        {q.data?.data?.galleries.map((gallery) => (
          <Link href={`/gallery/${gallery.g.id}`} key={gallery.g.id}>
            <div className="aspect-[3/4]">
              <img
                className="object-cover w-full h-full"
                src={
                  gallery.imgs[0]?.url ??
                  "https://fastly.picsum.photos/id/416/640/480.jpg?hmac=QqXRwVsFcVlllCZqNvIB562qP3rlWQoZCq9ULdcaGZ4"
                }
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
