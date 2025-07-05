"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FaChartBar,
  FaPlus,
  FaUsers,
  FaBoxOpen,
} from "@/components/icons/Icons";

const SIDEBAR_LINKS = [
  { href: "/profile/admin", label: "Dashboard", icon: <FaChartBar /> },
  {
    href: "/profile/admin/addproducts",
    label: "Add Product",
    icon: <FaPlus />,
  },
  { href: "/profile/admin/users", label: "Users", icon: <FaUsers /> },
  { href: "/profile/admin/oders", label: "Orders", icon: <FaBoxOpen /> },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg font-bold tracking-wide text-gray-800 dark:text-white">
            Admin
          </span>
        </div>
        <nav className="mt-6 flex flex-col gap-1 px-4">
          {SIDEBAR_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition hover:bg-[#f2f3f5] dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
                typeof window !== "undefined" &&
                window.location.pathname === link.href
                  ? "bg-[#e9eaf0] dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-bold"
                  : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
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
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
}
