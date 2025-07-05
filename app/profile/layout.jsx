"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FaUser,
  FaEdit,
  FaBoxOpen,
  FaSignOutAlt,
  FaCog,
  FaBell,
} from "@/components/icons/Icons";

export default function ProfileLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if current path is an admin page
  const isAdminPage = pathname.startsWith("/profile/admin");

  // If it's an admin page, just render children without any profile layout
  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg font-bold tracking-wide text-gray-800 dark:text-white">
            Profile
          </span>
        </div>
        <nav className="mt-6 flex flex-col gap-1 px-4">
          <Link
            href="/profile"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/profile"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <FaUser className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </Link>

          <Link
            href="/profile/uploadcoverimage"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/profile/uploadcoverimage"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <FaEdit className="w-5 h-5" />
            <span className="font-medium">Update Image</span>
          </Link>

          <Link
            href="/profile/oders"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/profile/oders"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <FaBoxOpen className="w-5 h-5" />
            <span className="font-medium">Orders</span>
          </Link>

          <Link
            href="/profile/notifications"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/profile/notifications"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <FaBell className="w-5 h-5" />
            <span className="font-medium">Notifications</span>
          </Link>

          <Link
            href="/profile/settings"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/profile/settings"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <FaCog className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors w-full"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-0">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
