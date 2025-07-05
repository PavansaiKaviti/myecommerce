import React from "react";
import Link from "next/link";
import { FaArrowLeft } from "@/components/icons/Icons";
import Image from "next/image";
import pagelost from "@/public/images/pagenotfound.jpg";

export const metadata = {
  title: "Page Not Found",
  description:
    "The page you're looking for doesn't exist. Return to Dino's homepage to continue shopping.",
  keywords: "404, page not found, error, Dino",
  openGraph: {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist.",
    type: "website",
    locale: "en_US",
  },
};

const Nopage = () => {
  return (
    <div className="flex flex-col gap-5 justify-center items-center mt-10 mb-6">
      <div>
        <Image
          src={pagelost}
          alt="no items"
          height={300}
          className=" my-12"
          priority={true}
        />
      </div>
      <div className="text-3xl">Oops page not found....</div>
      <div className="border flex justify-center rounded-xl bg-black hover:bg-blue-500 ">
        <Link href="/" className="p-2  text-white">
          <FaArrowLeft className="inline mr-1" />
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default Nopage;
