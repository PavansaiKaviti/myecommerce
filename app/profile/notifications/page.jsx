"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  FaBell,
  FaTimes,
  FaCheck,
  FaStarIcon,
  FaTag,
  FaGift,
} from "@/components/icons/Icons";
import offers from "@/public/images/offers.jpg";
import apple from "@/public/images/apple.jpg";
import tech from "@/public/images/tech.jpg";
import appliances from "@/public/images/appliances.jpg";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "offer",
      title: "Amazon Sales - 50% Off",
      message: "Huge discounts on electronics and home appliances",
      image: offers,
      time: "2 hours ago",
      read: false,
      priority: "high",
    },
    {
      id: 2,
      type: "deal",
      title: "Apple Student Deals",
      message: "Special pricing for students on MacBooks and iPads",
      image: apple,
      time: "1 day ago",
      read: true,
      priority: "medium",
    },
    {
      id: 3,
      type: "offer",
      title: "Tech Deals - 50% Off",
      message: "Amazing deals on smartphones and laptops",
      image: tech,
      time: "2 days ago",
      read: false,
      priority: "high",
    },
    {
      id: 4,
      type: "deal",
      title: "Home Appliances Sale",
      message: "Up to 40% off on kitchen and home appliances",
      image: appliances,
      time: "3 days ago",
      read: true,
      priority: "low",
    },
  ]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBell className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notifications
          </h3>
          <p className="text-gray-600">
            You're all caught up! Check back later for new offers.
          </p>
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md ${
              !notification.read ? "border-l-4 border-l-blue-500" : ""
            }`}
          >
            <div className="flex items-start space-x-4">
              {/* Notification Image */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={notification.image}
                    alt={notification.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Notification Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                      {notification.priority === "high" && (
                        <FaStarIcon className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{notification.time}</span>
                      <div className="flex items-center space-x-1">
                        {notification.type === "offer" ? (
                          <FaTag className="w-3 h-3" />
                        ) : (
                          <FaGift className="w-3 h-3" />
                        )}
                        <span className="capitalize">{notification.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <FaCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete notification"
                    >
                      <FaTimes className="w-4 h-4" />
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

export default Notifications;
