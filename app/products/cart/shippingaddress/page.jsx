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
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      <div className="w-full flex justify-center mt-4 mb-6">
        <Odersteps step1={true} step2={false} step3={false} />
      </div>
      {/* Centered container for image and form */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center px-2 p-4">
        <Image
          src={Shipping}
          width={400}
          height={200}
          alt="shipping address"
          className="w-full h-40 object-cover mb-6"
          priority={true}
        />
        <form
          className="flex flex-col justify-center w-full gap-4"
          onSubmit={onsubmitHandler}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">
            Shipping Address
          </h2>
          <p className="text-gray-500 text-sm mb-2 text-center">
            Enter your shipping details to proceed to payment.
          </p>
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
      </div>
    </div>
  );
};

export default Shippingpage;
