import express from "express";
import { createRazorpayOrder, verifyRazorpayPayment ,getPaymentByRegistration} from "./Payment.controller.js";

const PaymentRouter = express.Router();

// 1. Create an order
PaymentRouter.post("/create-order", createRazorpayOrder);

// 2. Verify payment after success
PaymentRouter.post("/verify-payment", verifyRazorpayPayment);
PaymentRouter.get("/registration/:registrationId", getPaymentByRegistration);

export default PaymentRouter;
