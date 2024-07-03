"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaUser, FaEdit, FaBoxOpen, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";

const UploadImage = () => {
  const [file, setFile] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const onchangeHandler = (e) => {
    setFile(e.target.files[0]);
  };
  const onsubmitHandler = async (e) => {
    try {
      e.preventDefault();
      if (!file) {
        toast.error("Please select a file");
        return;
      }
      const formdata = new FormData();
      formdata.append("image", file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_API}/profile/uploadimage`,
        { method: "POST", body: formdata }
      );
      const data = await res.json();
      if (res.status !== 200) {
        toast.error(data.message, {
          position: "top-center",
        });
      }
      toast.success(data.message, {
        position: "top-center",
      });
      router.push("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form
        className="flex  justify-around items-center mt-32"
        onSubmit={onsubmitHandler}
        encType="multipart/form-data"
      >
        <div className="flex flex-col gap-2 self-center  h-fit w-fit">
          <Link
            href="/profile"
            className=" text-black hover:text-white hover:bg-black border rounded-xl shadow-md p-3"
          >
            <FaUser className="inline mr-1" /> profile
          </Link>
          <Link
            href="/profile/uploadcoverimage"
            className={`${
              pathname === "/profile/uploadcoverimage"
                ? "text-white bg-black border"
                : " "
            } text-black  rounded-xl hover:text-white hover:bg-gray-500 border shadow-md p-3`}
          >
            <FaEdit className="inline mr-1" />
            update Image
          </Link>
          {/* <Link
        href="/"
        className=" text-black hover:text-white hover:bg-black border rounded-xl shadow-md  p-3"
      >
        <FaEdit className="inline mr-1" />
        update password
      </Link> */}
          <Link
            href={`${process.env.NEXT_PUBLIC_LOCAL_API}/profile/oders`}
            className=" text-black hover:text-white hover:bg-black border rounded-xl shadow-md  p-3"
          >
            <FaBoxOpen className="inline mr-1" /> oders
          </Link>
          <Link
            href="/"
            className=" text-black hover:text-white hover:bg-black border rounded-xl shadow-md p-3"
          >
            <FaSignOutAlt className="inline mr-1" />
            logout
          </Link>
        </div>
        <div className=" flex  justify-center items-center flex-row gap-66 h-96 w-1/2 ">
          <div className=" w-fit h-1/2 flex flex-col items-start justify-around p-2 gap-2 rounded-xl shadow-md">
            <div className=" p-2 text-xl">
              <label htmlFor="">Upload cover image</label>
            </div>
            <div className="border rounded-xl  p-2">
              <input type="file" onChange={onchangeHandler} />
            </div>
            <div className=" flex justify-center text-xl w-full ">
              <div className=" p-2  bg-black text-white rounded-xl hover:bg-gray-500">
                <button>upload</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default UploadImage;
