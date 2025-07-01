"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Loadingpage from "@/app/loading";
import Rating from "@/components/rating/Rating";
import { additems } from "@/app/globalstore/reduxslices/cartslice/Cart";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Singleproduct = () => {
  const [product, setProduct] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [formdata, setformData] = useState({
    message: "",
    rating: 1,
  });
  const [loading, setloading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [qty, setQty] = useState(1);
  const { productid } = useParams();
  const dispatch = useDispatch();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchallproducts = async () => {
      try {
        const response1 = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/products/${productid}`,
          { cache: "force-cache" }
        );
        const response2 = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/reviews/${productid}`,
          { cache: "no-store" }
        );
        const [result1, result2] = await Promise.all([response1, response2]);
        if (!result1.ok) {
          toast.error("One of the requests failed");
          return;
        }
        if (!result2.ok) {
          setReviews([]);
        }
        const data1 = await result1.json();
        const data2 = await result2.json();
        setProduct(data1);
        setReviews(data2);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
        setRefresh(false);
      }
    };
    fetchallproducts();
  }, [productid, refresh]);

  const onChangeHandler = (e) => {
    setQty(e.target.value);
  };

  const onSubmitHandler = (e) => {
    try {
      e.preventDefault();
      const newproduct = { ...product, qty };
      dispatch(additems(newproduct));
      toast.success("item added to cart");
      if (!newproduct) {
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setQty(1);
      setRefresh(true);
    }
  };

  const onchangeformHandler = (e) => {
    setformData({ ...formdata, [e.target.name]: e.target.value });
  };

  const onSubmitformHandler = async (e) => {
    e.preventDefault();
    // Check if productid and formdata are defined
    if (!productid || !formdata) {
      toast.error("Product ID and form data are required.");
      return;
    }
    try {
      const newdata = { productid, ...formdata };
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_API}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newdata),
      });

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
    } finally {
      setRefresh((prev) => (prev = !prev));
    }
  };

  const deleteReview = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_API}/reviews/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.data || error.message);
    } finally {
      setRefresh((prev) => (prev = !prev));
    }
  };

  // Show loading while session is loading to prevent hydration mismatch
  if (loading || status === "loading") {
    return <Loadingpage loading={true} />;
  }

  return (
    <div>
      <form
        className="flex lg:flex-row m-10 gap-6 flex-col"
        onSubmit={onSubmitHandler}
      >
        {/* image */}
        <div className="relative basis-1/2  rounded-2xl shadow-md">
          <Image
            src={product.image}
            alt="ipad"
            height={0}
            width={0}
            sizes="100"
            className="w-full h-full object-cover rounded-2xl"
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
      </form>
      <div className="m-10">
        {status === "unauthenticated" ? (
          <div>
            <div className=" p-2 mt-2 rounded-lg flex justify-center text-lg">
              <span>
                Please{" "}
                <Link
                  href={`${process.env.NEXT_PUBLIC_DOMAIN_API}/auth/signin`}
                  className=" text-blue-500 hover:underline"
                >
                  login
                </Link>{" "}
                to review
              </span>
            </div>
          </div>
        ) : status === "authenticated" ? (
          <div>
            <form
              className="flex justify-center gap-4"
              onSubmit={onSubmitformHandler}
            >
              <div className=" text-lg mt-2">write a review</div>
              <input
                type="text"
                className=" h-10 px-3 bg-gray-200 rounded-xl border-2  border-black-200"
                placeholder="write"
                name="message"
                value={formdata.message}
                onChange={onchangeformHandler}
                required
              />
              <select
                name="rating"
                className=" h-10 px-3 w-20 bg-gray-200 rounded-xl border-2  border-black-200"
                onChange={onchangeformHandler}
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
        ) : null}

        <div className="text-xl font-medium mt-3">REVIEWS</div>
        {reviews.length === 0 ? (
          <div className=" p-2 mt-2 rounded-lg flex justify-center text-lg">
            <span>No reviews</span>
          </div>
        ) : (
          <div className=" grid lg:grid-cols-2 grid-cols-1 gap-4 m-3">
            {reviews.map((message, index) => (
              <div
                key={index}
                className=" bg-gray-200 p-2 rounded-3xl flex flex-col gap-2 "
              >
                <div className=" p-2 flex flex-row gap-3 w-fit">
                  <div>
                    <Image
                      src={message.user.image}
                      width={80}
                      height={10}
                      alt="sai"
                      className="rounded-full w-14 h-14  "
                    />
                  </div>
                  <div className="mt-2">
                    <strong>{message.user.username}</strong>
                    <span className="flex flex-row mt-1">
                      <Rating rating={message.rating} />
                    </span>
                  </div>
                </div>
                <div className=" p-2 w-fit">
                  <p className=" text-wrap">{message.message}</p>
                </div>
                {status === "authenticated" &&
                session?.user?.id === message?.user?._id ? (
                  <div className=" flex flex-row gap-5 justify-center">
                    <div className=" w-3/4 flex justify-around">
                      {/* <button className=" rounded-lg bg-blue-500  hover:text-black w-32 px-3 h-8 text-white">
                        edit
                      </button> */}
                      <button
                        className="rounded-lg bg-blue-500  hover:text-black w-32 px-3 h-8 text-white"
                        onClick={() => deleteReview(message._id)}
                      >
                        delete
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Singleproduct;
