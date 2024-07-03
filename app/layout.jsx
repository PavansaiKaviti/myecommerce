import "@/assets/styles/global.css";
import Googleprovider from "@/components/googleprovider/Googleprovider";
import Navbar from "@/components/navbar/Navbar";
import Reduxprovider from "./globalstore/Provider";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/components/footer/Footer";
export const metadata = {
  title: "ecommerce",
};

const layout = ({ children }) => {
  return (
    <html lang="en">
      <Googleprovider>
        <Reduxprovider>
          <body className="flex flex-col min-h-screen">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </body>
        </Reduxprovider>
        <Toaster />
      </Googleprovider>
    </html>
  );
};

export default layout;
