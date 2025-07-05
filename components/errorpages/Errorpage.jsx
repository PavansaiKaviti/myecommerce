import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaArrowLeft } from "@/components/icons/Icons";

const Errorpage = ({ image, height, message, link }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col gap-5 justify-center items-center">
      <div>
        <Image
          src={image}
          alt="no items"
          height={height}
          className="my-12"
          priority={true}
        />
      </div>
      <div className="text-2xl text-gray-900 dark:text-white">
        {message}....
      </div>
      <Link
        href={link}
        className="border flex items-center justify-center rounded-xl bg-gray-900 dark:bg-gray-800 hover:bg-blue-600 dark:hover:bg-blue-500 p-2 text-white transition-colors"
      >
        <FaArrowLeft className="mr-1" />
        Go Back
      </Link>
    </div>
  );
};

export default Errorpage;
