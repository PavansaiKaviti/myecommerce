import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

const Odersteps = ({ step1, step2, step3 }) => {
  return (
    <div className=" flex gap-4 w-fit p-2 text-xl">
      <div className=" flex">
        <Link
          href="/products/cart/shippingaddress"
          className="hover:text-blue-500"
        >
          <FaCheckCircle
            className={`${step1 ? "text-green-500" : ""} inline mr-1`}
          />
          shipping address
        </Link>
      </div>
      <div className=" border-b-2 w-14 mb-2"></div>
      <div className=" flex">
        <Link href="/products/cart/payoder" className="hover:text-blue-500">
          <FaCheckCircle
            className={`${step2 ? "text-green-500" : " "} inline mr-1`}
          />
          pay
        </Link>
      </div>
      <div className=" border-b-2 w-14  mb-2"></div>
      <div className=" flex">
        <Link href="/products/cart/odered" className="hover:text-blue-500">
          <FaCheckCircle
            className={`${step3 ? "text-green-500" : " "} inline mr-1`}
          />
          Oder placed
        </Link>
      </div>
    </div>
  );
};

export default Odersteps;
