"use client";

import ClipLoader from "react-spinners/ClipLoader";
const override = {
  display: "block",
  margin: "100px auto",
};

const Loadingpage = ({ loading = true, size = 150, color = "black" }) => {
  return (
    <div
      className="flex items-center justify-center min-h-[200px]"
      role="status"
      aria-label="Loading content"
    >
      <ClipLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={size}
        aria-label="Loading Spinner"
      />
    </div>
  );
};

export default Loadingpage;
