export const metadata = {
  title: "Profile",
  description:
    "Manage your Dino account, view orders, update profile information, and access account settings.",
  keywords: "profile, account, orders, settings, Dino",
  openGraph: {
    title: "Profile",
    description: "Manage your Dino account and view your orders.",
    type: "website",
    locale: "en_US",
  },
};

export default function ProfileServerLayout({ children }) {
  return children;
}
