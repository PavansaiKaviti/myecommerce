"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaGoogle,
  FaBell,
  FaUser,
  FaBoxOpen,
  FaSignOutAlt,
  FaCogs,
  FaBars,
  FaTimes,
  FaSearch,
  FaSun,
  FaMoon,
} from "@/components/icons/Icons";
import profile from "@/assets/images/profile.png";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useSelector } from "react-redux";
import { useTheme } from "@/components/theme/ThemeProvider";

const Navbar = () => {
  const { data: session, status } = useSession();
  const { theme, changeTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [providers, setproviders] = useState(null);
  const [profileNav, setprofileNav] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    changeTheme(newTheme);
  };

  // Prevent hydration mismatch by not rendering cart count until client-side
  const shouldShowCartCount =
    isClient && status !== "loading" && numofitems > 0;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
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
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                  : "text-gray-700 dark:text-gray-300"
              } hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-800 dark:hover:text-blue-200 px-3 py-2 rounded-lg font-medium transition`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`${
                pathname === "/products"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                  : "text-gray-700 dark:text-gray-300"
              } hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-800 dark:hover:text-blue-200 px-3 py-2 rounded-lg font-medium transition`}
            >
              Products
            </Link>
            <Link
              href="/products/cart"
              className={`relative ${
                pathname === "/products/cart"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                  : "text-gray-700 dark:text-gray-300"
              } hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-800 dark:hover:text-blue-200 px-3 py-2 rounded-lg font-medium transition flex items-center`}
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
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-48 h-9 px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-gray-500 dark:focus:border-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Search products..."
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FaSearch className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Profile/Login (desktop) */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {/* Theme toggle button */}
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <FaMoon className="w-5 h-5" />
              ) : (
                <FaSun className="w-5 h-5" />
              )}
            </button>

            {status === "loading" ? (
              // Show skeleton while session is loading
              <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center focus:outline-none"
                  onClick={() => setprofileNav((prev) => !prev)}
                  aria-label="Open user menu"
                >
                  <Image
                    className="h-9 w-9 rounded-full border border-gray-200 dark:border-gray-600"
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
                  } absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none border border-gray-200 dark:border-gray-700`}
                  role="menu"
                  aria-orientation="vertical"
                  tabIndex="-1"
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    onClick={() => setprofileNav(false)}
                  >
                    <div className="flex items-center gap-2">
                      <FaUser className="text-lg" />
                      {session?.user?.name || "Your Profile"}
                    </div>
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  {session.isAdmin && (
                    <Link
                      href="/profile/admin"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
              <Link
                href="/signin"
                className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition"
              >
                Sign In
              </Link>
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
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full h-9 px-4 py-2 pr-10 border rounded-xl focus:outline-none focus:border-gray-500"
                placeholder="Search products..."
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaSearch className="w-4 h-4" />
              </button>
            </form>
          </div>
          {/* Profile/Login (mobile) */}
          <div className="pt-2">
            {status === "loading" ? (
              // Show skeleton while session is loading
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            ) : session ? (
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
              <Link
                href="/signin"
                className="w-full bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
