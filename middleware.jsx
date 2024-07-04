export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/profile",
    "/products/cart/shippingaddress",
    "/products/cart/payoder",
    "/products/cart/odered",
    "/profile/admin",
    "/profile/admin/users",
    "/profile/admin/oders",
    "/profile/admin/addproducts",
    "/profile/notifications",
    "/profile/oders",
    "/profile/uploadcoverimage",
  ],
};
