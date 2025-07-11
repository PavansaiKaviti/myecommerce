"use client";
import Loadingpage from "@/app/loading";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/toast/Toast";
import {
  FaEdit,
  FaSave,
  FaArrowLeft,
  FaUpload,
} from "@/components/icons/Icons";

const Editproduct = () => {
  const [productdata, setProductdata] = useState({
    name: "",
    description: "",
    brand: "",
    category: "",
    price: 0,
    countInStock: 0,
  });
  const [file, setfile] = useState("");
  const { id } = useParams();
  const { success, error } = useToast();

  useEffect(() => {
    const fetchaproducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/products/${id}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setProductdata({
          name: data.name,
          description: data.description,
          brand: data.brand,
          category: data.category,
          price: data.price,
          countInStock: data.countInStock,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchaproducts();
  }, []);

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
        `${process.env.NEXT_PUBLIC_DOMAIN_API}/admin/editproduct/${id}`,
        { method: "PUT", body: formdata }
      );
      if (res.status === 200) {
        const data = await res.json();
        success(data.message);
        router.push(`/products/${id}`);
      } else {
        error("product unable to edit");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return Object.keys(productdata).length === 0 ? (
    <Loadingpage />
  ) : (
    <div>
      <div className="flex  justify-center mt-12 text-xl font-bold">
        Edit product
      </div>
      <div className="flex flex-col items-center h-3/4 w-full  mt-12 my-8">
        <div className="border p-6 w-1/2 rounded-lg shadow-lg  bg-white">
          <form className="space-y-6 text-md" onSubmit={onsubmitHandler}>
            <div>
              <label
                htmlFor="name"
                className="block text-md  font-bold text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={productdata.name}
                placeholder="Name"
                onChange={onchangeHandler}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-md  font-bold text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={productdata.description}
                placeholder="Description"
                onChange={onchangeHandler}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="brand"
                className="block text-md  font-bold text-gray-700"
              >
                Brand
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                placeholder="Brand"
                value={productdata.brand}
                onChange={onchangeHandler}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-md  font-bold text-gray-700"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={productdata.category}
                onChange={onchangeHandler}
                placeholder="Category"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-md  font-bold text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={productdata.price}
                onChange={onchangeHandler}
                placeholder="Price"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="countInStock"
                className="block text-md  font-bold text-gray-700"
              >
                Count In Stock
              </label>
              <input
                type="text"
                id="countInStock"
                name="countInStock"
                value={productdata.countInStock}
                onChange={onchangeHandler}
                placeholder="Count In Stock"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-md  font-bold text-gray-700"
              >
                Image
              </label>
              <input
                type="file"
                id="image"
                onChange={onchangeimageHandler}
                className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-600">
                Upload an image file (jpg, png, etc.)
              </p>
            </div>
            <div className=" flex justify-center">
              <button
                type="submit"
                className="w-fit py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Editproduct;
