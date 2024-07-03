import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Adminlink = () => {
  const pathname = usePathname();
  return (
    <div
      id="navbaradmin"
      className="flex w-full md:w-1/2 justify-around  md:gap-2 p-4  "
    >
      <Link
        href="/profile/admin"
        className={`${
          pathname === "/profile/admin" ? "text-white bg-black border" : " "
        } text-black  rounded-xl hover:text-white hover:bg-gray-500 border shadow-md p-3`}
      >
        Products
      </Link>
      <Link
        href="/profile/admin/users"
        className={`${
          pathname === "/profile/admin/users"
            ? "text-white bg-black border"
            : " "
        } text-black  rounded-xl hover:text-white hover:bg-gray-500 border shadow-md p-3`}
      >
        Users
      </Link>
      <Link
        href="/profile/admin/oders"
        className={`${
          pathname === "/profile/admin/oders"
            ? "text-white bg-black border"
            : " "
        } text-black  rounded-xl hover:text-white hover:bg-gray-500 border shadow-md p-3`}
      >
        oders
      </Link>
      <Link
        href="/profile/admin/addproducts"
        className={`${
          pathname === "/profile/admin/addproducts"
            ? "text-white bg-black border"
            : " "
        } text-black  rounded-xl hover:text-white hover:bg-gray-500 border shadow-md p-3`}
      >
        Add product
      </Link>
    </div>
  );
};

export default Adminlink;
