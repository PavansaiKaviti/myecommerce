"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Rating from "@/components/rating/Rating";
import { additems } from "@/app/globalstore/reduxslices/cartslice/Cart";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useToast } from "@/components/toast/Toast";
import {
  FaStar,
  FaRegStar,
  FaShoppingCart,
  FaHeart,
} from "@/components/icons/Icons";

const Singleproduct = () => {
  const { data: session } = useSession();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [formdata, setformData] = useState({
    message: "",
    rating: 1,
  });
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [qty, setQty] = useState(1);
  const { productid } = useParams();
  const dispatch = useDispatch();
  const { success, error } = useToast();

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
          error("One of the requests failed");
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
        setLoading(false);
        setRefresh(false);
      }
    };
    fetchallproducts();
  }, [productid, refresh]);

  const onChangeHandler = (e) => {
    setQty(e.target.value);
  };

  const addToCart = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_API}/products/${productid}`,
        { cache: "no-store" }
      );
      const productData = await res.json();

      if (!productData) {
        error("One of the requests failed");
        return;
      }

      dispatch(additems({ ...productData, qty }));
      success("item added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const onSubmitHandler = (e) => {
    try {
      e.preventDefault();
      const newproduct = { ...product, qty };
      dispatch(additems(newproduct));
      success("item added to cart");
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

  const onsubmitHandler = async (e) => {
    e.preventDefault();

    // Check if productid and formdata are defined
    if (!productid || !formdata) {
      error("Product ID and form data are required.");
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
        error(`Error: ${errorData.message || "Something went wrong"}`);
        return;
      }

      const data = await res.json();
      success(data.message);
      setformData({
        message: "",
        rating: 1,
      });
      setRefresh(true);
    } catch (error) {
      error("An unexpected error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  const deleteReview = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_API}/reviews/${id}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      success(data.message);
      setRefresh(true);
    } catch (error) {
      error(error.data || error.message);
    }
  };

  // Product Detail Skeleton
  const ProductDetailSkeleton = () => (
    <div className="animate-pulse">
      {/* Product Image and Description Skeleton */}
      <div className="flex lg:flex-row m-10 gap-6 flex-col">
        {/* Image Skeleton */}
        <div className="relative basis-1/2 rounded-2xl shadow-md">
          <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          {/* Rating Skeleton */}
          <div className="absolute top-1 right-1">
            <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="basis-1/2 p-10">
          <div>
            {/* Product Name and Brand */}
            <div className="flex gap-4 justify-between mb-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 mb-5"></div>

            {/* Description */}
            <div className="mb-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 mb-5"></div>

            {/* Stock and Quantity */}
            <div className="flex flex-row justify-between mb-4">
              <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              <div className="flex items-center gap-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 mb-5"></div>

            {/* Price and Button */}
            <div className="flex flex-row justify-between">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section Skeleton */}
      <div className="m-10">
        {/* Review Form Skeleton */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-48"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-16"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-16"></div>
        </div>

        {/* Reviews Title */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-4"></div>

        {/* Reviews Grid Skeleton */}
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 m-3">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-700 p-4 rounded-3xl"
            >
              <div className="flex flex-row gap-3 mb-3">
                <div className="w-14 h-14 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Show loading while session is loading to prevent hydration mismatch
  if (loading || session === null) {
    return <ProductDetailSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
            <div className="flex gap-4 justify-between text-gray-700 dark:text-gray-300 mb-4">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                <span className="text-gray-600 dark:text-gray-400">
                  Brand:{" "}
                </span>
                {product.brand}
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 mb-5"></div>
            <div className="flex flex-cols gap-4 text-gray-700 dark:text-gray-300 mb-4">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                <span className="text-gray-600 dark:text-gray-400">
                  Description:
                </span>{" "}
                {product.description}
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 mb-5"></div>
            <div className="flex flex-row justify-between mb-4 ">
              <div className="flex text-gray-500  border rounded-2xl p-3 w-fit  bg-gray-900 dark:bg-gray-800">
                <p className="text-md font-bold text-white">
                  {product.countInStock > 0 ? "in Stock" : "out of Stock"}
                </p>
              </div>
              <div id="quantity">
                <span className="text-md font-bold text-gray-900 dark:text-white">
                  qty:{" "}
                </span>
                <input
                  type="number"
                  className="w-20 p-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="qty"
                  value={qty}
                  onChange={onChangeHandler}
                />
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 mb-5"></div>
            <div className="flex flex-row justify-between">
              <div className="p-4">
                <p className="text-gray-900 dark:text-white text-3xl font-bold">
                  ${product.price}
                </p>
              </div>
              <div id="button">
                {product.countInStock > 0 ? (
                  <button
                    className="w-auto bg-gray-900 dark:bg-gray-800 hover:bg-blue-600 dark:hover:bg-blue-500 rounded-2xl p-3 text-white text-md font-bold transition-colors"
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
        {session === null ? (
          <div>
            <div className="p-2 mt-2 rounded-lg flex justify-center text-lg text-gray-900 dark:text-white">
              <span>
                Please{" "}
                <Link
                  href={`${process.env.NEXT_PUBLIC_DOMAIN_API}/auth/signin`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  login
                </Link>{" "}
                to review
              </span>
            </div>
          </div>
        ) : session === null ? (
          <div>
            <form
              className="flex justify-center gap-4"
              onSubmit={onsubmitHandler}
            >
              <div className="text-lg mt-2 text-gray-900 dark:text-white">
                write a review
              </div>
              <input
                type="text"
                className="h-10 px-3 bg-white dark:bg-gray-700 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                placeholder="write"
                name="message"
                value={formdata.message}
                onChange={onchangeformHandler}
                required
              />
              <select
                name="rating"
                className="h-10 px-3 w-20 bg-white dark:bg-gray-700 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
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
                className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-xl border-2 w-20 border-gray-300 dark:border-gray-600 p-2 text-white transition-colors"
                type="submit"
              >
                post
              </button>
            </form>
          </div>
        ) : null}

        <div className="text-xl font-medium mt-3 text-gray-900 dark:text-white">
          REVIEWS
        </div>
        {reviews.length === 0 ? (
          <div className="p-2 mt-2 rounded-lg flex justify-center text-lg text-gray-900 dark:text-white">
            <span>No reviews</span>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 m-3">
            {reviews.map((message, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-4 rounded-3xl flex flex-col gap-2 border border-gray-200 dark:border-gray-700"
              >
                <div className="p-2 flex flex-row gap-3 w-fit">
                  <div>
                    <Image
                      src={message.user.image}
                      width={80}
                      height={10}
                      alt="sai"
                      className="rounded-full w-14 h-14"
                    />
                  </div>
                  <div className="mt-2">
                    <strong className="text-gray-900 dark:text-white">
                      {message.user.username}
                    </strong>
                    <span className="flex flex-row mt-1">
                      <Rating rating={message.rating} />
                    </span>
                  </div>
                </div>
                <div className="p-2 w-fit">
                  <p className="text-wrap text-gray-700 dark:text-gray-300">
                    {message.message}
                  </p>
                </div>
                {session === null ? null : session.user.id ===
                  message?.user?._id ? (
                  <div className=" flex flex-row gap-5 justify-center">
                    <div className=" w-3/4 flex justify-around">
                      {/* <button className=" rounded-lg bg-blue-500  hover:text-black w-32 px-3 h-8 text-white">
                        edit
                      </button> */}
                      <button
                        className="rounded-lg bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 w-32 px-3 h-8 text-white transition-colors"
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
