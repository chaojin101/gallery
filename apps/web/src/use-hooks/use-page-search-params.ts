import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const usePageSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageSearchParam = parseInt(searchParams.get("page") || "1");

  const [page, setPage] = useState(pageSearchParam || 1);
  const [pageArr, setPageArr] = useState<number[]>([]);

  useEffect(() => {
    const newPageArr = [];
    for (let i = -2; i <= 2; i++) {
      const newPage = i + page;
      if (newPage >= 1) {
        newPageArr.push(i + page);
      }
    }
    setPageArr(newPageArr);
  }, [page]);

  useEffect(() => {
    const u = new URLSearchParams(window.location.search);
    u.set("page", page.toString());

    const url = `${pathname}?${u.toString()}`;
    router.push(url);
  }, [page]);

  return { page, setPage, pageArr };
};
