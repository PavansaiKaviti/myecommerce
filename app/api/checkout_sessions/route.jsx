import { getuser } from "@/utils/getuser/User";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const POST = async (request) => {
  try {
    const body = await request.text();
    const { items, shippingAddress } = JSON.parse(body);
    const { user } = await getuser();
    const productids = items.map((ele) => ele._id);

    const lineItems = items.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: product.price * 100, // Ensure amount is in cents
      },
      quantity: product.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      automatic_tax: {
        enabled: true,
      },
      mode: "payment",
      metadata: {
        product: JSON.stringify(productids),
        user: user.id,
        shippingAddress: JSON.stringify(shippingAddress),
      },
      success_url: `${process.env.NEXT_PUBLIC_LOCAL_API}/products/cart/odered`, // replace with your actual success URL
      cancel_url: "http://localhost:3000", // replace with your actual cancel URL
    });

    return new Response(JSON.stringify(session.url));
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
