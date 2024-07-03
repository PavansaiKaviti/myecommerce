"use client";
import { addpages } from "@/app/globalstore/reduxslices/pageSlice/Pageslice";
import Loadingpage from "@/app/loading";
import Adminlink from "@/components/adminlink/Adminlink";
import Pagination from "@/components/pagination/Pagination";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const Adminoders = () => {
  const [orders, setorders] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const { value } = useSelector((state) => state.page);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchallusers = async () => {
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
    fetchallusers();
  }, [refresh, value]);

  const deleteorder = async (id) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_API}/admin/deleteorder/${id}`,
      { method: "DELETE" }
    );
    const data = await res.json();
    const { message } = data;
    toast.success(message);
    setRefresh(true);
  };

  return (
    <div>
      <div className="flex  justify-center mt-12">WELCOME ADMIN</div>
      <div className="flex  justify-center mt-12">
        <Adminlink />
      </div>
      <div className="flex flex-col items-center  w-full mt-12 my-8">
        {orders.length === 0 ? (
          <Loadingpage />
        ) : (
          <div className=" w-3/4 lg:w-1/2">
            <table className="table-auto w-full border-collapse border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border border-gray-300">N0</th>
                  <th className="px-4 py-2 border border-gray-300">ID</th>
                  <th className="px-4 py-2 border border-gray-300">PRICE</th>
                  <th className="px-4 py-2 border border-gray-300">
                    DELIVERED
                  </th>
                  <th className="px-4 py-2 border border-gray-300">PAID</th>
                  <th className="px-4 py-2 border border-gray-300">EDIT</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((x, index) => (
                  <tr className="hover:bg-gray-100" key={x._id}>
                    <td className="px-4 py-2 border border-gray-300">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {x._id}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-nowrap">
                      {x.totalPrice}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {x.isDelivered ? "yes" : "no"}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {x.isPaid ? "yes" : "no"}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-center text-lg text-nowrap">
                      <button onClick={() => deleteorder(x._id)}>
                        <FaTrash className="text-red-500 hover:text-blue-700 cursor-pointer inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={value} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Adminoders;
