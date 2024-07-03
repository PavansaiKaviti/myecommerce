"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import noOder from "@/public/images/nooder.jpg";
import Errorpage from "@/components/errorpages/Errorpage";
import Loadingpage from "@/app/loading";

const Oders = () => {
  const [odered, setOdered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchoder = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_API}/oders`);
        const data = await res.json();
        setOdered(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchoder();
  }, []);

  if (loading) {
    return <Loadingpage />;
  }

  return (
    <div className="flex flex-col m-4 md:m-10">
      <div className="flex justify-around text-xl">
        <span>Orders history</span>
        <p>
          Orders: <span className=" text-blue-500"> {odered.length}</span>
        </p>
      </div>
      {odered.length === 0 ? (
        <Errorpage
          image={noOder}
          height={400}
          message="No Oders yet"
          link="/products"
        />
      ) : (
        <div className="flex flex-col mt-3 gap-2 items-center">
          {odered.map((ele, index) => (
            <div
              className=" p-2 flex flex-col md:flex-row justify-center gap-2 w-full md:w-3/4 mt-3 shadow "
              key={index}
            >
              <div className="flex flex-col xl:flex-row items-center lg:gap-2 md: border w-full md:w-3/4 justify-around ">
                <div className="flex md:flex-row w-fit  justify-center items-center gap-2 ">
                  {ele.items.map((img) => (
                    <div className="h-20 w-20 " key={img._id}>
                      <Image
                        src={img.image}
                        alt={img.name}
                        width={0}
                        height={0}
                        sizes="100"
                        priority={true}
                        className="object-cover h-full w-full"
                      />
                    </div>
                  ))}
                </div>
                <div className=" flex md:flex-row flex-col gap-3 justify-between">
                  <div className=" self-center underline text-blue-500">
                    <span>{ele._id}</span>
                  </div>
                  <div className=" self-center text-xl">
                    <span>${ele.totalPrice}</span>
                  </div>
                  {/* <div className=" self-center text-xl border p-1 rounded-lg bg-red-500 text-white">
            <FaDownload className="inline mr-1" />
            invoice
          </div> */}
                </div>
              </div>
              <div className="border w-full md:w-1/4 p-2 flex flex-col gap-2 items-center ">
                {ele.isDelivered ? (
                  <div className="border flex justify-center w-full xl:w-1/2 bg-blue-500 rounded-lg">
                    <span className="p-2 text-white ">delivered</span>
                  </div>
                ) : (
                  <div className="border flex justify-center w-full xl:w-1/2 bg-green-500 rounded-lg">
                    <span className="p-2 text-white ">not delivered</span>
                  </div>
                )}

                <div className="border flex justify-center w-full xl:w-1/2 bg-blue-500 rounded-lg">
                  <span className="p-2 text-white">
                    {ele.isPaid ? "paid" : "not Paid"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Oders;
