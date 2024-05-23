"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGoogle } from "react-icons/fa";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="flex justify-center">
      <nav className="sm: w-full  md:w-2/3 h-12 md:mt-5 border md:rounded-xl bg-gray-200 relative flex  justify-center ">
        <div className="absolute top-2 left-2 ">
          <div className="flex justify-center">
            <span className=" text-xl font-bold">LOGO</span>
          </div>
        </div>
        <div className="flex flex-row  items-center justify-center gap-10">
          <Link
            href="/"
            className={`${
              pathname == "/" ? "bg-black text-white" : " "
            } text-black-500 hover:bg-gray-500 hover:text-white block rounded-xl px-3 py-2 text-base font-medium`}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`${
              pathname == "/products" ? "bg-black text-white" : " "
            } text-black-500 hover:bg-gray-500 hover:text-white block rounded-xl px-3 py-2 text-base font-medium`}
          >
            products
          </Link>
          <Link
            href="/products/cart"
            className={`${
              pathname == "/cart" ? "bg-black text-white" : " "
            } text-black-500 hover:bg-gray-500 hover:text-white block rounded-xl px-3 py-2 text-base font-medium`}
          >
            cart
          </Link>
        </div>
        <div className="absolute top-0.5 right-0.5 justify-center">
          <div className=" flex items-center">
            <button className=" md:flex items-center text-white bg-gray-700 hover:bg-gray-900 hover:text-white rounded-xl px-3 py-2 h-10">
              {/* <span className="sm:hidden">Login</span> */}
              <FaGoogle className="inline" />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
