"use client";
import { addpages } from "@/app/globalstore/reduxslices/pageSlice/Pageslice";
import Loadingpage from "@/app/loading";
import Adminlink from "@/components/adminlink/Adminlink";
import Pagination from "@/components/pagination/Pagination";
import React, { useEffect, useState } from "react";
import {
  FaTrash,
  FaBox,
  FaUser,
  FaCalendar,
  FaDollarSign,
  FaCheckCircle,
  FaTimesCircle,
  FaHashtag,
  FaEye,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/toast/Toast";

const Adminoders = () => {
  const [orders, setorders] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const { value } = useSelector((state) => state.page);
  const dispatch = useDispatch();
  const { success, error } = useToast();

  useEffect(() => {
    const fetchallorders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/admin/orders?page=${value}`,
          {
            cache: "no-store",
          }
        );
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setorders(data.orders);
        dispatch(addpages(data.pages));
      } catch (error) {
        console.log(error);
      } finally {
        setRefresh(false);
      }
    };
    fetchallorders();
  }, [refresh, value, dispatch]);

  const deleteorder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_API}/admin/deleteorder/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      success(data.message);
      setRefresh(true);
    } catch (error) {
      error("Failed to delete order");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateId = (id) => {
    return id.length > 12 ? `${id.substring(0, 12)}...` : id;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Orders Management
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage and track all customer orders
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg font-medium">
            Total Orders: {orders.length}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {orders.length === 0 ? (
          <Loadingpage />
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200"
              >
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <FaBox className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Order #{index + 1}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <FaHashtag className="text-blue-400" />
                          <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                            {truncateId(order._id)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-black dark:text-white">
                        ${order.totalPrice}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 justify-end">
                        <FaCalendar className="text-xs" />
                        {formatDate(order.createdAt || new Date())}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Customer Info */}
                    {order.user && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <FaUser className="text-blue-500" />
                          Customer
                        </div>
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {order.user.username || order.user.email}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {order.user.email}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Status */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status
                      </div>
                      <div className="flex gap-2">
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            order.isPaid
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          }`}
                        >
                          {order.isPaid ? (
                            <FaCheckCircle className="text-xs" />
                          ) : (
                            <FaTimesCircle className="text-xs" />
                          )}
                          {order.isPaid ? "Paid" : "Unpaid"}
                        </div>
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            order.isDelivered
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                              : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                          }`}
                        >
                          {order.isDelivered ? (
                            <FaCheckCircle className="text-xs" />
                          ) : (
                            <FaBox className="text-xs" />
                          )}
                          {order.isDelivered ? "Delivered" : "Pending"}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Actions
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-600 transition flex items-center gap-1">
                          <FaEye className="text-xs" />
                          View
                        </button>
                        <button
                          onClick={() => deleteorder(order._id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-600 transition flex items-center gap-1"
                        >
                          <FaTrash className="text-xs" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  {order.orderItems && order.orderItems.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Items ({order.orderItems.length})
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {order.orderItems.slice(0, 6).map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="relative flex-shrink-0"
                          >
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name || "Product"}
                                  width={64}
                                  height={64}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <FaBox className="text-gray-400" />
                              )}
                            </div>
                            {item.quantity > 1 && (
                              <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {item.quantity}
                              </div>
                            )}
                            <div className="mt-1 text-xs text-gray-600 text-center truncate w-16">
                              {item.name}
                            </div>
                          </div>
                        ))}
                        {order.orderItems.length > 6 && (
                          <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 text-xs text-gray-500 font-semibold">
                            +{order.orderItems.length - 6}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <Pagination page={value} />
        </div>
      </div>
    </div>
  );
};

export default Adminoders;
