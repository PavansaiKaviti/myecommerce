"use client";
import Adminlink from "@/components/adminlink/Adminlink";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import Loadingpage from "@/app/loading";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "@/components/pagination/Pagination";
import { addpages } from "@/app/globalstore/reduxslices/pageSlice/Pageslice";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const { value } = useSelector((state) => state.page);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchallproducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/admin/products?page=${value}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setProducts(data.products);
        dispatch(addpages(data.pages));
      } catch (error) {
        console.log(error);
      } finally {
        setRefresh(false);
      }
    };

    fetchallproducts();
  }, [refresh, value]);

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_API}/admin/deleteproduct/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      toast.success(data.message);
      setRefresh(true);
    } catch (error) {
      toast.error(error.data || error.message);
    }
  };

  return (
    <div>
      <div className="flex  justify-center mt-12">WELCOME ADMIN</div>
      <div className="flex  justify-center mt-12">
        <Adminlink />
      </div>
      <div className="flex flex-col items-center  w-full mt-12 my-8">
        {products.length === 0 ? (
          <Loadingpage />
        ) : (
          <div className=" w-3/4 lg:w-1/2">
            <table className="table-auto w-full rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 ">N0</th>
                  <th className="px-4 py-2 ">ID</th>
                  <th className="px-4 py-2 ">NAME</th>
                  <th className="px-4 py-2 ">PRICE</th>
                  <th className="px-4 py-2 ">QTY</th>
                  <th className="px-4 py-2 ">EDIT</th>
                </tr>
              </thead>
              <tbody>
                {products.map((x, index) => (
                  <tr className="hover:bg-gray-100" key={x.id}>
                    <td className="px-4 py-2 ">{index + 1}</td>
                    <td className="px-4 py-2 ">
                      <Link
                        href={`${process.env.NEXT_PUBLIC_LOCAL_API}/products/${x._id}`}
                        className="hover:underline"
                      >
                        {x._id}
                      </Link>
                    </td>
                    <td className="px-4 py-2 ">{x.name}</td>
                    <td className="px-4 py-2 ">${x.price}</td>
                    <td className="px-4 py-2 ">{x.countInStock}</td>
                    <td className="px-4 py-2  text-center text-lg text-nowrap">
                      <Link
                        className="mr-4"
                        href={`/profile/admin/editproducts/${x._id}`}
                      >
                        <FaEdit className="text-blue-500 hover:text-blue-700 cursor-pointer inline" />
                      </Link>
                      <button onClick={() => deleteProduct(x._id)}>
                        <FaTrash className="text-red-500 hover:text-blue-700 cursor-pointer inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination page={value} />
    </div>
  );
};

export default Admin;
