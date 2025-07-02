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
    <div className="flex flex-col items-center gap-12 mt-12 min-h-screen bg-gray-50">
      <Odersteps step1={true} step2={false} step3={false} />
      <div className="flex flex-col-reverse lg:flex-row w-full max-w-4xl mx-auto items-center px-2 sm:px-6 lg:px-8">
        {/* Form Card */}
        <form
          className="flex flex-col justify-center w-full lg:w-1/2 bg-white rounded-2xl shadow-lg p-8 gap-4 border border-gray-100"
          onSubmit={onsubmitHandler}
        >
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              Shipping Address
            </h2>
            <p className="text-gray-500 text-sm">
              Enter your shipping details to proceed to payment.
            </p>
          </div>
          <input
            type="text"
            className="w-full h-12 rounded-lg p-3 border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Address"
            value={formdata.address}
            onChange={onchangeHandler}
            name="address"
            required
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              className="w-full h-12 rounded-lg p-3 border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Phone"
              value={formdata.phone}
              onChange={onchangeHandler}
              name="phone"
              required
            />
            <input
              type="text"
              className="w-full h-12 rounded-lg p-3 border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="City"
              value={formdata.city}
              onChange={onchangeHandler}
              name="city"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              className="w-full h-12 rounded-lg p-3 border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="State"
              value={formdata.state}
              onChange={onchangeHandler}
              name="state"
              required
            />
            <input
              type="text"
              className="w-full h-12 rounded-lg p-3 border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Zipcode"
              value={formdata.zipcode}
              onChange={onchangeHandler}
              name="zipcode"
              required
            />
          </div>
          <button
            className="mt-4 w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow transition-transform active:scale-95"
            type="submit"
          >
            Continue to Payment
          </button>
        </form>
        {/* Image Side */}
        <div className="w-full lg:w-1/2 flex justify-center items-center mb-8 lg:mb-0">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs xl:max-w-sm">
            <Image
              src={Shipping}
              width={400}
              height={400}
              alt="shipping address"
              className="rounded-2xl object-cover w-full h-auto shadow-md"
              priority={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shippingpage;
