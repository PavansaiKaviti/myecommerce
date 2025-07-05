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
        <div className="text-2xl font-bold text-red-500 dark:text-red-400">
          Not authorized
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
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Info Card */}
      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mt-4 mb-2 mx-4 border border-gray-200 dark:border-gray-700">
        {session?.user?.image && (
          <Image
            src={session.user.image}
            alt="profile"
            width={64}
            height={64}
            className="rounded-full border border-gray-200 dark:border-gray-600 shadow"
          />
        )}
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Welcome{session?.user?.name ? `, ${session.user.name}` : ""}!
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-base">
            Admin Dashboard
          </div>
        </div>
      </div>
      {/* Analytics Section */}
      {/* Stat Cards Row */}
      <div className="flex gap-4 px-4 mb-4">
        <div className="flex-1 bg-gradient-to-tr from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-2xl shadow flex flex-col items-center p-4 border border-transparent">
          <FaBox className="text-3xl text-blue-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {analytics.products}
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-base">
            Products
          </div>
        </div>
        <div className="flex-1 bg-gradient-to-tr from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 rounded-2xl shadow flex flex-col items-center p-4 border border-transparent">
          <FaBoxOpen className="text-3xl text-green-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {analytics.orders}
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-base">
            Orders
          </div>
        </div>
        <div className="flex-1 bg-gradient-to-tr from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 rounded-2xl shadow flex flex-col items-center p-4 border border-transparent">
          <FaUsers className="text-3xl text-purple-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {analytics.users}
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-base">
            Users
          </div>
        </div>
      </div>
      {/* Chart Row */}
      <div className="px-4 mb-6">
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow flex items-center justify-center min-h-[200px] border border-gray-200 dark:border-gray-700 p-4">
          <ResponsiveContainer width="100%" height={200}>
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#34d399"
                strokeWidth={3}
                activeDot={{ r: 8 }}
                name="Orders"
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#a78bfa"
                strokeWidth={3}
                name="Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Dashboard Product Preview */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            Products
          </h3>
          <Link
            href="/profile/admin/addproducts"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Add Product
          </Link>
        </div>

        {refresh ? (
          <div className="text-center py-6">
            <div className="text-gray-500">Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              No products found
            </div>
            <Link
              href="/profile/admin/addproducts"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {products.slice(0, 8).map((x) => (
              <div
                key={x._id}
                className="flex items-center bg-white dark:bg-gray-800 rounded-xl shadow p-3 gap-3 min-h-[72px] border border-gray-200 dark:border-gray-700"
              >
                <div className="w-20 h-20 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-600">
                  {x.image && (
                    <Image
                      src={x.image}
                      alt={x.name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white truncate">
                    {x.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Stock: <span className="font-bold">{x.countInStock}</span>
                  </div>
                </div>
                <div className="font-bold text-blue-600 text-base min-w-[60px] text-right dark:text-white">
                  ${x.price}
                </div>
                <div className="flex flex-col gap-1 ml-2">
                  <Link
                    href={`/profile/admin/editproducts/${x._id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-600 transition text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(x._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-600 transition text-center"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 px-4">
        <Pagination page={value} />
      </div>
    </div>
  );
};

export default Admin;
