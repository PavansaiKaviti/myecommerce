import "@/assets/styles/global.css";
import "@/assets/styles/optimization.css";
import Googleprovider from "@/components/googleprovider/Googleprovider";
import Reduxprovider from "./globalstore/Provider";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/components/footer/Footer";

export const metadata = {
  title: "DINO",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Googleprovider>
          <Reduxprovider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="top-right" />
          </Reduxprovider>
        </Googleprovider>
      </body>
    </html>
  );
}
