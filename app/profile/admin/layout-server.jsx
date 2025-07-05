export const metadata = {
  title: "Admin Dashboard",
  description:
    "Admin dashboard for managing products, orders, and users on Dino platform.",
  keywords: "admin, dashboard, management, products, orders, users, Dino",
  openGraph: {
    title: "Admin Dashboard",
    description: "Admin dashboard for managing Dino platform.",
    type: "website",
    locale: "en_US",
  },
};

export default function AdminServerLayout({ children }) {
  return children;
}
