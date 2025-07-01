import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaArrowLeft } from "@/components/icons/Icons";

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
      <Link
        href={link}
        className="border flex items-center justify-center rounded-xl bg-black hover:bg-blue-500 p-2 text-white transition-colors"
      >
        <FaArrowLeft className="mr-1" />
        Go Back
      </Link>
    </div>
  );
};

export default Errorpage;
