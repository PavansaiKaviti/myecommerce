"use client";
import { FaTrash, FaUser, FaEnvelope, FaCrown } from "@/components/icons/Icons";
import React, { useEffect, useState } from "react";
import Loadingpage from "@/app/loading";
import toast from "react-hot-toast";
import Image from "next/image";

const Adminusers = () => {
  const [users, setusers] = useState([]);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    const fetchallusers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/admin/users`,
          {
            cache: "no-store",
          }
        );
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setusers(data);
      } catch (error) {
        console.log(error);
      } finally {
        setRefresh(false);
      }
    };
    fetchallusers();
  }, [refresh]);

  const deleteuser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_API}/admin/deleteuser/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      toast.success(data.message);
      setRefresh(true);
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 mt-8 mx-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Users Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base">
            Manage all registered users
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg font-medium text-sm">
          Total Users: {users.length}
        </div>
      </div>

      {/* Users Grid */}
      <div className="px-6">
        {users.length === 0 ? (
          <Loadingpage />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user, index) => (
              <div
                key={user._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition"
              >
                {/* User Avatar and Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200 dark:border-gray-600 flex-shrink-0">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.username || "User"}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <FaUser className="text-blue-500 text-2xl" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-semibold text-gray-900 dark:text-white text-lg">
                        {user.username || "No Name"}
                      </div>
                      {user.isAdmin && (
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 flex-shrink-0">
                          <FaCrown className="text-xs" />
                          Admin
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 break-all">
                      {user.email}
                    </div>
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <FaEnvelope className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <span className="break-all">{user.email}</span>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded font-mono break-all">
                    ID: {user._id}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                  <button
                    onClick={() => deleteuser(user._id)}
                    className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <FaTrash className="text-xs" />
                    Delete User
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Adminusers;
