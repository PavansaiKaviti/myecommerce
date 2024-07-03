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
    <div className="flex flex-col items-center  gap-20 mt-12  ">
      <Odersteps step1={true} step2={false} step3={false} />
      <div className="flex flex-col-reverse lg:flex-row  w-3/4 p-5  items-center">
        <form
          className="flex flex-col justify-center w-1/2 gap-2 "
          onSubmit={onsubmitHandler}
        >
          <div className=" gap-2 mb-2">
            <p className="text-3xl">Shipping Address: </p>
          </div>
          <div className=" gap-2">
            <input
              type="text"
              className="w-full h-12 rounded-xl p-2 border bg-gray-100"
              placeholder="Address"
              value={formdata.address}
              onChange={onchangeHandler}
              name="address"
              required
            />
          </div>
          <div className=" flex gap-2">
            <input
              type="text"
              className="w-1/2 h-12 rounded-xl p-2 border  bg-gray-100"
              placeholder="phone"
              value={formdata.phone}
              onChange={onchangeHandler}
              name="phone"
              required
            />
            <input
              type="text"
              className="w-1/2 h-12  rounded-xl p-2 border  bg-gray-100"
              placeholder="city"
              value={formdata.city}
              onChange={onchangeHandler}
              name="city"
              required
            />
          </div>
          <div className=" flex  gap-2">
            <input
              type="text"
              className="w-1/2 h-12  rounded-xl p-2 border  bg-gray-100"
              placeholder="state"
              value={formdata.state}
              onChange={onchangeHandler}
              name="state"
              required
            />
            <input
              type="text"
              className="w-1/2 h-12  rounded-xl p-2 border  bg-gray-100"
              placeholder="Zipcode"
              value={formdata.zipcode}
              onChange={onchangeHandler}
              name="zipcode"
              required
            />
          </div>
          <div className=" flex mt-2  gap-2 justify-center">
            <button className="border p-2 rounded-xl bg-black text-white">
              submit
            </button>
          </div>
        </form>
        <div className=" w-1/2">
          <Image
            src={Shipping}
            width={0}
            height={0}
            alt="shipping address"
            sizes="100 h-full w-full"
            priority={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Shippingpage;
