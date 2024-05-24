import Productcard from "@/components/productcard/Productcard";
import { fetchProducts } from "@/utils/requests/Requests";

import React from "react";

export const metadata = {
  title: "products",
};

const Productpage = async () => {
  const products = await fetchProducts();
  return (
    <div>
      <Productcard products={products} />
    </div>
  );
};

export default Productpage;
