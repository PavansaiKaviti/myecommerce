"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/toast/Toast";
import {
  FaTrash,
  FaUser,
  FaEnvelope,
  FaCrown,
  FaCalendar,
  FaUsers,
  FaEye,
  FaShieldAlt,
} from "@/components/icons/Icons";
import React from "react";
import Loadingpage from "@/app/loading";
import Image from "next/image";

const Adminusers = () => {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

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
        setUsers(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchallusers();
  }, []);

  const deleteuser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_API}/admin/deleteuser/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      success(data.message);
      // Refresh the users list
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      error("Failed to delete user");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const adminUsers = users.filter((user) => user.isAdmin);
  const regularUsers = users.filter((user) => !user.isAdmin);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Users Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Manage all registered users and their permissions
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Users
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.length}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Admins
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {adminUsers.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Mobile */}
      <div className="md:hidden grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Users
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {users.length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Admins
          </div>
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {adminUsers.length}
          </div>
        </div>
      </div>

      {/* Users Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              All Users
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Manage user accounts and permissions
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <FaUsers className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              No users have registered yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200"
              >
                {/* User Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-600 shadow-lg">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.username || "User"}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <FaUser className="text-blue-600 dark:text-blue-400 text-2xl" />
                      )}
                    </div>
                    {user.isAdmin && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full border-2 border-white dark:border-gray-600 flex items-center justify-center">
                        <FaCrown className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">
                        {user.username || "No Name"}
                      </h3>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </div>
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FaEnvelope className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300 truncate">
                      {user.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <FaCalendar className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Joined: {formatDate(user.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <FaShieldAlt className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {user.isAdmin ? "Administrator" : "Regular User"}
                    </span>
                  </div>
                </div>

                {/* User ID */}
                <div className="mb-4">
                  <div className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-600 px-3 py-2 rounded-lg font-mono break-all">
                    ID: {user._id}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => deleteuser(user._id)}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaTrash className="w-3 h-3" />
                    Delete
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
