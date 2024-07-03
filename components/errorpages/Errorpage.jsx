import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const Errorpage = ({ image, height, message, link }) => {
  return (
    <div className="flex flex-col gap-5 justify-center items-center mb-6">
      <div>
        <Image
          src={image}
          alt="no items"
          height={height}
          className="my-12"
          priority={true}
        />
      </div>
      <div className="text-2xl">{message}....</div>
      <div className="border flex justify-center rounded-xl bg-black hover:bg-blue-500 ">
        <Link href={link} className="p-2 text-white">
          <FaArrowLeft className="inline mr-1" />
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default Errorpage;
