import React from "react";
import Image from "next/image";
import Rating from "../rating/Rating";
import toast from "react-hot-toast";

const Reviews = ({ review, session }) => {
  const deleteReview = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_API}/reviews/${id}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.data || error.message);
    }
  };

  return (
    <div className=" bg-gray-200 p-2 rounded-3xl flex flex-col gap-2 ">
      <div className=" p-2 flex flex-row gap-3 w-fit">
        <div>
          <Image
            src={review.user.image}
            width={80}
            height={10}
            alt="sai"
            className="rounded-full w-14 h-14  "
          />
        </div>
        <div className="mt-2">
          <strong>{review.user.username}</strong>
          <span className="flex flex-row mt-1">
            <Rating rating={review.rating} />
          </span>
        </div>
      </div>
      <div className=" p-2 w-fit">
        <p className=" text-wrap">{review.message}</p>
      </div>
      {session?.user?.id === review?.user?._id ? (
        <div className=" flex flex-row gap-5 justify-center">
          <div className=" w-3/4 flex justify-around">
            {/* <button className=" rounded-lg bg-blue-500  hover:text-black w-32 px-3 h-8 text-white">
              edit
            </button> */}
            <button
              className="rounded-lg bg-blue-500  hover:text-black w-32 px-3 h-8 text-white"
              onClick={() => deleteReview(review._id)}
            >
              delete
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Reviews;
