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
      console.log("🔄 STARTING FETCH - Setting loading to true");
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

        console.log(
          "✅ Data set successfully - products:",
          data.products?.length || 0
        );
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        console.log("✅ FETCH COMPLETE - Setting loading to false");
        setLoading(false);
      }
    };
    fetchallproducts();
  }, [value, dispatch, pages, searchParams]);

  // Loading skeleton component
  const LoadingSkeleton = () => {
    console.log("Rendering products page skeleton");
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden animate-pulse shadow-md"
            style={{ minHeight: "400px" }}
          >
            {/* Product Image Skeleton */}
            <div className="relative h-64 bg-gray-300 dark:bg-gray-600"></div>

            {/* Product Info Skeleton */}
            <div className="p-6">
              {/* Product Name Skeleton */}
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4"></div>

              {/* Brand Skeleton */}
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3 w-1/2"></div>

              {/* Price and Stock Skeleton */}
              <div className="flex items-center justify-between mb-4">
                <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              </div>

              {/* Button Skeleton */}
              <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  console.log(
    "Products page render - loading:",
    loading,
    "products count:",
    products.length
  );

  // Add more detailed logging
  if (loading) {
    console.log("🔍 SHOWING SKELETON - Loading state is true");
  } else {
    console.log("🔍 SHOWING PRODUCTS - Loading state is false");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Simple Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Products"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
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
        {console.log("🔍 About to render products grid - loading:", loading)}
        {loading ? (
          <div>
            {console.log("🔍 RENDERING SKELETON NOW")}
            <div className="text-center mb-6 text-gray-500 dark:text-gray-400 text-sm">
              Loading products... (Skeleton should be visible below)
            </div>
            <LoadingSkeleton />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <img
                src="/images/noproduct.jpg"
                alt="No products"
                className="w-48 h-48 mx-auto mb-4 opacity-50"
              />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {searchQuery
                  ? `No products found for "${searchQuery}"`
                  : "No products found"}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                {searchQuery
                  ? "Try different keywords or browse all products"
                  : "Check back later for new arrivals"}
              </p>
              {searchQuery && (
                <Link
                  href="/products"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                >
                  View All Products
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div>
            {console.log("🔍 RENDERING ACTUAL PRODUCTS NOW")}
            <Productcard products={products} />
          </div>
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
