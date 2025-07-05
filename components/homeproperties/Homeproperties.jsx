"use client";
import Productcard from "@/components/productcard/Productcard";
import { useState, useEffect } from "react";

// export async function getStaticProps() {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_API}/api/products`);
//     if (!res.ok) {
//       throw new Error("Failed to fetch products");
//     }
//     const data = await res.json();
//     return {
//       props: {
//         products: data.products,
//       },
//       revalidate: 60, // Revalidate every 60 seconds
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       props: {
//         products: [],
//       },
//     };
//   }
// }

const Homeproperties = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shuffledProducts, setShuffledProducts] = useState([]);

  // Debug: Log the environment variable
  console.log("NEXT_PUBLIC_DOMAIN_API:", process.env.NEXT_PUBLIC_DOMAIN_API);
  console.log("Homeproperties loading state:", isLoaded);

  useEffect(() => {
    const fetchallproducts = async () => {
      console.log("Starting to fetch products for home properties...");
      try {
        const url = `${process.env.NEXT_PUBLIC_DOMAIN_API}/products`;
        console.log("Fetching from:", url);
        const res = await fetch(url);
        if (!res.ok) {
          console.error("Fetch failed:", res.status, res.statusText);
          return;
        }
        const data = await res.json();
        console.log("Fetched products:", data.products);
        const shuffled = data.products
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        setShuffledProducts(shuffled);
        setIsLoaded(true);
        console.log("Home properties loaded successfully");
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchallproducts();
  }, []);

  // Skeleton loader for home properties
  const HomePropertiesSkeleton = () => {
    console.log("Rendering home properties skeleton");
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden animate-pulse"
          >
            {/* Product Image Skeleton */}
            <div className="relative h-64 bg-gray-200 dark:bg-gray-600"></div>

            {/* Product Info Skeleton */}
            <div className="p-6">
              {/* Product Name Skeleton */}
              <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded mb-2 w-3/4"></div>

              {/* Brand Skeleton */}
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-3 w-1/2"></div>

              {/* Price and Stock Skeleton */}
              <div className="flex items-center justify-between mb-4">
                <div className="h-7 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
              </div>

              {/* Button Skeleton */}
              <div className="h-12 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  console.log(
    "Homeproperties render - isLoaded:",
    isLoaded,
    "products count:",
    shuffledProducts.length
  );

  // Add more detailed logging
  if (!isLoaded) {
    console.log("🔍 HOME - SHOWING SKELETON - isLoaded is false");
  } else {
    console.log("🔍 HOME - SHOWING PRODUCTS - isLoaded is true");
  }

  return (
    <div>
      {isLoaded ? (
        <div>
          {console.log("🔍 HOME - RENDERING ACTUAL PRODUCTS NOW")}
          <Productcard products={shuffledProducts} />
        </div>
      ) : (
        <div>
          {console.log("🔍 HOME - RENDERING SKELETON NOW")}
          <HomePropertiesSkeleton />
        </div>
      )}
    </div>
  );
};

export default Homeproperties;
