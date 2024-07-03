"use client";
import React from "react";
import pay from "@/public/images/pay.jpg";
import Image from "next/image";
import Odersteps from "@/components/odersteps/Odersteps";
import { useSelector } from "react-redux";

const Payment = () => {
  const { items, shippingAddress } = useSelector((state) => state.cart);

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

  return (
    <div className=" flex flex-col items-center gap-20 mt-12">
      <Odersteps step1={true} step2={true} />
      <div className=" flex lg:flex-row w-1/2 flex-col-reverse md:gap-2 ">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-2xl  font-medium text-nowrap">
            Payment Method:
          </div>
          <button
            type="submit"
            className=" border rounded-3xl w-fit p-2 bg-blue-500 text-white text-lg text-center text-nowrap hover:bg-blue-400 "
            onClick={() => payMent()}
          >
            credit/debit card
          </button>
        </div>
        <div id="image">
          <Image
            src={pay}
            className="w-full h-full  text-md"
            alt="paypic"
            priority={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Payment;
