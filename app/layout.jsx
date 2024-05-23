import "@/assets/styles/global.css";
import Navbar from "@/components/navbar/Navbar";
const layout = ({ children }) => {
  return (
    <html>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
};

export default layout;
