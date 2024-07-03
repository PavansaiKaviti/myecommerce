"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaUser, FaEdit, FaBoxOpen, FaSignOutAlt } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Loadingpage from "../loading";

const Card = () => {
  const [users, setuser] = useState({});
  const [coverimg, setcoverImage] = useState("");
  const pathname = usePathname();
  const { data: profile } = useSession();

  useEffect(() => {
    const fetechimage = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/profile/coverimage`
        );
        const data = await res.json();
        setcoverImage(data.image);
        setuser(profile.user);
      } catch (error) {
        console.log(error);
      }
    };
    fetechimage();
  }, [users, coverimg]);

  return Object.keys(users).length === 0 ? (
    <Loadingpage />
  ) : (
    <div className="flex justify-around items-center mt-32">
      <div className="flex flex-col gap-2 self-center  h-fit w-fit">
        <Link
          href="/profile"
          className={`${
            pathname === "/profile" ? "text-white bg-black border" : " "
          } text-black  rounded-xl hover:text-white hover:bg-gray-500 border shadow-md p-3`}
        >
          <FaUser className="inline mr-1" />
          Profile
        </Link>
        <Link
          href={`/profile/uploadcoverimage`}
          className=" text-black hover:text-white hover:bg-black border rounded-xl  shadow-md p-3"
        >
          <FaEdit className="inline mr-1" />
          Update Image
        </Link>
        <Link
          href={`${process.env.NEXT_PUBLIC_LOCAL_API}/profile/oders`}
          className=" text-black hover:text-white hover:bg-black border rounded-xl shadow-md  p-3"
        >
          <FaBoxOpen className="inline mr-1" />
          Oders
        </Link>
        <Link
          href="/"
          className=" text-black hover:text-white hover:bg-black border rounded-xl shadow-md p-3"
          onClick={() => signOut()}
        >
          <FaSignOutAlt className="inline mr-1" />
          Logout
        </Link>
      </div>

      <div className=" flex flex-col gap-6 h-96 w-1/2">
        <div className="relative h-3/4 w-full">
          <Image
            src={coverimg}
            alt="cover"
            height={0}
            width={0}
            sizes="100"
            className=" object-cover w-full h-full rounded-3xl"
            priority={true}
          />
          <div className="absolute bottom-0  left-0 h-32 w-32">
            <Image
              src={users.image}
              alt="profile"
              height={0}
              width={0}
              sizes="100"
              className=" w-full h-full object-cover "
              priority={true}
            />
          </div>
        </div>
        <div className="flex border shadow-md justify-around flex-row w-full p-4 rounded-3xl ">
          <div>
            <p className="text-xl text-gray-500">
              Name:
              <span className=" text-black"> {users.name}</span>
            </p>
          </div>
          <div>
            <p className="text-xl text-gray-500">
              Email:
              <span className=" text-black"> {users.email}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
