"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import noOder from "@/public/images/nooder.jpg";
import Errorpage from "@/components/errorpages/Errorpage";
import Loadingpage from "@/app/loading";
import {
  FaBox,
  FaCheckCircle,
  FaClock,
  FaDollarSign,
  FaEye,
  FaDownload,
} from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/oders`
        );
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (isDelivered) => {
    return isDelivered
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const getPaymentColor = (isPaid) => {
    return isPaid ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800";
  };

  const formatOrderId = (id) => {
    return id.slice(-8).toUpperCase();
  };

  if (loading) {
    return <Loadingpage />;
  }

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <Errorpage
          image={noOder}
          height={400}
          message="No Orders yet"
          link="/products"
        />
      ) : (
        orders.map((order, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Order Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <FaBox className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      Order #{formatOrderId(order._id)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(
                      order.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-gray-900">
                    ${order.totalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Content */}
            <div className="p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Product Images */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Items
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {order.items.map((item) => (
                      <div key={item._id}>
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                            priority={true}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Status */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Status
                  </h3>
                  <div className="space-y-3">
                    {/* Delivery Status */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        {order.isDelivered ? (
                          <FaCheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <FaClock className="w-5 h-5 text-yellow-600" />
                        )}
                        <span className="font-medium text-gray-900">
                          Delivery
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.isDelivered
                        )}`}
                      >
                        {order.isDelivered ? "Delivered" : "Processing"}
                      </span>
                    </div>

                    {/* Payment Status */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FaDollarSign className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">
                          Payment
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentColor(
                          order.isPaid
                        )}`}
                      >
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3">
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      <FaEye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                      <FaDownload className="w-4 h-4" />
                      <span>Download Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
