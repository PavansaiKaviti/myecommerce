"use client";
import { SessionProvider } from "next-auth/react";

const Googleprovider = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default Googleprovider;
