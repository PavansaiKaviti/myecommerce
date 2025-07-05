"use client";
import React, { useEffect } from "react";
import pay from "@/public/images/pay.jpg";
import Image from "next/image";
import Odersteps from "@/components/odersteps/Odersteps";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const Payment = () => {
  const { items, shippingAddress } = useSelector((state) => state.cart);
  const router = useRouter();

  useEffect(() => {
    // If shipping address is missing, redirect to shipping step
    if (!shippingAddress || !shippingAddress.address) {
      router.replace("/products/cart/shippingaddress");
    }
  }, [shippingAddress, router]);

  const payMent = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_API}/checkout_sessions`,
      {
        method: "POST",
        body: JSON.stringify({ items, shippingAddress }),
        headers: { "content-type": "application/json" },
      }
    );
    const data = await res.json();
    window.location.assign(data);
    // router.push(data);
  };

  const payWithCash = () => {
    // Placeholder: redirect to order confirmation page
    router.push("/products/cart/odered");
  };

  return (
    <div className="flex flex-col items-center gap-10 mt-0 min-h-screen bg-gray-50 dark:bg-gray-900">
      <Odersteps step1={true} step2={true} step3={false} variant="default" />
      <div className="flex flex-col lg:flex-row w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Left: Payment options */}
        <div className="flex flex-col justify-center items-center gap-6 p-8 w-full lg:w-1/2">
          <div className="w-full flex flex-col gap-4">
            <button
              type="button"
              className="w-full py-4 px-6 rounded-xl bg-green-600 dark:bg-green-500 hover:bg-green-500 dark:hover:bg-green-600 text-white text-lg font-bold shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-600"
              onClick={payWithCash}
            >
              Pay with Cash
            </button>
            <button
              type="button"
              className="w-full py-4 px-6 rounded-xl bg-blue-600 dark:bg-blue-500 hover:bg-blue-500 dark:hover:bg-blue-600 text-white text-lg font-bold shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600"
              onClick={payMent}
            >
              Pay with Credit / Debit
            </button>
          </div>
        </div>
        {/* Right: Image */}
        <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 lg:w-1/2 p-6">
          <Image
            src={pay}
            className="object-contain rounded-lg shadow-sm max-h-48 w-auto"
            alt="paypic"
            priority={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Payment;
