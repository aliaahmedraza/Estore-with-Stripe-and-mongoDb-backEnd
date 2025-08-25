import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    stripeSessionId: String,
    paymentIntentId: String,
    items: [
      {
        title: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: Number,
    paymentStatus: String,
  },
  { timestamps: true }
);

const orderModel= mongoose.model("Order", OrderSchema);
export default orderModel;