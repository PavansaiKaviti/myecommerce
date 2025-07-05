"use client";
import { SessionProvider } from "next-auth/react";
import ToastProvider from "@/components/toast/Toast";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Googleprovider from "@/components/googleprovider/Googleprovider";
import Reduxprovider from "@/app/globalstore/Provider";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <Reduxprovider>
        <ToastProvider>
          <ThemeProvider>
            <Googleprovider>{children}</Googleprovider>
          </ThemeProvider>
        </ToastProvider>
      </Reduxprovider>
    </SessionProvider>
  );
}
