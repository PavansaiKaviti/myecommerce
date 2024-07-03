import Image from "next/image";
import React from "react";
import offers from "@/public/images/offers.jpg";
import apple from "@/public/images/apple.jpg";
import tech from "@/public/images/tech.jpg";
import appliances from "@/public/images/appliances.jpg";

const Notifitions = () => {
  return (
    <div>
      <div className="text-center">notification</div>
      <div className="flex flex-col mt-10 gap-4 items-center">
        <div className=" flex  border md:w-1/4 w-1/2 justify-around ">
          <div className="h-24 w-24 flex flex-col justify-center ">
            <Image src={offers} height={0} width={0} />
          </div>
          <div className="flex items-center">
            <p>Amazon sales 50%</p>
          </div>
        </div>
        <div className=" flex  border md:w-1/4 w-1/2 justify-around ">
          <div className="h-24 w-24 flex flex-col justify-center ">
            <Image
              src={apple}
              height={0}
              width={0}
              className=" w-fill h-fill "
            />
          </div>
          <div className="flex items-center">
            <p>Apple Student Deals</p>
          </div>
        </div>
        <div className=" flex  border md:w-1/4 w-1/2 justify-around ">
          <div className="h-24 w-24 flex flex-col justify-center ">
            <Image
              src={tech}
              height={0}
              width={0}
              className=" w-fill h-fill "
            />
          </div>
          <div className="flex items-center">
            <p>Tech Deals 50%</p>
          </div>
        </div>
        <div className=" flex  border md:w-1/4 w-1/2 justify-around ">
          <div className="h-24 w-24 flex flex-col justify-center ">
            <Image
              src={appliances}
              height={0}
              width={0}
              className=" w-fill h-fill "
            />
          </div>
          <div className="flex items-center">
            <p>Tech Deals 50%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifitions;
