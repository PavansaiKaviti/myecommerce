"use client";
import React from "react";
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

  // Check if current path is an admin page
  const isAdminPage = pathname.startsWith("/profile/admin");

  // If it's an admin page, just render children without any profile layout
  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-3">
                <Link
                  href="/profile"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === "/profile"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <FaUser className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </Link>

                <Link
                  href="/profile/uploadcoverimage"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === "/profile/uploadcoverimage"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <FaEdit className="w-5 h-5" />
                  <span className="font-medium">Update Image</span>
                </Link>

                <Link
                  href="/profile/oders"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === "/profile/oders"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <FaBoxOpen className="w-5 h-5" />
                  <span className="font-medium">Orders</span>
                </Link>

                <Link
                  href="/profile/notifications"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === "/profile/notifications"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <FaBell className="w-5 h-5" />
                  <span className="font-medium">Notifications</span>
                </Link>

                <Link
                  href="/profile/settings"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === "/profile/settings"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <FaCog className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </Link>

                <div className="border-t border-gray-200 pt-3">
                  <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full"
                  >
                    <FaSignOutAlt className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
