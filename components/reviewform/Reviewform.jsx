"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Reviewform = ({ productid }) => {
  const [formdata, setformData] = useState({
    message: "",
    rating: 1,
  });

  const onchangeHandler = (e) => {
    setformData({ ...formdata, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Check if productid and formdata are defined
    if (!productid || !formdata) {
      toast.error("Product ID and form data are required.");
      return;
    }

    try {
      const newdata = { productid, ...formdata };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newdata),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.message || "Something went wrong"}`);
        return;
      }

      const data = await res.json();
      toast.success(data.message);
      setformData({
        message: "",
        rating: 1,
      });
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <form className="flex justify-center gap-4" onSubmit={onSubmitHandler}>
        <div className=" text-lg mt-2">write a review</div>
        <input
          type="text"
          className=" h-10 px-3 bg-gray-200 rounded-xl border-2  border-black-200"
          placeholder="write"
          name="message"
          value={formdata.message}
          onChange={onchangeHandler}
          required
        />
        <select
          name="rating"
          className=" h-10 px-3 w-20 bg-gray-200 rounded-xl border-2  border-black-200"
          onChange={onchangeHandler}
          value={formdata.rating}
          required
        >
          <option value="1">1</option>
          <option value="1.5">1.5</option>
          <option value="2">2</option>
          <option value="2.5">2.5</option>
          <option value="3">3</option>
          <option value="3.5">3.5</option>
          <option value="4">4</option>
          <option value="4.5">4.5</option>
          <option value="5">5</option>
        </select>
        <button
          className=" bg-blue-500 rounded-xl border-2 w-20  border-black-200 p-2 text-white"
          type="submit"
        >
          post
        </button>
      </form>
    </div>
  );
};

export default Reviewform;
