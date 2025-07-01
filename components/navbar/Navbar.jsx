"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaGoogle,
  FaBell,
  FaUser,
  FaBoxOpen,
  FaSignOutAlt,
  FaCogs,
  FaBars,
  FaTimes,
} from "@/components/icons/Icons";
import profile from "@/assets/images/profile.png";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [providers, setproviders] = useState(null);
  const [profileNav, setprofileNav] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { items } = useSelector((state) => state.cart);
  const numofitems = items.length;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const setauthproviders = async () => {
      const res = await getProviders();
      setproviders(res);
    };
    setauthproviders();
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenu(false);
    setprofileNav(false);
  }, [pathname]);

  // Prevent hydration mismatch by not rendering cart count until client-side
  const shouldShowCartCount =
    isClient && status !== "loading" && numofitems > 0;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                DINO
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <Link
              href="/"
              className={`${
                pathname === "/"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700"
              } hover:bg-blue-100 hover:text-blue-800 px-3 py-2 rounded-lg font-medium transition`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`${
                pathname === "/products"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700"
              } hover:bg-blue-100 hover:text-blue-800 px-3 py-2 rounded-lg font-medium transition`}
            >
              Products
            </Link>
            <Link
              href="/products/cart"
              className={`relative ${
                pathname === "/products/cart"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700"
              } hover:bg-blue-100 hover:text-blue-800 px-3 py-2 rounded-lg font-medium transition flex items-center`}
            >
              Cart
              {shouldShowCartCount && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                  {numofitems}
                </span>
              )}
            </Link>
            {/* Search bar (desktop) */}
            <div className="hidden lg:block ml-4">
              <input
                type="text"
                className="w-48 h-9 px-4 py-2 border rounded-xl focus:outline-none focus:border-gray-500"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Profile/Login (desktop) */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {session ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center focus:outline-none"
                  onClick={() => setprofileNav((prev) => !prev)}
                  aria-label="Open user menu"
                >
                  <Image
                    className="h-9 w-9 rounded-full border"
                    src={session.user.image || profile}
                    alt="profile"
                    width={36}
                    height={36}
                  />
                </button>
                {/* Profile dropdown */}
                <div
                  className={`${
                    profileNav ? "" : "hidden"
                  } absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                  role="menu"
                  aria-orientation="vertical"
                  tabIndex="-1"
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    tabIndex="-1"
                    onClick={() => setprofileNav(false)}
                  >
                    <div className="flex items-center gap-2">
                      <FaUser className="text-lg" />
                      {session?.user?.name || "Your Profile"}
                    </div>
                  </Link>
                  <div className="border-t my-1"></div>
                  {session.isAdmin && (
                    <Link
                      href="/profile/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => setprofileNav(false)}
                    >
                      <div className="flex items-center gap-2">
                        <FaCogs className="text-lg" />
                        Dashboard
                      </div>
                    </Link>
                  )}
                  <Link
                    href="/profile/notifications"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    tabIndex="-1"
                    onClick={() => setprofileNav(false)}
                  >
                    <div className="flex items-center gap-2">
                      <FaBell className="text-lg" />
                      Notifications
                    </div>
                  </Link>
                  <Link
                    href="/profile/oders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    tabIndex="-1"
                    onClick={() => setprofileNav(false)}
                  >
                    <div className="flex items-center gap-2">
                      <FaBoxOpen className="text-lg" />
                      Orders
                    </div>
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => signOut()}
                  >
                    <div className="flex items-center gap-2">
                      <FaSignOutAlt className="text-lg" />
                      Sign Out
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition"
                onClick={() => signIn()}
              >
                Sign In
              </button>
            )}
          </div>

          {/* Hamburger menu (mobile) */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenu((prev) => !prev)}
              className="text-2xl text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenu ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="md:hidden bg-white shadow-lg px-4 pt-4 pb-6 space-y-2">
          <Link
            href="/"
            className={`block px-3 py-2 rounded-lg font-medium ${
              pathname === "/" ? "bg-blue-500 text-white" : "text-gray-700"
            } hover:bg-blue-600 hover:text-white transition`}
            onClick={() => setMobileMenu(false)}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`block px-3 py-2 rounded-lg font-medium ${
              pathname === "/products"
                ? "bg-blue-500 text-white"
                : "text-gray-700"
            } hover:bg-blue-600 hover:text-white transition`}
            onClick={() => setMobileMenu(false)}
          >
            Products
          </Link>
          <Link
            href="/products/cart"
            className={`block px-3 py-2 rounded-lg font-medium flex items-center ${
              pathname === "/products/cart"
                ? "bg-blue-500 text-white"
                : "text-gray-700"
            } hover:bg-blue-600 hover:text-white transition`}
            onClick={() => setMobileMenu(false)}
          >
            Cart
            {shouldShowCartCount && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                {numofitems}
              </span>
            )}
          </Link>
          {/* Search bar (mobile) */}
          <div className="pt-2">
            <input
              type="text"
              className="w-full h-9 px-4 py-2 border rounded-xl focus:outline-none focus:border-gray-500"
              placeholder="Search..."
            />
          </div>
          {/* Profile/Login (mobile) */}
          <div className="pt-2">
            {session ? (
              <div className="flex items-center gap-2">
                <Image
                  className="h-8 w-8 rounded-full border"
                  src={session.user.image || profile}
                  alt="profile"
                  width={32}
                  height={32}
                />
                <span className="font-medium text-gray-700">
                  {session?.user?.name || "Your Profile"}
                </span>
                <button
                  className="ml-auto text-red-600 hover:underline"
                  onClick={() => signOut()}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                className="w-full bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition"
                onClick={() => signIn()}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
