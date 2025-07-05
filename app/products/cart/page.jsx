"use client";
import noItem from "@/public/images/noitems.jpg";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  additems,
  removecartitems,
} from "@/app/globalstore/reduxslices/cartslice/Cart";
import { toast } from "react-hot-toast";
import Errorpage from "@/components/errorpages/Errorpage";

const cart = () => {
  const product = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addToCartHandler = async (product, qty) => {
    dispatch(additems({ ...product, qty }));
  };

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
            role="status"
            aria-label="Loading cart"
          ></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading cart...
          </p>
        </div>
      </div>
    );
  }

  return product.items.length === 0 ? (
    <Errorpage
      image={noItem}
      height={400}
      message="Cart is empty"
      link="/products"
    />
  ) : (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Review your items and proceed to checkout
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Cart Items ({product.items.length})
                </h2>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {product.items.map((item, index) => (
                  <div key={index} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <Link
                              href={`/products/${item._id}`}
                              className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {item.name}
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Brand: {item.brand}
                            </p>
                          </div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            ${item.price}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Quantity:
                            </label>
                            <select
                              value={item.qty}
                              onChange={(e) =>
                                addToCartHandler(item, Number(e.target.value))
                              }
                              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              {[...Array(item.countInStock).keys()].map((x) => (
                                <option value={x + 1} key={x}>
                                  {x + 1}
                                </option>
                              ))}
                            </select>
                          </div>

                          <button
                            onClick={() => {
                              dispatch(removecartitems(item));
                              toast.success("Item removed from cart");
                            }}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Remove item"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-8">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Order Summary
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {/* Items Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Items ({product.items.length})
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${product.itemsPrice}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Shipping
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${product.shippingPrice}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${product.totalPrice}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="pt-4">
                  <Link href="/products/cart/shippingaddress" className="block">
                    <button className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105">
                      Proceed to Checkout
                    </button>
                  </Link>
                </div>

                {/* Continue Shopping */}
                <div className="text-center pt-4">
                  <Link
                    href="/products"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium hover:underline"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default cart;
