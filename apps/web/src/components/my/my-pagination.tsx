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
  pageArr: number[];
};

const MyPagination = ({ page, setPage, pageArr }: Props) => {
  return (
    <Pagination className="pagination">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage((page) => (page > 1 ? page - 1 : page))}
          />
        </PaginationItem>
        {pageArr.map((newPage) => (
          <PaginationItem key={newPage}>
            <PaginationLink
              onClick={() => setPage(newPage)}
              isActive={newPage === page}
            >
              {newPage}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext onClick={() => setPage((page) => page + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default MyPagination;
