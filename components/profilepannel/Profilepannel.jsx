import React from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  FaUser,
  FaEdit,
  FaBoxOpen,
  FaSignOutAlt,
} from "@/components/icons/Icons";

const Profilepannel = () => {
  // const { isAdmin } = getuser();
  return (
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
        <FaBoxOpen className="inline mr-1" /> Oders
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
  );
};

export default Profilepannel;
