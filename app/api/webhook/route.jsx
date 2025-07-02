import Oder from "@/models/odermodel/Odermodel";
import Timeconvertion from "@/utils/time/Timeconvertion";

import Stripe from "stripe";

//import
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
}); // configure

// endpoint
const endpointSecret = process.env.WEBHOOK_SECRET;

export const POST = async (request) => {
  const rawbody = await request.text();
  const sig = request.headers.get("Stripe-Signature");
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawbody, sig, endpointSecret);
    console.log("Stripe event type:", event.type);

    if (event.type === "checkout.session.completed") {
      const checkoutSessionCompleted = event.data.object;
      const createoder = await Oder.create({
        user: checkoutSessionCompleted.metadata.user,
        items: JSON.parse(checkoutSessionCompleted.metadata.product),
        shippindAddress: JSON.parse(
          checkoutSessionCompleted.metadata.shippingAddress
        ),
        paidAt: new Date(Timeconvertion(checkoutSessionCompleted.created)),
        paymentid: checkoutSessionCompleted.payment_intent,
        totalPrice: checkoutSessionCompleted.amount_total * 0.01,
      });
      return new Response(JSON.stringify(createoder), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (event.type === "checkout.session.expired") {
      return new Response(JSON.stringify(event.data.object), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // For all other events, acknowledge receipt
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.log("Stripe webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
};
