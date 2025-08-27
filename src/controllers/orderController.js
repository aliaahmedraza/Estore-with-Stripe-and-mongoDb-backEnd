import Stripe from "stripe";
import orderModel from "../models/order/order.js";

const stripe = new Stripe(process.env.SECRET_KEY);

const orderController = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET.trim()
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("✅ Checkout completed:", session.id);

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      await orderModel.create({
        userId: session.metadata.userId,
        stripeSessionId: session.id,
        paymentIntentId: session.payment_intent,
        items: lineItems.data.map((item) => ({
          title: item.description,
          price: item.price.unit_amount / 100,
          quantity: item.quantity,
        })),
        totalAmount: session.amount_total / 100,
        paymentStatus: session.payment_status,
      });
        console.log("Order hit the controller");

      console.log("💾 Order saved to DB for user:", session.metadata.userId);
    } catch (err) {
      console.error("❌ Error saving order:", err.message);
    }
  }

  res.json({ received: true });
};
  
export default orderController;
