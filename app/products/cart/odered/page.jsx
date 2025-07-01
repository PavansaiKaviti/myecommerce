"use client";
import Loadingpage from "@/app/loading";
import Odersteps from "@/components/odersteps/Odersteps";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { usePDF } from "react-to-pdf";

const Odered = () => {
  const [oder, setOder] = useState(" ");
  const { toPDF, targetRef } = usePDF({ filename: "invoice.pdf" });

  useEffect(() => {
    const fetchoder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/products/oder`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setOder(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchoder();
  }, []);

  return (
    <div className=" flex flex-col items-center gap-10 mt-12">
      <Odersteps step1={true} step2={true} step3={true} />
      {oder === " " ? (
        <Loadingpage />
      ) : (
        <div className="w-full mb-6">
          <div className="flex  justify-center items-center " ref={targetRef}>
            <div className="w-1/2">
              <div className=" border text-lg font-bold text-center p-3 bg-gray-300">
                <div>Ecommerce</div>
              </div>
              <div>
                <div className="border flex justify-between">
                  <div className="ml-2 p-1">
                    <span className=" text-lg font-medium">Oder Confirmed</span>
                    <span className=" text-blue-500 font-medium">
                      {" "}
                      #{oder._id}
                    </span>
                  </div>
                  <button onClick={() => toPDF()}>
                    <FaDownload className="inline mr-2" />
                  </button>
                </div>
                <div className="border">
                  <p className="p-1">
                    <strong className="ml-2">Date:</strong>{" "}
                    <span>{oder.paidAt}</span>
                  </p>
                </div>
              </div>

              <div className="border">
                {oder.items.map((ele, index) => (
                  <div
                    className="border flex justify-between gap-3 p-1"
                    key={index}
                  >
                    <p className=" font-medium">{ele.name}</p>
                    <p>
                      <Link
                        href={`${process.env.NEXT_PUBLIC_LOCAL_API}/products/${ele._id}`}
                        className=" underline text-blue-500"
                      >
                        {ele._id}
                      </Link>
                    </p>
                    <p>${ele.price}</p>
                  </div>
                ))}
              </div>
              <div className="border flex flex-col text-right">
                <div className="border p-1">
                  <strong>Items price: </strong>${oder.totalPrice}
                </div>
                <div className="border p-1">
                  <strong>Taxes price:</strong> $00.00
                </div>
                <div className="border p-1">
                  <strong>Delivery price:</strong> $00.00
                </div>
                <div className="border p-1">
                  <strong>Total:</strong> ${oder.totalPrice}
                </div>
              </div>
              <div className=" border flex ">
                <div className="border w-1/2 p-2 ">
                  <div className=" text-lg font-bold">Shipping Address:</div>
                  <div>
                    <strong>Address:</strong> {oder.shippindAddress.address}
                  </div>
                  <div>
                    <strong>Phone: </strong>
                    {oder.shippindAddress.phone}
                  </div>
                  {/* <div>
                    <strong>Email:</strong> pavansai@gmail.com
                  </div> */}
                  <div>
                    <strong>Zipcode:</strong> {oder.shippindAddress.zipcode}
                  </div>
                  <div>
                    <strong>City:</strong> {oder.shippindAddress.city}
                  </div>
                  <div>
                    <strong>State:</strong> {oder.shippindAddress.state}
                  </div>
                </div>
                <div className="border w-1/2 p-2">
                  <div>
                    <strong>Payment:</strong>
                    <span className=" text-wrap">{oder.paymentid}</span>
                  </div>
                  <div>
                    <strong>Method: </strong>
                    {oder.paymentMethod}
                  </div>
                  <div>
                    <strong>Status:</strong>
                    {oder.isPaid ? " paid" : " not paid"}
                  </div>
                  <div>
                    <strong>Delivery:</strong>
                  </div>
                  <div>
                    <strong>Status:</strong>
                    {oder.isDelivered ? " delivered" : " not delivered"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Odered;
