"use client";
import Productcard from "@/components/productcard/Productcard";
import React from "react";
import { useState, useEffect } from "react";
import Pagination from "@/components/pagination/Pagination";
import { useSelector, useDispatch } from "react-redux";
import {
  addpages,
  addpage,
} from "../globalstore/reduxslices/pageSlice/Pageslice";

const Productpage = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const { value, pages } = useSelector((state) => state.page);

  useEffect(() => {
    const fetchallproducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/products?page=${value}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setProducts(data.products);
        dispatch(addpages(data.pages));
        if (value > pages) dispatch(addpage(1));
      } catch (error) {
        console.log(error);
      }
    };
    fetchallproducts();
  }, [value]);

  return (
    <div>
      <Productcard products={products} />
      <Pagination page={value} />
    </div>
  );
};

export default Productpage;
