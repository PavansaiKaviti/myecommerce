"use client";
import Adminlink from "@/components/adminlink/Adminlink";
import { FaTrash } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import Loadingpage from "@/app/loading";
import toast from "react-hot-toast";

const Adminusers = () => {
  const [users, setusers] = useState([]);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    const fetchallusers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/admin/users`,
          {
            cache: "no-store",
          }
        );
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setusers(data);
      } catch (error) {
        console.log(error);
      } finally {
        setRefresh(false);
      }
    };
    fetchallusers();
  }, [refresh]);

  const deleteuser = async (id) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_API}/admin/deleteuser/${id}`,
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
        {users.length === 0 ? (
          <Loadingpage />
        ) : (
          <div className=" w-3/4 lg:w-1/2">
            <table className="table-auto w-full border-collapse border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border border-gray-300">N0</th>
                  <th className="px-4 py-2 border border-gray-300">ID</th>
                  <th className="px-4 py-2 border border-gray-300">NAME</th>
                  <th className="px-4 py-2 border border-gray-300">EMAIL</th>
                  <th className="px-4 py-2 border border-gray-300">ADMIN</th>
                  <th className="px-4 py-2 border border-gray-300">EDIT</th>
                </tr>
              </thead>
              <tbody>
                {users.map((x, index) => (
                  <tr className="hover:bg-gray-100" key={x._id}>
                    <td className="px-4 py-2 border border-gray-300">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {x._id}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-nowrap">
                      {x.username}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {x.email}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {x.isAdmin ? "yes" : "no"}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-center text-lg text-nowrap">
                      <button onClick={() => deleteuser(x._id)}>
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
    </div>
  );
};

export default Adminusers;
