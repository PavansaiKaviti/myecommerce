"use client";
import Productcard from "@/components/productcard/Productcard";
import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Pagination from "@/components/pagination/Pagination";
import { useSelector, useDispatch } from "react-redux";
import {
  addpages,
  addpage,
} from "../globalstore/reduxslices/pageSlice/Pageslice";
import Link from "next/link";

const Productpage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { value, pages } = useSelector((state) => state.page);

  console.log("Current Redux state:", { value, pages });
  console.log("Current products state:", products);

  useEffect(() => {
    const fetchallproducts = async () => {
      setLoading(true);
      try {
        // Get search query from URL
        const search = searchParams.get("search") || "";
        setSearchQuery(search);

        console.log("Fetching products for page:", value, "search:", search);

        const url = new URL(`${process.env.NEXT_PUBLIC_DOMAIN_API}/products`);
        url.searchParams.set("page", value.toString());
        if (search) {
          url.searchParams.set("search", search);
        }

        console.log("API URL:", url.toString());

        const res = await fetch(url.toString(), { cache: "no-store" });

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
      } finally {
        setLoading(false);
      }
    };
    fetchallproducts();
  }, [value, dispatch, pages, searchParams]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded mb-3 w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Products"}
          </h1>
          <p className="text-gray-600">
            {searchQuery
              ? `Found ${products.length} product${
                  products.length !== 1 ? "s" : ""
                } matching your search`
              : "Discover our collection"}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {console.log("Rendering products:", products)}
        {loading ? (
          <LoadingSkeleton />
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <img
                src="/images/noproduct.jpg"
                alt="No products"
                className="w-48 h-48 mx-auto mb-4 opacity-50"
              />
              <p className="text-gray-500 text-lg">
                {searchQuery
                  ? `No products found for "${searchQuery}"`
                  : "No products found"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {searchQuery
                  ? "Try different keywords or browse all products"
                  : "Check back later for new arrivals"}
              </p>
              {searchQuery && (
                <Link
                  href="/products"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View All Products
                </Link>
              )}
            </div>
          </div>
        ) : (
          <Productcard products={products} />
        )}
      </div>

      {/* Pagination - Only show when not loading and products exist */}
      {!loading && products.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <Pagination page={value} />
        </div>
      )}
    </div>
  );
};

export default Productpage;
