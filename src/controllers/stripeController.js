import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.SECRET_KEY);

const stripeController = async (req, res) => {
  try {
    const { items, email, userId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.description || "",
          },
          unit_amount: Math.round(item.price * 100), // cents
        },
        quantity: item.quantity,
      })),
      success_url:
        "https://estore-with-stripe-and-mongo-db-fro.vercel.app/success",
      cancel_url:
        "https://estore-with-stripe-and-mongo-db-fro.vercel.app/cancel",
      metadata: { userId },
      payment_intent_data: {
        metadata: { userId },
      },
    });

    console.log("🎟️ Session created:", session.id);
    res.json({ id: session.id });
  } catch (err) {
    console.error("❌ Stripe checkout error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export default stripeController;
