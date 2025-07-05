"use client";
import React, { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaClock,
} from "@/components/icons/Icons";
import { useSession } from "next-auth/react";
import Image from "next/image";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      if (status === "loading") return;
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/oders");
        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        } else {
          setError(data.message || "Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session, status]);

  const getStatusIcon = (isDelivered) => {
    if (isDelivered) {
      return (
        <FaCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
      );
    } else {
      return (
        <FaClock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
      );
    }
  };

  const getStatusColor = (isDelivered) => {
    if (isDelivered) {
      return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700";
    } else {
      return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700";
    }
  };

  const getStatusText = (isDelivered) => {
    return isDelivered ? "Delivered" : "Processing";
  };

  if (status === "loading" || loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your order history and current shipments.
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your order history and current shipments.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBoxOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Please sign in
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You need to be signed in to view your orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Orders
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your order history and current shipments.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBoxOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start shopping to see your orders here.
            </p>
            <a
              href="/products"
              className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Browse Products
            </a>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm px-4 py-3 md:px-6 md:py-4 flex flex-col gap-2"
            >
              {/* Header Row */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Order #{order._id.slice(-8)}
                  </span>
                  <span className="hidden md:inline">|</span>
                  <span>
                    Placed: {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="hidden md:inline">|</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                      order.isDelivered
                    )}`}
                  >
                    {getStatusIcon(order.isDelivered)}{" "}
                    {getStatusText(order.isDelivered)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Total:
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    ${order.totalPrice || 0}
                  </span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.isPaid
                        ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                        : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>
              {/* Products Row */}
              <div className="flex flex-row gap-3 overflow-x-auto py-2">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center min-w-[90px] max-w-[120px]"
                  >
                    {item.image ? (
                      <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 mb-1">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={56}
                          height={56}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-1">
                        <FaBoxOpen className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                    <div className="text-xs text-gray-700 dark:text-gray-300 truncate w-full text-center">
                      {item.name || "Product"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Qty: {item.quantity || 1}
                    </div>
                  </div>
                ))}
              </div>
              {/* Collapsed Info Row */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
                {order.shippindAddress && (
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Shipping:
                    </span>{" "}
                    {order.shippindAddress.address},{" "}
                    {order.shippindAddress.city}, {order.shippindAddress.state}{" "}
                    {order.shippindAddress.zipcode}{" "}
                    <span className="ml-2">
                      Phone: {order.shippindAddress.phone}
                    </span>
                  </div>
                )}
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Payment:
                  </span>{" "}
                  {order.paymentMethod}
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Order ID:
                  </span>{" "}
                  {order._id}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
