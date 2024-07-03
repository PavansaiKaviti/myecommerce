import Oder from "@/models/odermodel/Odermodel";
import Timeconvertion from "@/utils/time/Timeconvertion";

import Stripe from "stripe";

//import
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
}); // configure

// endpoint
const endpointSecret =
  "whsec_79922f25a130b76177d97ea6a2ae8b6a719481bcc1f9bad0ecddce9091ebb244";

export const POST = async (request) => {
  const rawbody = await request.text();
  const res = await JSON.parse(rawbody);

  const sig = request.headers.get("Stripe-Signature");
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawbody, sig, endpointSecret);

    if (event.type === "checkout.session.completed") {
      var checkoutSessionCompleted = event.data.object;
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
      var checkoutSessionCompleted = event.data.object;
      return new Response(JSON.stringify(checkoutSessionCompleted), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      console.log("error");
      return new Response(JSON.stringify("error"), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ... handle other event types

    // Return a response with the event data
  } catch (error) {
    console.log(error);
    return new Response({ error }, { status: 400 });
  }
  // Handle the event
};
