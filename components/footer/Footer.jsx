import Link from "next/link";
import React from "react";
import { FaInstagram, FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <div
      id="headcontainer"
      className="flex flex-row border h-1/4 w-full bg-gray-400 p-6 justify-around mt-auto"
    >
      <div className=" flex flex-col justify-center ">
        <p className=" text-4xl font-bold">LOGO</p>
      </div>
      <div>
        <p className=" text-md font-bold">Company</p>
        <p className=" hover:text-white hover:underline cursor-pointer">
          About
        </p>
        <p className=" hover:text-white hover:underline cursor-pointer">
          Privacy Policies
        </p>
        <p className=" hover:text-white hover:underline cursor-pointer">
          Contact Us
        </p>
        <p className=" hover:text-white hover:underline cursor-pointer">
          Technologies
        </p>
      </div>
      <div className=" flex flex-col gap-1">
        <div>
          <p className=" text-md font-bold">About Me</p>
          <p>Pavansai Kaviti</p>
          <Link
            href={"mailto:kavitipavansai@gmail.com"}
            className=" hover:text-white hover:underline"
          >
            kavitipavansai@gmail.com
          </Link>
        </div>
        <div>
          <p className=" text-md font-bold">Social Media:</p>
          <div className="flex gap-2 text-white text-4xl">
            <Link href="https://www.facebook.com/">
              <FaFacebook />
            </Link>
            <Link href="https://www.instagram.com/">
              <FaInstagram />
            </Link>
            {/* <Link href="https://www.snapchat.com/">
              <FaSnapchat />
            </Link>
            <Link href="https://telegram.org/">
              <FaTelegram />
            </Link> */}
            <Link href="https://www.linkedin.com/in/pavansai-kaviti/">
              <FaLinkedin />
            </Link>
            <Link href="https://github.com/PavansaiKaviti">
              <FaGithub />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
