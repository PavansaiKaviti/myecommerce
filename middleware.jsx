export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/profile",
    "/products/cart/shippingaddress",
    "/products/cart/payoder",
    "/products/cart/odered",
  ],
};
