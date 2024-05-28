"use client";
import Productcard from "@/components/productcard/Productcard";
import React, { useEffect, useState } from "react";

const Productpage = () => {
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
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (products.length === 0) {
      fetchallproducts();
    }
  }, []);
  return (
    <div>
      <Productcard products={products} />
    </div>
  );
};

export default Productpage;
