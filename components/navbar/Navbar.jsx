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
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  onClick={() => setprofileNav((prev) => !prev)}
                  aria-label="Open user menu"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        className="h-10 w-10 rounded-full border-2 border-gray-200 dark:border-gray-600 shadow-sm"
                        src={session.user.image || profile}
                        alt="profile"
                        width={40}
                        height={40}
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {session?.user?.name || "User"}
                      </p>
                    </div>
                  </div>
                </button>
                {/* Professional Profile dropdown */}
                <div
                  className={`${
                    profileNav
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  } absolute right-0 mt-3 w-80 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none border border-gray-200 dark:border-gray-700 transition-all duration-200 ease-out`}
                  role="menu"
                  aria-orientation="vertical"
                  tabIndex="-1"
                >
                  {/* User Info Header */}
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <Image
                        className="h-12 w-12 rounded-full border-2 border-gray-200 dark:border-gray-600"
                        src={session.user.image || profile}
                        alt="profile"
                        width={48}
                        height={48}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {session?.user?.name || "User"}
                        </p>
                        {session.isAdmin && (
                          <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => setprofileNav(false)}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700">
                        <FaUser className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">Profile</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Manage your account
                        </p>
                      </div>
                    </Link>

                    {session.isAdmin && (
                      <Link
                        href="/profile/admin"
                        className="flex items-center gap-3 px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        role="menuitem"
                        tabIndex="-1"
                        onClick={() => setprofileNav(false)}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <FaCogs className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">Admin Dashboard</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Manage store
                          </p>
                        </div>
                      </Link>
                    )}

                    <Link
                      href="/profile/notifications"
                      className="flex items-center gap-3 px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => setprofileNav(false)}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                        <FaBell className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <p className="font-medium">Notifications</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          View alerts
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/profile/oders"
                      className="flex items-center gap-3 px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => setprofileNav(false)}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30">
                        <FaBoxOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Orders</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Track purchases
                        </p>
                      </div>
                    </Link>
                  </div>

                  {/* Sign Out Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                    <button
                      className="w-full flex items-center gap-3 px-6 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      onClick={() => signOut()}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30">
                        <FaSignOutAlt className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="font-medium">Sign Out</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Log out of your account
                        </p>
                      </div>
                    </button>
                  </div>
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
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            {status === "loading" ? (
              // Show skeleton while session is loading
              <div className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                </div>
              </div>
            ) : session ? (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <Image
                      className="h-12 w-12 rounded-full border-2 border-gray-200 dark:border-gray-600"
                      src={session.user.image || profile}
                      alt="profile"
                      width={48}
                      height={48}
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {session?.user?.name || "User"}
                    </p>
                    {session.isAdmin && (
                      <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setMobileMenu(false)}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700">
                      <FaUser className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="font-medium">Profile</span>
                  </Link>

                  {session.isAdmin && (
                    <Link
                      href="/profile/admin"
                      className="flex items-center gap-3 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setMobileMenu(false)}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <FaCogs className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-medium">Admin Dashboard</span>
                    </Link>
                  )}

                  <Link
                    href="/profile/notifications"
                    className="flex items-center gap-3 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setMobileMenu(false)}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                      <FaBell className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span className="font-medium">Notifications</span>
                  </Link>

                  <Link
                    href="/profile/oders"
                    className="flex items-center gap-3 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setMobileMenu(false)}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <FaBoxOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-medium">Orders</span>
                  </Link>

                  <button
                    className="w-full flex items-center gap-3 p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    onClick={() => signOut()}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30">
                      <FaSignOutAlt className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
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
