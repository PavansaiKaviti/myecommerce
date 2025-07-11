"use client";
import Loadingpage from "@/app/loading";
import Odersteps from "@/components/odersteps/Odersteps";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { usePDF } from "react-to-pdf";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { clearCart } from "@/app/globalstore/reduxslices/cartslice/Cart";
import { FaCheckCircle } from "react-icons/fa";
// import Confetti from "react-confetti"; // Uncomment if installed

const Odered = () => {
  const [oder, setOder] = useState(" ");
  const { toPDF, targetRef } = usePDF({ filename: "invoice.pdf" });
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear the cart when the order confirmation page loads
    dispatch(clearCart());
  }, [dispatch]);

  useEffect(() => {
    const fetchoder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/products/oder`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          console.error("Failed to fetch order:", res.status);
          setOder(null);
          return;
        }
        const data = await res.json();
        setOder(data);
      } catch (error) {
        console.log("Error fetching order:", error);
        setOder(null);
      }
    };
    fetchoder();
  }, []);

  // Responsive confetti fallback (emoji if Confetti not installed)
  // const { width, height } = useWindowSize();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Stepper */}
      <div className="pt-6">
        <Odersteps step1={true} step2={true} step3={true} variant="compact" />
      </div>

      {/* Confetti animation */}
      {/* <Confetti width={width} height={height} numberOfPieces={200} recycle={false} /> */}

      {/* Celebration Header */}
      <div className="w-full flex flex-col items-center py-6 sm:py-10 px-4">
        <FaCheckCircle className="text-green-500 text-5xl sm:text-7xl mb-3 sm:mb-4 animate-bounce" />
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">
          Order Confirmed!
        </h1>
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 text-center mb-4 sm:mb-6 px-2">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
      </div>

      {oder === " " ? (
        <Loadingpage />
      ) : !oder ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Order Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-xl text-center text-sm sm:text-base">
            We couldn't find your order. This might happen if the order hasn't
            been processed yet or if there was an issue with the payment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-sm">
            <Link
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition-colors text-center"
            >
              Continue Shopping
            </Link>
            <Link
              href="/profile/oders"
              className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition-colors text-center"
            >
              View All Orders
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Order Items Section - Main Focus */}
          <section className="w-full bg-white dark:bg-gray-800 py-6 sm:py-8 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-5xl mx-auto px-4">
              <div className="font-bold text-2xl sm:text-3xl text-gray-800 dark:text-white mb-4 sm:mb-6 text-center">
                Your Order Items
              </div>
              <div className="space-y-3 sm:space-y-4">
                {oder.items.map((ele, index) => (
                  <div
                    className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow"
                    key={index}
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-500 shadow-sm flex-shrink-0">
                      {ele.image && (
                        <img
                          src={ele.image}
                          alt={ele.name}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl mb-1 break-words">
                        {ele.name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        ID: {ele._id?.slice(-6)}
                      </div>
                    </div>
                    <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                      <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                        ${ele.price}
                      </div>
                      <div className="text-sm sm:text-lg text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-600 px-2 sm:px-3 py-1 rounded-full border dark:border-gray-500">
                        Qty: {ele.qty || 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Order Summary Section */}
          <section className="w-full bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 py-6 sm:py-8 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-5xl mx-auto px-4">
              <div className="font-bold text-xl sm:text-2xl text-gray-800 dark:text-white mb-4 sm:mb-6 text-center">
                Order Summary
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                {/* Order Details */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-600">
                  <div className="font-semibold text-lg sm:text-xl text-gray-800 dark:text-white mb-3 sm:mb-4">
                    Order Details
                  </div>
                  <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">
                        Order #:
                      </span>
                      <span className="font-bold text-blue-700 dark:text-blue-400 text-xs sm:text-sm break-all">
                        {oder._id?.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">
                        Date:
                      </span>
                      <span className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white">
                        {oder.paidAt
                          ? new Date(oder.paidAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">
                        Payment:
                      </span>
                      <span
                        className={`font-bold text-xs sm:text-sm ${
                          oder.isPaid
                            ? "text-green-600 dark:text-green-400"
                            : "text-yellow-600 dark:text-yellow-400"
                        }`}
                      >
                        {oder.isPaid ? "Paid" : "Pending"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">
                        Delivery:
                      </span>
                      <span
                        className={`font-bold text-xs sm:text-sm ${
                          oder.isDelivered
                            ? "text-green-600 dark:text-green-400"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {oder.isDelivered ? "Delivered" : "Processing"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-2 sm:pt-3">
                      <span className="text-gray-800 dark:text-white font-bold text-base sm:text-lg">
                        Total:
                      </span>
                      <span className="text-gray-800 dark:text-white font-bold text-lg sm:text-xl">
                        ${oder.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-600">
                  <div className="font-semibold text-lg sm:text-xl text-gray-800 dark:text-white mb-3 sm:mb-4">
                    Shipping Address
                  </div>
                  <div className="space-y-1 sm:space-y-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                    <div className="font-medium break-words">
                      {oder.shippindAddress?.address}
                    </div>
                    <div>
                      {oder.shippindAddress?.city},{" "}
                      {oder.shippindAddress?.state}{" "}
                      {oder.shippindAddress?.zipcode}
                    </div>
                    <div>Phone: {oder.shippindAddress?.phone}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="w-full bg-white dark:bg-gray-800 py-6 sm:py-8">
            <div className="max-w-5xl mx-auto px-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => toPDF()}
                  className="flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <FaDownload className="w-4 h-4" />
                  Download Invoice
                </button>
                <Link
                  href="/products"
                  className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Odered;
