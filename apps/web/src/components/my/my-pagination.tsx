import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Dispatch, SetStateAction } from "react";

type Props = {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
};

export const MyPagination = (props: Props) => {
  const getPageArr = () => {
    const pageArr = [];
    for (let i = -2; i <= 2; i++) {
      const newPage = props.page + i;
      if (1 <= newPage && newPage <= props.totalPages) {
        pageArr.push(newPage);
      }
    }
    return pageArr;
  };

  return (
    <Pagination className="pagination">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() =>
              props.setPage((page) => (1 < page ? page - 1 : page))
            }
          />
        </PaginationItem>
        {getPageArr().map((newPage) => (
          <PaginationItem key={newPage}>
            <PaginationLink
              onClick={() => props.setPage(newPage)}
              isActive={newPage === props.page}
            >
              {newPage}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              props.setPage((page) =>
                page < props.totalPages ? page + 1 : page
              )
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
