import "@/assets/styles/global.css";
import "@/assets/styles/optimization.css";
import Googleprovider from "@/components/googleprovider/Googleprovider";
import Reduxprovider from "./globalstore/Provider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <ThemeProvider>
          <Googleprovider>
            <Reduxprovider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "var(--toast-bg, #363636)",
                    color: "var(--toast-color, #fff)",
                  },
                }}
              />
            </Reduxprovider>
          </Googleprovider>
        </ThemeProvider>
      </body>
    </html>
  );
}
