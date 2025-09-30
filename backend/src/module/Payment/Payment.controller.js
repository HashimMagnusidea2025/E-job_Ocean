import PaymentModel from "./Payment.model.js";
// import Razorpay from "razorpay";
// import dotenv from "dotenv";
// import webinarRegistrationModel from "../webinarRegistration/webinarRegistration.model.js";



// dotenv.config();

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY,
//   key_secret: process.env.RAZORPAY_SECRET,
// });




// export const CreatePayment = async (req, res) => {

//     try {

//         const {
//             r_payment_id,
//             method,
//             currency,
//             gst,
//             total_amount,
//             json_response,
//             registration_id,
//         } = req.body;


//         const registration = await webinarRegistrationModel.findById(registration_id);

//         if (!registration) return res.status(404).json({ message: "Registration not found" });


//         const Payment = new PaymentModel({

//             r_payment_id,
//             method,
//             currency,
//             gst,
//             total_amount,
//             json_response,
//             registration_id,
//         });
//         await Payment.save();

//         res.status(201).json({ message: "Payment recorded successfully", Payment });

//     } catch (err) {
//         console.error("Payment creation error:", err);
//         res.status(500).json({ message: err.message });
//     };



// }


// export const getPayment = async (req, res) => {


//     try {

//         const payments = await PaymentModel.find().populate("registration_id", "firstName lastName email webinarId");
//         res.status(200).json(payments);

//     } catch (err) {
//         console.error("Error fetching payments:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// };


export const getPaymentByRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;

    const payment = await PaymentModel.findOne({ registration_id: registrationId })
      .populate("registration_id", "firstName lastName email webinarId");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (err) {
    console.error("Error fetching payment by registration:", err);
    res.status(500).json({ error: "Server error" });
  }
};




import Razorpay from "razorpay";


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency, registrationId } = req.body;

    // Shorten receipt to max 40 chars
    // const shortReceiptId = `rec_${registrationId.slice(-10)}_${Date.now().toString().slice(-6)}`;
    if (!registrationId) {
      return res.status(400).json({ error: "registrationId is required" });
    }

    const shortReceiptId = `rec_${registrationId.slice(-10)}_${Date.now().toString().slice(-6)}`;


    const options = {
      amount: Math.round(amount * 100), // in paise
      currency: currency || "INR",
      receipt: shortReceiptId,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
};


// Verify payment & save
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registrationId,
      courseId,
      amount,
      gst,
      user_email,
      type,
    } = req.body;
    //  Add guard here

   // ✅ FIX: Only require registrationId OR courseId based on type
    if (!registrationId && !courseId) {
      return res.status(400).json({ 
        error: "Either registrationId or courseId is required" 
      });
    }

    if (!user_email) {
      return res.status(400).json({ 
        error: "user_email is required" 
      });
    }

    // GST ko number me parse kar lo
    const gstValue = gst ? parseFloat(gst) : 0;
    // Total fees without GST
    const baseAmount = amount - gstValue;
    const payment = await PaymentModel.create({
      registration_id: registrationId,
      course_id: courseId,
      user_email,
      r_payment_id: razorpay_payment_id,
      method: "razorpay",
      total_Amount: baseAmount,
      gst: gstValue,
      currency: "INR",
      user_email: user_email,
      type,

      json_response: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
    });

    res.json({ success: true, payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

