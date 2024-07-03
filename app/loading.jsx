"use client";

import ClipLoader from "react-spinners/ClipLoader";
const override = {
  display: "block",
  margin: "100px auto",
};

const Loadingpage = ({ loading }) => {
  return (
    <ClipLoader
      color="black"
      loading={loading}
      cssOverride={override}
      size={150}
      aria-label="Loading Spinner"
    />
  );
};

export default Loadingpage;
