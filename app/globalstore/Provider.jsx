"use client";
import { Provider } from "react-redux";
import Reduxstore from "./Store";

const Reduxprovider = ({ children }) => {
  return <Provider store={Reduxstore}>{children}</Provider>;
};

export default Reduxprovider;
