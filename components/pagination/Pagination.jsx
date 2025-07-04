"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import {
  nextPage,
  prevPage,
  addpage,
} from "../../app/globalstore/reduxslices/pageSlice/Pageslice";
import { FaChevronLeft, FaChevronRight } from "@/components/icons/Icons";

const Pagination = ({ page }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pages } = useSelector((state) => state.page);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      dispatch(addpage(newPage));

      // Update URL with search parameters preserved
      const params = new URLSearchParams(searchParams);
      params.set("page", newPage.toString());
      router.push(`/products?${params.toString()}`);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (pages <= maxVisiblePages) {
      // Show all pages if total pages is 5 or less
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show current page with surrounding pages
      let startPage = Math.max(1, page - 2);
      let endPage = Math.min(pages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  if (pages <= 1) {
    return null; // Don't show pagination if there's only one page or no pages
  }

  return (
    <div className="flex justify-center items-center my-8">
      <nav className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
        {/* Previous Button */}
        <button
          className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <FaChevronLeft className="text-gray-600" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {renderPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                pageNum === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= pages}
          aria-label="Next page"
        >
          <FaChevronRight className="text-gray-600" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
