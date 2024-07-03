"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  nextPage,
  prevPage,
} from "../../app/globalstore/reduxslices/pageSlice/Pageslice";

const Pagination = ({ page }) => {
  const dispatch = useDispatch();
  const { pages } = useSelector((state) => state.page);

  return (
    <div>
      <section className="border container mx-auto flex justify-center items-center my-8 w-fit rounded-2xl">
        <button
          className="mr-1 px-3 py-1 border  rounded-2xl bg-black hover:bg-blue-500 text-white"
          onClick={() => dispatch(prevPage())}
        >
          Prev
        </button>
        <span className="mx-2">
          {page > pages ? pages : page} of {pages}
        </span>
        <button
          className="ml-1 px-3 py-1 border rounded-2xl bg-black hover:bg-blue-500 text-white"
          onClick={() => dispatch(nextPage())}
        >
          Next
        </button>
      </section>
    </div>
  );
};

export default Pagination;
