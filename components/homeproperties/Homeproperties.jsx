"use client";
import Productcard from "@/components/productcard/Productcard";
import { useState, useEffect } from "react";

const Homeproperties = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchallproducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/products`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (products.length === 0) {
      fetchallproducts();
    }
  }, []);
  const newProducts = products.sort((a, b) => Math.random() - 0.5).slice(0, 3);

  return (
    <div>
      <Productcard products={newProducts} />
    </div>
  );
};

export default Homeproperties;
