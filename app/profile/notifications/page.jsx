"use client";
import React from "react";
import {
  FaBell,
  FaEnvelope,
  FaShieldAlt,
  FaGift,
} from "@/components/icons/Icons";

const NotificationsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Notifications
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your notification preferences and view recent updates.
        </p>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Notification Preferences
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaBell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Order Updates
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Get notified about order status changes
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaEnvelope className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Email Notifications
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Receive updates via email
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaShieldAlt className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Security Alerts
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Important security notifications
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaGift className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Promotional Offers
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Deals, discounts, and special offers
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Recent Notifications
        </h2>

        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <FaBell className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Order #12345 has been shipped
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Your order is on its way! Track your package for real-time
                updates.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                2 hours ago
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <FaGift className="w-5 h-5 text-green-600 dark:text-green-400 mt-1" />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Special offer: 20% off on electronics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Limited time offer on all electronics. Use code: ELECTRONICS20
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                1 day ago
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
            <FaShieldAlt className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1" />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Account security update
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                We've enhanced our security measures to better protect your
                account.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                3 days ago
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
