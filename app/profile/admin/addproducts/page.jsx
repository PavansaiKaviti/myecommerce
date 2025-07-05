"use client";
import Adminlink from "@/components/adminlink/Adminlink";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaImage, FaPlus } from "react-icons/fa";

const Addproducts = () => {
  const [productdata, setProductdata] = useState({
    name: "",
    description: "",
    brand: "",
    category: "",
    price: 0,
    countInStock: 0,
  });
  const [file, setfile] = useState("");
  const router = useRouter();

  const onchangeHandler = (e) => {
    setProductdata({ ...productdata, [e.target.name]: e.target.value });
  };

  const onchangeimageHandler = (e) => {
    setfile(e.target.files[0]);
  };

  const onsubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const formdata = new FormData();
      formdata.append("name", productdata.name);
      formdata.append("description", productdata.description);
      formdata.append("brand", productdata.brand);
      formdata.append("category", productdata.category);
      formdata.append("price", productdata.price);
      formdata.append("countInStock", productdata.countInStock);
      formdata.append("image", file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_API}/admin/addproduct`,
        { method: "POST", body: formdata }
      );
      if (res.status === 200) {
        const data = await res.json();
        toast.success(data.message);
        router.push("/products");
      } else {
        toast.error("product not uploaded");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Add New Product
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create a new product listing for your store
          </p>
        </div>
      </div>

      {/* Content - Full Width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={onsubmitHandler}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Left Side - Image Upload */}
          <div className="lg:w-1/3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Product Image
            </h2>
            <label
              htmlFor="image"
              className="w-full aspect-square max-w-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer relative overflow-hidden group hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            >
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-blue-400 dark:group-hover:text-blue-300 transition-colors">
                  <FaImage className="text-5xl mb-3" />
                  <span className="text-lg font-medium">
                    Drag & Drop or Click
                  </span>
                  <span className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Upload product image
                  </span>
                </div>
              )}
              <input
                type="file"
                id="image"
                onChange={onchangeimageHandler}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
              />
            </label>
          </div>

          {/* Right Side - Form Fields */}
          <div className="lg:w-2/3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Product Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={productdata.name}
                  onChange={onchangeHandler}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter product name"
                />
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Brand *
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={productdata.brand}
                  onChange={onchangeHandler}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter brand name"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Category *
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={productdata.category}
                  onChange={onchangeHandler}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter category"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={productdata.price}
                  onChange={onchangeHandler}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="0.00"
                />
              </div>

              {/* Stock Quantity */}
              <div className="space-y-2">
                <label
                  htmlFor="countInStock"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="countInStock"
                  name="countInStock"
                  value={productdata.countInStock}
                  onChange={onchangeHandler}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={productdata.description}
                onChange={onchangeHandler}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-vertical"
                placeholder="Enter product description..."
              />
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FaPlus className="w-4 h-4" />
                Add Product
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addproducts;
