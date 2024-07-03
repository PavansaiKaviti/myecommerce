"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaGoogle,
  FaBell,
  FaUser,
  FaBox,
  FaSignOutAlt,
  FaCogs,
} from "react-icons/fa";
import profile from "@/assets/images/profile.png";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [providers, setproviders] = useState(null);
  const [profileNav, setprofileNav] = useState(false);
  const { items } = useSelector((state) => state.cart);
  const numofitems = items.length;

  useEffect(() => {
    const setauthproviders = async () => {
      const res = await getProviders();
      setproviders(res);
    };
    setauthproviders();
  }, []);

  return (
    <div className="flex justify-center">
      <nav className="sm: w-full  md:w-2/3 h-12 md:mt-5 border md:rounded-xl bg-gray-200 relative flex  justify-center ">
        {/*logo*/}
        <div className="absolute top-2 left-2 ">
          <div className="flex justify-center">
            <Link href="/">
              <span className=" text-xl font-bold">LOGO</span>
            </Link>
          </div>
        </div>
        {/* home,products,cart links */}
        <div className="flex flex-row  items-center justify-center gap-10 first-line md:mr-15">
          <Link
            href="/"
            className={`${
              pathname === "/" ? "bg-black text-white" : " "
            } text-black-500 hover:bg-gray-500 hover:text-white block rounded-xl px-3 py-2 text-base font-medium`}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`${
              pathname === "/products" ? "bg-black text-white" : " "
            } text-black-500 hover:bg-gray-500 hover:text-white block rounded-xl px-3 py-2 text-base font-medium`}
          >
            Products
          </Link>

          <Link
            href="/products/cart"
            className={`${
              pathname === "/products/cart" ? "bg-black text-white" : " "
            } text-black-500 hover:bg-gray-500 hover:text-white block rounded-xl px-3 py-2 text-base font-medium`}
          >
            Cart
            {numofitems !== 0 ? (
              <span className=" font-bold text-blue-500 "> {numofitems}</span>
            ) : (
              ""
            )}
            {/* <FaShoppingCart className="inline ml-2 text-xl" /> */}
          </Link>
        </div>
        <div className="flex flex-row gap-10 absolute top-1 right-1 justify-center">
          {/* input */}
          <div className="hidden xl:block  top-4" id="search">
            <input
              type="text"
              className="w-auto h-9 px-4 py-2 border rounded-xl focus:outline-none focus:border-gray-500"
              placeholder="search"
            />
          </div>
          {/*login*/}
          <div id="login">
            {session && (
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => setprofileNav((prev) => !prev)}
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    <Image
                      className="h-8 w-8 rounded-full"
                      src={session.user.image || profile}
                      alt="profile"
                      width={0}
                      height={0}
                      sizes="100"
                    />
                  </button>
                </div>
                <div
                  id="user-menu"
                  className={`${
                    profileNav ? "" : "hidden"
                  } absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex="-1"
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-0"
                    onClick={() => setprofileNav((prev) => !prev)}
                  >
                    <div className="flex text-left mt-1 gap-2">
                      <FaUser className="inline ml-2 text-xl" />
                      {session?.user?.name || "your profile"}
                    </div>
                  </Link>
                  <div className="border border-gray-100 mb-1"></div>
                  {session.isAdmin ? (
                    <>
                      <Link
                        href="/profile/admin"
                        className="block px-4 py-2 text-sm text-gray-700"
                        role="menuitem"
                        tabIndex="-1"
                        id="user-menu-item-2"
                        onClick={() => setprofileNav((prev) => !prev)}
                      >
                        <div className="flex text-left gap-2">
                          <FaCogs className="inline ml-2 text-xl" />
                          Dashboard
                        </div>
                      </Link>
                      <div className="border border-gray-100 mb-1"></div>
                    </>
                  ) : (
                    " "
                  )}

                  <Link
                    href="/profile/notifications"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-2"
                    onClick={() => setprofileNav((prev) => !prev)}
                  >
                    <div className="flex text-left gap-2">
                      <FaBell className="inline ml-2 text-xl" />
                      view notifications
                    </div>
                  </Link>
                  <div className="border border-gray-100 mb-1"></div>
                  <Link
                    href="/profile/oders"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-2"
                    onClick={() => setprofileNav((prev) => !prev)}
                  >
                    <div className="flex text-left gap-2">
                      <FaBox className="inline ml-2 text-xl" />
                      oders
                    </div>
                  </Link>
                  <div className="border border-gray-100 mb-1"></div>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-2"
                    onClick={() => signOut()}
                  >
                    <div className="flex text-left gap-2">
                      <FaSignOutAlt className="inline ml-2 text-xl" />
                      Sign Out
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {!session && (
              <>
                {providers &&
                  Object.values(providers).map((provider, index) => (
                    <button
                      key={index}
                      className=" md:flex items-center text-white bg-gray-700 hover:bg-gray-900 hover:text-white rounded-xl px-3 py-2 h-10"
                      onClick={() => signIn(provider.id)}
                    >
                      <FaGoogle className="inline" />
                    </button>
                  ))}
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
