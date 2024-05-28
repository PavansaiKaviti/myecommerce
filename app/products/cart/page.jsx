"use client";
import noItem from "@/public/images/noitems.jpg";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  additems,
  removecartitems,
} from "@/app/globalstore/reduxslices/cartslice/Cart";
import { toast } from "react-toastify";
const cart = () => {
  const product = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addToCartHandler = async (product, qty) => {
    dispatch(additems({ ...product, qty }));
  };

  return product.items.length === 0 ? (
    <div className="flex flex-col gap-5 justify-center items-center">
      <div>
        <Image
          src={noItem}
          alt="no items"
          height={400}
          className=" my-12"
          priority={true}
        />
      </div>
      <div className="text-3xl">Cart is empty....</div>
      <div className="border rounded-xl bg-black hover:bg-blue-500 ">
        <Link href="/products" className="p-3 text-white">
          <FaArrowLeft className="inline m-1" />
          Go Back
        </Link>
      </div>
    </div>
  ) : (
    <>
      <div className="flex mx-10 my-14  md:flex-row gap-10 flex-col  justify-around">
        {/* product items  */}
        <div className=" basis-1/2 ">
          <div className="flex flex-col gap-6 xl:my-12">
            <div className="flex flex-row">
              <span className=" text-3xl">Items</span>
            </div>
            {/* product 1 */}
            {product.items.map((item, index) => (
              <div
                className=" flex flex-row border rounded-lg justify-between shadow-md "
                key={index}
              >
                <div id="image" className="felx-none">
                  <Image
                    src={item.image}
                    height={70}
                    width={70}
                    alt="image"
                    className="border rounded-lg m-2"
                  />
                </div>
                <div className="flex-none m-4">
                  <Link
                    href={`/products/${item._id}`}
                    className="underline text-blue-500"
                  >
                    {item.name}
                  </Link>
                </div>
                <div className="flex-none m-4">
                  <select
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-none m-4 ">${item.price}</div>
                <div className="flex-none m-4">
                  <button
                    onClick={() => {
                      dispatch(removecartitems(item));
                      toast.success("item removed from cart");
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* subtotal */}
        <div className=" basis-1/4 border rounded-2xl shadow-md">
          <div className="flex text-gray-500 m-4">
            <p className="text-xl text-black font-bold">Summary</p>
          </div>
          <div className="border border-gray-100 mb-5"></div>
          <div className="flex m-4 justify-between">
            <p className="text-xl text-gray-500 font-bold">items :</p>
            <span className=" text-md font-bold">${product.itemsPrice}</span>
          </div>
          <div className="border border-gray-100 mb-5"></div>
          <div className="flex m-4 justify-between">
            <p className="text-xl text-gray-500 font-bold">Taxes :</p>
            <span className="text-md font-bold">${product.taxPrice}</span>
          </div>
          <div className="border border-gray-100 mb-5"></div>
          <div className="flex  m-4 justify-between">
            <p className="text-xl text-gray-500 font-bold">Delivery Fee :</p>
            <span className=" text-md font-bold ">
              ${product.shippingPrice}
            </span>
          </div>
          <div className="border border-gray-100 mb-5"></div>
          <div className="flex m-4 justify-between">
            <p className="text-xl text-gray-500 font-bold">Total :</p>
            <span className=" text-md font-bold ">${product.totalPrice}</span>
          </div>
          <div className="border border-gray-100 mb-5"></div>
          <div className="flex m-4 justify-around">
            <button className="border p-2 rounded-lg bg-black text-white hover:bg-blue-500">
              place oder
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default cart;
