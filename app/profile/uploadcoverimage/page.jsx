"use client";
import React, { useState } from "react";
import { FaUpload, FaImage } from "@/components/icons/Icons";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const UploadImage = () => {
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const router = useRouter();

  const onchangeHandler = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const onsubmitHandler = async (e) => {
    try {
      e.preventDefault();
      if (!file) {
        toast.error("Please select a file");
        return;
      }
      const formdata = new FormData();
      formdata.append("image", file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_API}/profile/uploadimage`,
        { method: "POST", body: formdata }
      );
      const data = await res.json();
      if (res.status !== 200) {
        toast.error(data.message, {
          position: "top-center",
        });
      }
      toast.success(data.message, {
        position: "top-center",
      });
      router.push("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaImage className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upload Cover Image
          </h2>
          <p className="text-gray-600">Update your profile cover image</p>
        </div>

        <form onSubmit={onsubmitHandler} className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                onChange={onchangeHandler}
                accept="image/*"
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="space-y-4">
                  <FaUpload className="w-8 h-8 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600 hover:text-blue-500">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Preview */}
            {preview && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">Preview:</h3>
                <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <button
            type="submit"
            disabled={!file}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <FaUpload className="w-4 h-4" />
            <span>Upload Image</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadImage;
