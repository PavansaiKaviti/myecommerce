import React from "react";
import { FaCheckCircle } from "@/components/icons/Icons";
import Link from "next/link";

const Odersteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex gap-4 w-fit p-2 text-xl flex-wrap">
      <div className="flex">
        {step1 ? (
          <Link
            href="/products/cart/shippingaddress"
            className="hover:text-blue-500"
          >
            <FaCheckCircle
              className={`${step1 ? "text-green-500" : ""} inline mr-1`}
            />
            shipping address
          </Link>
        ) : (
          <span className="text-gray-400 flex items-center">
            <FaCheckCircle className="inline mr-1" />
            shipping address
          </span>
        )}
      </div>
      <div className="border-b-2 w-14 mb-2"></div>
      <div className="flex">
        {step2 ? (
          <Link href="/products/cart/payoder" className="hover:text-blue-500">
            <FaCheckCircle
              className={`${step2 ? "text-green-500" : ""} inline mr-1`}
            />
            pay
          </Link>
        ) : (
          <span className="text-gray-400 flex items-center">
            <FaCheckCircle className="inline mr-1" />
            pay
          </span>
        )}
      </div>
      <div className="border-b-2 w-14 mb-2"></div>
      <div className="flex">
        {step3 ? (
          <Link href="/products/cart/odered" className="hover:text-blue-500">
            <FaCheckCircle
              className={`${step3 ? "text-green-500" : ""} inline mr-1`}
            />
            Oder placed
          </Link>
        ) : (
          <span className="text-gray-400 flex items-center">
            <FaCheckCircle className="inline mr-1" />
            Oder placed
          </span>
        )}
      </div>
    </div>
  );
};

export default Odersteps;
