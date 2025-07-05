import React from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "@/components/icons/Icons";

const Rating = ({ rating }) => {
  return (
    <div>
      {rating >= 1 ? (
        <FaStar className="text-yellow-500 inline" />
      ) : rating >= 0.5 ? (
        <FaStarHalfAlt className="text-yellow-500 inline" />
      ) : (
        <FaRegStar className="text-gray-300 dark:text-gray-600 inline" />
      )}
      {rating >= 2 ? (
        <FaStar className="text-yellow-500 inline" />
      ) : rating >= 1.5 ? (
        <FaStarHalfAlt className="text-yellow-500 inline" />
      ) : (
        <FaRegStar className="text-gray-300 dark:text-gray-600 inline" />
      )}
      {rating >= 3 ? (
        <FaStar className="text-yellow-500 inline" />
      ) : rating >= 2.5 ? (
        <FaStarHalfAlt className="text-yellow-500 inline" />
      ) : (
        <FaRegStar className="text-gray-300 dark:text-gray-600 inline" />
      )}
      {rating >= 4 ? (
        <FaStar className="text-yellow-500 inline" />
      ) : rating >= 3.5 ? (
        <FaStarHalfAlt className="text-yellow-500 inline" />
      ) : (
        <FaRegStar className="text-gray-300 dark:text-gray-600 inline" />
      )}
      {rating >= 5 ? (
        <FaStar className="text-yellow-500 inline" />
      ) : rating >= 4.5 ? (
        <FaStarHalfAlt className="text-yellow-500 inline" />
      ) : (
        <FaRegStar className="text-gray-300 dark:text-gray-600 inline" />
      )}
    </div>
  );
};

export default Rating;
