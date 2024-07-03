"use client";
import Loadingpage from "@/app/loading";
import Productcard from "@/components/productcard/Productcard";
import { useState, useEffect, useMemo } from "react";

// export async function getStaticProps() {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_API}/products`);
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
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchallproducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/products`
        );
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setProducts(data.products);
        setIsLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    if (products.length === 0) {
      fetchallproducts();
    }
  }, [products]);
  // const newProducts = products.sort((a, b) => Math.random() - 0.5).slice(0, 3);
  const shuffledProducts = useMemo(() => {
    if (isLoaded) {
      return products.sort(() => Math.random() - 0.5).slice(0, 3);
    }
    return [];
  }, [products, isLoaded]);

  return (
    <div>
      {isLoaded ? <Productcard products={shuffledProducts} /> : <Loadingpage />}
    </div>
  );
};

export default Homeproperties;
