import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const usePageSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const PAGE_KEY = "page";

  const pageSearchParam = parseInt(searchParams.get(PAGE_KEY) || "1");

  const [page, setPage] = useState(pageSearchParam || 1);

  useEffect(() => {
    const u = new URLSearchParams(window.location.search);
    u.set(PAGE_KEY, page.toString());

    const url = `${pathname}?${u.toString()}`;
    router.push(url);
  }, [page, pathname]);

  return { page, setPage };
};
