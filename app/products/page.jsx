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

  console.log("Current Redux state:", { value, pages });
  console.log("Current products state:", products);

  useEffect(() => {
    const fetchallproducts = async () => {
      try {
        console.log("Fetching products for page:", value);
        console.log(
          "API URL:",
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/products?page=${value}`
        );

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/products?page=${value}`,
          { cache: "no-store" }
        );

        console.log("Response status:", res.status);

        if (!res.ok) {
          console.error("Response not ok:", res.status, res.statusText);
          return;
        }

        const data = await res.json();
        console.log("Fetched data:", data);
        console.log("Products count:", data.products?.length || 0);

        setProducts(data.products || []);
        dispatch(addpages(data.pages || 0));
        if (value > pages) dispatch(addpage(1));
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchallproducts();
  }, [value, dispatch, pages]);

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
          <p className="text-gray-600">Discover our collection</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {console.log("Rendering products:", products)}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <Productcard products={products} />
        )}
      </div>

      {/* Pagination */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Pagination page={value} />
      </div>
    </div>
  );
};

export default Productpage;
