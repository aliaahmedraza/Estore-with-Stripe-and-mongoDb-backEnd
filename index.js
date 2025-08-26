import express from "express";
import dbConfig from "./src/db/config.js";
import cors from "cors";
import stripeRouter from "./src/routers/stripeRouter.js";
import orderRouter from "./src/routers/orderRouter.js";

const app = express();
app.use(express.static("public"));
const PORT = process.env.PORT || 5000;
dbConfig;
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/webhook", express.raw({ type: "application/json" }), orderRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(stripeRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
