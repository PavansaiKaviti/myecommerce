import React from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Rating = ({ rating }) => {
  return (
    <div>
      {rating >= 1 ? (
        <FaStar className="text-black inline" />
      ) : rating >= 0.5 ? (
        <FaStarHalfAlt className="text-black inline" />
      ) : (
        <FaRegStar className=" inline" />
      )}
      {rating >= 2 ? (
        <FaStar className="text-black inline" />
      ) : rating >= 1.5 ? (
        <FaStarHalfAlt className="text-black inline" />
      ) : (
        <FaRegStar className="inline" />
      )}
      {rating >= 3 ? (
        <FaStar className="text-black inline" />
      ) : rating >= 2.5 ? (
        <FaStarHalfAlt className="text-black inline" />
      ) : (
        <FaRegStar className=" inline" />
      )}
      {rating >= 4 ? (
        <FaStar className="text-black inline" />
      ) : rating >= 3.5 ? (
        <FaStarHalfAlt className="text-black inline" />
      ) : (
        <FaRegStar className=" inline" />
      )}
      {rating >= 5 ? (
        <FaStar className="text-black inline" />
      ) : rating >= 4.5 ? (
        <FaStarHalfAlt className="text-black inline" />
      ) : (
        <FaRegStar className=" inline" />
      )}
    </div>
  );
};

export default Rating;
