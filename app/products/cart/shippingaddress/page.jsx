"use client";
import Image from "next/image";
import Shipping from "@/public/images/shippingaddress.jpg";
import Odersteps from "@/components/odersteps/Odersteps";
import { useEffect, useState } from "react";
import { addshippingaddress } from "@/app/globalstore/reduxslices/cartslice/Cart";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const Shippingpage = () => {
  const [formdata, setformdata] = useState({
    address: "",
    phone: "",
    city: "",
    state: "",
    zipcode: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const { shippingAddress } = useSelector((state) => state.cart);

  useEffect(() => {
    if (shippingAddress) {
      setformdata({
        address: shippingAddress.address,
        phone: shippingAddress.phone,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipcode: shippingAddress.zipcode,
      });
    }
  }, []);

  const onchangeHandler = (e) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const onsubmitHandler = (e) => {
    try {
      e.preventDefault();
      dispatch(addshippingaddress(formdata));
      if (Object.keys(shippingAddress).length !== 0) {
        router.push("/products/cart/payoder");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Stepper */}
      <div className="pt-6">
        <Odersteps step1={true} step2={false} step3={false} variant="modern" />
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-8">
        <div className="w-full max-w-md px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Shipping Address
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Enter your delivery information
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onsubmitHandler} className="space-y-4">
            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                value={formdata.address}
                onChange={onchangeHandler}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Enter street address"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formdata.phone}
                onChange={onchangeHandler}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Enter phone number"
                required
              />
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formdata.city}
                  onChange={onchangeHandler}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formdata.state}
                  onChange={onchangeHandler}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="State"
                  required
                />
              </div>
            </div>

            {/* ZIP Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                name="zipcode"
                value={formdata.zipcode}
                onChange={onchangeHandler}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="ZIP code"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6"
            >
              Continue to Payment
            </button>
          </form>

          {/* Simple Info */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Free shipping on orders over $50
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shippingpage;
