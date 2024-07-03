import Link from "next/link";
import React from "react";
import { FaInstagram, FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <div
      id="headcontainer"
      className="flex md:flex-row flex-col border h-1/4 w-full bg-gray-400 p-6 md:justify-around items-center gap-4 mt-auto"
    >
      <div className=" flex flex-col justify-center ">
        <p className="md:text-4xl text-7xl font-bold">LOGO</p>
      </div>
      <div className=" flex flex-col">
        <p className=" md:text-md text-xl  font-bold md:text-left text-center">
          Company
        </p>
        <p className=" hover:text-white hover:underline cursor-pointer md:text-left text-center">
          About
        </p>
        <p className=" hover:text-white hover:underline cursor-pointer md:text-left text-center">
          Privacy Policies
        </p>
        <p className=" hover:text-white hover:underline cursor-pointer md:text-left text-center">
          Contact Us
        </p>
        <p className=" hover:text-white hover:underline cursor-pointer md:text-left text-center">
          Technologies
        </p>
      </div>
      <div className=" flex flex-col gap-1 ">
        <div className="flex flex-col">
          <p className="md:text-md text-xl font-bold md:text-left text-center">
            About Me
          </p>
          <p className="md:text-left text-center">Pavansai Kaviti</p>
          <Link
            href={"mailto:kavitipavansai@gmail.com"}
            className=" hover:text-white hover:underline md:text-left text-center"
          >
            kavitipavansai@gmail.com
          </Link>
        </div>
        <div className="flex flex-col">
          <p className="md:text-md text-xl font-bold md:text-left text-center">
            Social Media:
          </p>
          <div className="flex gap-2 text-white text-4xl md:text-left text-center">
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
