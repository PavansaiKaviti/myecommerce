"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaUsers,
  FaBoxOpen,
  FaChartBar,
  FaBox,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaCog,
} from "@/components/icons/Icons";
import Loadingpage from "@/app/loading";
import { useToast } from "@/components/toast/Toast";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "@/components/pagination/Pagination";
import { addpages } from "@/app/globalstore/reduxslices/pageSlice/Pageslice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useRouter } from "next/navigation";

const Admin = () => {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(null);
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [analytics, setAnalytics] = useState({
    products: 0,
    users: 0,
    orders: 0,
    sales: 0,
  });
  const { value } = useSelector((state) => state.page);
  const dispatch = useDispatch();
  const { success, error } = useToast();

  // Admin protection
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/api/auth/signin");
      return;
    }
    // Fetch user profile to check isAdmin
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          setIsAdmin(false);
          return;
        }
        const user = await res.json();
        setIsAdmin(user.isAdmin);
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [session, status, router]);

  // Fetch analytics
  useEffect(() => {
    if (!isAdmin) return; // Only fetch if admin is confirmed
    async function fetchAnalytics() {
      try {
        // Products
        const prodRes = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/admin/products`
        );
        const prodData = await prodRes.json();
        const totalProducts = prodData.products ? prodData.products.length : 0;
        // Users
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/admin/users`
        );
        const userData = await userRes.json();
        const totalUsers = userData.length || 0;
        // Orders
        const orderRes = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/admin/orders`
        );
        const orderData = await orderRes.json();
        const totalOrders = orderData.orders ? orderData.orders.length : 0;
        // Sales
        const totalSales = orderData.orders
          ? orderData.orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
          : 0;
        setAnalytics({
          products: totalProducts,
          users: totalUsers,
          orders: totalOrders,
          sales: totalSales,
        });
      } catch (e) {
        setAnalytics({ products: 0, users: 0, orders: 0, sales: 0 });
      }
    }
    fetchAnalytics();
  }, [isAdmin]);

  // Fetch products for table
  useEffect(() => {
    if (!isAdmin) return; // Only fetch if admin is confirmed
    const fetchallproducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/admin/products?page=${value}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          console.error("Failed to fetch products:", res.status);
          return;
        }
        const data = await res.json();
        console.log("Fetched products:", data);
        setProducts(data.products || []);
        dispatch(addpages(data.pages || 1));
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setRefresh(false);
      }
    };
    fetchallproducts();
  }, [refresh, value, dispatch, isAdmin]);

  // Now handle conditional rendering after all hooks
  if (status === "loading" || isAdmin === null) {
    return <Loadingpage />;
  }
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCog className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            You don't have permission to access this area.
          </p>
        </div>
      </div>
    );
  }

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_API}/admin/deleteproduct/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      success(data.message);
      setRefresh(true);
    } catch (error) {
      error(error.data || error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-4">
          {session?.user?.image && (
            <div className="relative">
              <Image
                src={session.user.image}
                alt="profile"
                width={64}
                height={64}
                className="rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></div>
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Here's what's happening with your store today.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <FaCog className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Admin Panel
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Products
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.products}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <FaBox className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Orders
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.orders}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <FaBoxOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Users
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.users}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <FaUsers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Sales
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${analytics.sales.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <FaDollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Analytics Overview
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Orders and users growth over time
            </p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                { month: "Jan", orders: 24, users: 10 },
                { month: "Feb", orders: 30, users: 15 },
                { month: "Mar", orders: 18, users: 12 },
                { month: "Apr", orders: 27, users: 20 },
                { month: "May", orders: 35, users: 25 },
                { month: "Jun", orders: 40, users: 30 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#10b981"
                strokeWidth={3}
                activeDot={{ r: 8, fill: "#10b981" }}
                name="Orders"
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#8b5cf6"
                strokeWidth={3}
                activeDot={{ r: 8, fill: "#8b5cf6" }}
                name="Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Products
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Manage your product catalog
            </p>
          </div>
          <Link
            href="/profile/admin/addproducts"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <FaPlus className="w-4 h-4" />
            Add Product
          </Link>
        </div>

        {refresh ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">
              Loading products...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <FaBox className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by adding your first product to the catalog.
            </p>
            <Link
              href="/profile/admin/addproducts"
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 6).map((product) => (
              <div
                key={product._id}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-600 flex-shrink-0">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <FaBox className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Stock:{" "}
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          {product.countInStock}
                        </span>
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        ${product.price}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/profile/admin/editproducts/${product._id}`}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors text-center flex items-center justify-center gap-1"
                  >
                    <FaEdit className="w-3 h-3" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors text-center flex items-center justify-center gap-1"
                  >
                    <FaTrash className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {products.length > 6 && (
          <div className="mt-6 text-center">
            <Link
              href="/profile/admin"
              className="text-blue-500 hover:text-blue-600 font-medium text-sm"
            >
              View all products →
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex justify-center">
          <Pagination page={value} />
        </div>
      )}
    </div>
  );
};

export default Admin;
