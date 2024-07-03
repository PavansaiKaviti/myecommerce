"use client";
import Image from "next/image";
import React, { useState } from "react";
import apple from "@/public/images/apple.jpg";
import appliances from "@/public/images/appliances.jpg";
import tech from "@/public/images/tech.jpg";

const Carousel = () => {
  const [images, setImages] = useState([apple, appliances, tech]);
  const [data, setData] = useState(0);

  const changeImg = (id) => {
    setData(images[id]);
  };

  return (
    <div className=" mt-10 mx-12">
      <div className="relative border  md:h-1/4 lg:h-1/2 xl:h-3/4 h-48  shadow-lg rounded-lg">
        <Image
          src={data || images[0]}
          alt="apple"
          className="h-full w-full  object-center rounded-lg "
          priority={true}
        />
        <div className="absolute flex justify-center items-center gap-4 w-full bottom-2 left-0">
          {images.map((image, index) => (
            <button
              className="rounded-full bg-gray-400 h-4 w-4"
              key={index}
              onClick={() => changeImg(index)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
