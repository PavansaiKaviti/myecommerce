"use client";
import { addpages } from "@/app/globalstore/reduxslices/pageSlice/Pageslice";
import Loadingpage from "@/app/loading";
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
  FaBoxOpen,
  FaTruck,
  FaCreditCard,
} from "@/components/icons/Icons";
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

  const paidOrders = orders.filter((order) => order.isPaid);
  const deliveredOrders = orders.filter((order) => order.isDelivered);
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Orders Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Track and manage all customer orders
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Orders
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders.length}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Paid Orders
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {paidOrders.length}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Revenue
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ${totalRevenue.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Mobile */}
      <div className="md:hidden grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {orders.length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Paid
          </div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            {paidOrders.length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Revenue
          </div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            ${totalRevenue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              All Orders
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Manage order status and track deliveries
            </p>
          </div>
        </div>

        {refresh ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">
              Loading orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <FaBoxOpen className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              No orders have been placed yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div
                key={order._id}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl flex items-center justify-center shadow-lg">
                      <FaBox className="text-green-600 dark:text-green-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Order #{index + 1}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FaHashtag className="text-green-500" />
                        <span className="font-mono bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                          {truncateId(order._id)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${order.totalPrice}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 justify-end">
                      <FaCalendar className="text-xs" />
                      {formatDate(order.createdAt || new Date())}
                    </div>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  {/* Customer Info */}
                  {order.user && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <FaUser className="text-green-500" />
                        Customer Details
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">
                          {order.user.username || order.user.email}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                          {order.user.email}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Order Status
                    </div>
                    <div className="space-y-2">
                      <div
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${
                          order.isPaid
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        }`}
                      >
                        {order.isPaid ? (
                          <FaCheckCircle className="text-sm" />
                        ) : (
                          <FaTimesCircle className="text-sm" />
                        )}
                        {order.isPaid ? "Payment Complete" : "Payment Pending"}
                      </div>
                      <div
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${
                          order.isDelivered
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                        }`}
                      >
                        {order.isDelivered ? (
                          <FaTruck className="text-sm" />
                        ) : (
                          <FaBox className="text-sm" />
                        )}
                        {order.isDelivered ? "Delivered" : "In Transit"}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                        <FaEye className="w-3 h-3" />
                        View
                      </button>
                      <button
                        onClick={() => deleteorder(order._id)}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaTrash className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FaBoxOpen className="text-green-500" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Items ({order.orderItems.length})
                      </span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {order.orderItems.slice(0, 6).map((item, itemIndex) => (
                        <div key={itemIndex} className="relative flex-shrink-0">
                          <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-600 shadow-sm">
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
                            <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                              {item.quantity}
                            </div>
                          )}
                          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 text-center truncate w-16">
                            {item.name}
                          </div>
                        </div>
                      ))}
                      {order.orderItems.length > 6 && (
                        <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400 font-semibold">
                          +{order.orderItems.length - 6}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {orders.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination page={value} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Adminoders;
