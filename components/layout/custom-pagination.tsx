"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useEffect, useState } from "react";

export default function CustomPagination(props: {
  totalPage: number;
  onPageChange: (data: number) => void;
}) {
  const { totalPage, onPageChange } = props;
  const [page, setPage] = useState(1);

  useEffect(() => {
    onPageChange(page);
  }, [page]);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const halfWindow = Math.floor(5 / 2);
    let startPage = Math.max(2, page - halfWindow);
    let endPage = Math.min(totalPage - 1, page + halfWindow);

    if (endPage - startPage + 1 < 5) {
      if (page <= halfWindow) {
        endPage = Math.min(
          totalPage - 1,
          endPage + (5 - (endPage - startPage + 1))
        );
      } else if (page + halfWindow >= totalPage) {
        startPage = Math.max(2, startPage - (5 - (endPage - startPage + 1)));
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i} onClick={() => setPage(i)}>
          <PaginationLink className="cursor-pointer" isActive={page === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageNumbers;
  };
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            className="cursor-pointer"
            onClick={() => (page > 10 ? setPage(page - 10) : "")}
          >
            {/* <DoubleArrowLeftIcon /> */}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            className="cursor-pointer"
            onClick={() => (page > 1 ? setPage(page - 1) : "")}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className="cursor-pointer"
            onClick={() => setPage(1)}
            isActive={page === 1}
          >
            {1}
          </PaginationLink>
        </PaginationItem>
        {page > 4 && (
          <PaginationItem>
            <PaginationEllipsis
              className="cursor-pointer"
              onClick={() => setPage(page - 1)}
            />
          </PaginationItem>
        )}
        {renderPageNumbers()}
        {page < totalPage - 3 && (
          <PaginationItem>
            <PaginationEllipsis
              className="cursor-pointer"
              onClick={() => setPage(page + 1)}
            />
          </PaginationItem>
        )}
        {totalPage > 1 && (
          <PaginationItem>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => setPage(totalPage)}
              isActive={page === totalPage}
            >
              {totalPage}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            className="cursor-pointer"
            onClick={() => (page < totalPage ? setPage(page + 1) : "")}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            onClick={() => (page < totalPage - 10 ? setPage(page + 10) : "")}
          >
            {/* <DoubleArrowRightIcon /> */}
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
