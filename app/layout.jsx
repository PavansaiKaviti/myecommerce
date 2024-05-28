import "@/assets/styles/global.css";
import Googleprovider from "@/components/googleprovider/Googleprovider";
import Navbar from "@/components/navbar/Navbar";
import Reduxprovider from "./globalstore/Provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const metadata = {
  title: "ecommerce",
};

const layout = ({ children }) => {
  return (
    <Googleprovider>
      <html lang="en">
        <Reduxprovider>
          <body>
            <Navbar />
            <main>{children}</main>
          </body>
        </Reduxprovider>
        <ToastContainer />
      </html>
    </Googleprovider>
  );
};

export default layout;
