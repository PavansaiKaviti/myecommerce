import Image from "next/image";
import React from "react";
import Link from "next/link";

const Productcard = ({ products }) => {
  return (
    <section className="px-4 pt-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div className="rounded-xl shadow-lg relative" key={product._id}>
              <div className="w-full h-1/2">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-t-xl"
                  width={500}
                  height={500}
                  sizes="100"
                  priority={true}
                />
              </div>
              <div className="p-4 h-1/2">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold">{product.name}</h3>
                </div>
                <div className="flex justify-center gap-4 text-gray-500 mb-4">
                  <p className="text-xl font-bold">${product.price}</p>
                </div>
                <div className="border border-gray-100 mb-5"></div>
                <div className="flex flex-col  justify-center lg:flex-row  mb-4">
                  <Link
                    href={`/products/${product._id}`}
                    className="h-[36px] bg-gray-500 hover:bg-black text-white px-4 py-2 rounded-lg text-center text-sm"
                  >
                    BUY
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Productcard;
