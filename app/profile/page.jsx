"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaBoxOpen } from "@/components/icons/Icons";
import { useSession } from "next-auth/react";
import Loadingpage from "../loading";

const Card = () => {
  const [users, setuser] = useState({});
  const [coverimg, setcoverImage] = useState("");
  const { data: profile, status } = useSession();

  useEffect(() => {
    const fetechimage = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_API}/profile/coverimage`
        );
        const data = await res.json();
        setcoverImage(data.image);
        if (profile?.user) {
          setuser(profile.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (profile?.user) {
      fetechimage();
    }
  }, [profile?.user]);

  // Show loading while session is loading
  if (status === "loading") {
    return <Loadingpage />;
  }

  return Object.keys(users).length === 0 ? (
    <Loadingpage />
  ) : (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
        {coverimg && (
          <Image
            src={coverimg}
            alt="cover"
            fill
            className="object-cover"
            priority={true}
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        {/* Profile Image */}
        <div className="absolute -bottom-16 left-8">
          <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
            <Image
              src={users.image}
              alt="profile"
              width={128}
              height={128}
              className="w-full h-full object-cover rounded-full"
              priority={true}
            />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 pb-8 px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h2>
          <p className="text-gray-600">
            Welcome back! Manage your account settings and preferences.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/profile/uploadcoverimage"
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FaEdit className="w-4 h-4" />
              <span>Update Profile Image</span>
            </Link>
            <Link
              href="/profile/oders"
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <FaBoxOpen className="w-4 h-4" />
              <span>View Orders</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
