import Image from "next/image";
import React, { memo } from "react";
import Link from "next/link";

const Productcard = memo(({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product._id}
          className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg dark:hover:shadow-xl transition-all duration-300"
        >
          {/* Product Image */}
          <div className="relative h-64 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              width={400}
              height={400}
              priority={true}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
          </div>

          {/* Product Info */}
          <div className="p-6">
            {/* Product Name */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {product.name}
            </h3>

            {/* Brand */}
            {product.brand && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {product.brand}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ${product.price}
              </span>
              {product.countInStock > 0 ? (
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  In Stock
                </span>
              ) : (
                <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Buy Button */}
            <Link
              href={`/products/${product._id}`}
              className="block w-full bg-gray-900 dark:bg-gray-700 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
});

export default Productcard;
