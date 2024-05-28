"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Loadingpage from "@/app/loading";
import Rating from "@/components/rating/Rating";
import { FaSpinner } from "react-icons/fa";
import { additems } from "@/app/globalstore/reduxslices/cartslice/Cart";
import { useSelector, useDispatch } from "react-redux";

const Singleproduct = () => {
  const [product, setProduct] = useState([]);
  const [loading, setloading] = useState(true);
  const [qty, setQty] = useState(1);
  const { productid } = useParams();
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchallproducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/products/${productid}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setProduct(data);
        setloading(false);
      } catch (error) {
        console.log(error);
      }
    };
    if (product.length === 0) {
      fetchallproducts();
    }
  }, []);

  const onChangeHandler = (e) => {
    setQty(e.target.value);
  };

  const onSubmitHandler = (e) => {
    try {
      e.preventDefault();
      const newproduct = { ...product, qty };
      dispatch(additems(newproduct));
      if (!newproduct) {
        return;
      }
      router.push("/products/cart");
    } catch (error) {
      console.log(error);
    } finally {
      setQty(1);
    }
  };

  if (product.length === 0 && loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="inline mr-1" />
        <p className="text-lg font-bold">fetching products...</p>
      </div>
    );
  }

  return loading ? (
    <Loadingpage loading={loading} />
  ) : (
    <form onSubmit={onSubmitHandler}>
      <div className="flex lg:flex-row m-10 gap-6 flex-col">
        {/* image */}
        <div className="relative basis-1/2 border-2 border-gray rounded-2xl shadow-md">
          <Image
            src={product.image}
            alt="ipad"
            height={0}
            width={0}
            sizes="100"
            className="w-full"
            priority={true}
          />
          <div className="absolute top-1 right-1 ">
            <Rating rating={product.rating} />
          </div>
        </div>
        {/* description */}
        <div className="basis-1/2  p-10">
          <div id="description">
            <div className="flex gap-4 justify-between text-gray-500 mb-4">
              <p className="text-xl font-bold">{product.name}</p>
              <p className="text-xl font-bold">
                <span className=" text-black">Brand: </span>
                {product.brand}
              </p>
            </div>
            <div className="border border-gray-100 mb-5"></div>
            <div className="flex flex-cols gap-4 text-gray-500 mb-4">
              <p className="text-xl font-bold">
                <span className=" text-black">Description:</span>{" "}
                {product.description}
              </p>
            </div>
            <div className="border border-gray-100 mb-5"></div>
            <div className="flex flex-row justify-between mb-4 ">
              <div className="flex text-gray-500  border rounded-2xl p-3 w-fit  bg-black">
                <p className="text-md font-bold text-white">
                  {product.countInStock > 0 ? "in Stock" : "out of Stock"}
                </p>
              </div>
              <div id="quantity">
                <span className="text-md font-bold">qty: </span>
                <input
                  type="number"
                  className="w-20 p-3 rounded-2xl border"
                  placeholder="qty"
                  value={qty}
                  onChange={onChangeHandler}
                />
              </div>
            </div>
            <div className="border border-gray-100 mb-5"></div>
            <div className="flex flex-row justify-between">
              <div className="p-4">
                <p className=" text-gray-900 text-3xl font-bold">
                  ${product.price}
                </p>
              </div>
              <div id="button">
                {product.countInStock > 0 ? (
                  <button
                    className="w-auto bg-black  hover:bg-blue-600  rounded-2xl p-3 text-white text-md font-bold"
                    type="submit"
                  >
                    add to cart
                  </button>
                ) : (
                  " "
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Singleproduct;
