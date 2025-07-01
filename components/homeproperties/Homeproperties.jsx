"use client";
import Loadingpage from "@/app/loading";
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

  useEffect(() => {
    const fetchallproducts = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/products`;
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
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchallproducts();
  }, []);

  return (
    <div>
      {isLoaded ? <Productcard products={shuffledProducts} /> : <Loadingpage />}
    </div>
  );
};

export default Homeproperties;
