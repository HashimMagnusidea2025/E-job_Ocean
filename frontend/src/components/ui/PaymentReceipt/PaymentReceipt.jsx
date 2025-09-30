// src/pages/PaymentReceipt.jsx
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../../../utils/axios.js";

import Swal from "sweetalert2";
export default function PaymentReceipt() {
  const { webinarId } = useParams(); // from /payment-receipt/:webinarId
  const location = useLocation();
  const navigate = useNavigate();
  const registrationId = new URLSearchParams(location.search).get("registrationId");
  const searchParams = new URLSearchParams(location.search);
  const userEmail = searchParams.get("email");  //  Got email from URL

  const [webinar, setWebinar] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // small helper to parse money-like values robustly
  const parseMoney = (val) => {
    if (val == null) return 0;
    if (typeof val === "number") return val;
    const cleaned = String(val).replace(/[^0-9.]/g, "");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use Promise.allSettled so one failing endpoint doesn't block others
        const promises = [
          webinarId ? axios.get(`/webinars/${webinarId}`) : Promise.resolve({ data: null }),
          // registrationId ? axios.get(`/registrations/${registrationId}`) : Promise.resolve({ data: null }),
          // registrationId ? axios.get(`/payments/registration/${registrationId}`) : Promise.resolve({ data: null }),
        ];

        const [webRes, regRes, payRes] = await Promise.allSettled(promises);

        // webinar
        if (webRes.status === "fulfilled") setWebinar(webRes.value.data || null);
        else setWebinar(null);

        // registration
        // if (regRes.status === "fulfilled") setRegistration(regRes.value.data || null);
        // else setRegistration(null);

        // payment (may 404)
        // if (payRes.status === "fulfilled") setPayment(payRes.value.data || null);
        // else setPayment(null);

      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch details. Check server or network.");
      } finally {
        setLoading(false);
      }
    };

    if (registrationId || webinarId) fetchDetails();
    else {
      setLoading(false);
      setError("Missing webinarId or registrationId in URL.");
    }
  }, [registrationId, webinarId]);

  // Choose the effective registration fee
  const webinarFee = parseMoney(webinar?.registrationFees);
  // sometimes registration object might have fee/amount fields: try common names
  const regFee =
    parseMoney(registration?.fee) ||
    parseMoney(registration?.registrationFee) ||
    parseMoney(registration?.amount) ||
    0;
  const paymentFee = parseMoney(payment?.total_amount);

  const registrationFee = paymentFee || regFee || webinarFee || 0;

  // GST - prefer payment.gst if present, otherwise compute (example 18% on fee for paid webinars)
  const paymentGst = parseMoney(payment?.gst);
  const isPaidWebinar = (webinar?.WebinarType || "").toLowerCase() === "paid";
  const computedGst = !payment && isPaidWebinar ? +(registrationFee * 0.18).toFixed(2) : 0;
  const gstAmount = paymentGst || computedGst || 0;

  const totalAmount = +(registrationFee + gstAmount).toFixed(2);

  // const handlePaymentSuccess = async () => {
  //   try {
  //     // IMPORTANT: create-google-event expects registrationId in params (per your backend)
  //     if (!registrationId) {
  //       alert("registrationId missing.");
  //       return;
  //     }

  //     // Simulate payment success (in real flow you'd integrate payment gateway)
  //     // After successful payment, record payment in backend (if required) and add attendee to google calendar:
  //     await axios.post(`/registrations/${registrationId}/create-google-event`); // use registrationId
  //     alert("Payment successful & attendee added to Google Calendar.");
  //     // optionally re-fetch payment/registration to show updated status
  //     const pay = await axios.get(`/payments/registration/${registrationId}`).catch(() => null);
  //     if (pay) setPayment(pay.data);
  //     // navigate to any success page
  //     // navigate(`/thank-you?registrationId=${registrationId}`);
  //   } catch (err) {
  //     console.error("Error on payment success:", err);
  //     alert("Payment completed but failed to add Google Calendar event.");
  //   }
  // };


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);



  const handlePaymentSuccess = async () => {
    if (!registrationId) {
      alert("registrationId missing.");
      return;
    }

    // Step 1: Create order on backend
    const orderRes = await axios.post("/payment/create-order", {
      amount: registrationFee + gstAmount,
      registrationId,
      userEmail: userEmail
    });
    const order = orderRes.data;

    const RAZORPAY_KEY = "rzp_test_xAK5yuk7ejZvD3";

    const options = {
      key: RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: webinar?.WebinarTitle || "Webinar",
      description: "Webinar Registration Fee",
      order_id: order.id,
      handler: async function (response) {
        try {
          // ✅ Use the `response` here inside handler
          await axios.post("/payment/verify-payment", {
            registrationId,
            user_email: userEmail,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: registrationFee + gstAmount,
            gst: gstAmount,
            type: "webinar",
          });

          // Add attendee to Google Calendar
          await axios.post(`/registrations/${registrationId}/create-google-event`);

          // SweetAlert success
          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: "You are registered and added to the webinar Google Calendar event.",
            confirmButtonColor: "#2563eb",
          }).then(() => {
            // ✅ Redirect after user clicks OK
            navigate("/webinars");
          });

          // Refresh payment info
          const pay = await axios.get(`/payment/registration/${registrationId}`).catch(() => null);

          if (pay) setPayment(pay.data);

        } catch (err) {
          console.error("Payment success handling error:", err);
          Swal.fire({
            icon: "success",
            title: "Payment Completed",

          });
        }
      },
      prefill: {
        name: registration?.firstName + " " + registration?.lastName || "",
        // email: registration?.email || "",
        email: userEmail || "", // Use the email from URL
      },
      theme: { color: "#3399cc" },
    };

    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh the page.");
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  };




  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  if (!registration && !webinar) return <div className="p-6 text-center">No data found.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 mb-10 p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Session Info */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <p className="font-bold">Session Title</p>
              <p className="text-gray-700">
                {registration?.webinarId?.WebinarTitle ||
                  webinar?.WebinarTitle ||
                  "Session title not available"}
              </p>
            </div>
            <div>
              <p className="font-bold">Session Type</p>
              <p className="text-gray-700">
                {registration?.webinarId?.WebinarType ||
                  webinar?.WebinarType ||
                  "—"}
              </p>
            </div>
          </div>
        </div>
        <hr />

        {/* Fees Table */}
        <div className="p-6">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Registration Fees</th>
                  <th className="p-2 text-center">Rs. {registrationFee.toFixed(2)}</th>
                </tr>
              </thead>
              <tbody className="bg-gray-100">
                <tr>
                  <td className="p-2">CGST (9% of GST)</td>
                  <td className="p-2 text-center">Rs. {(gstAmount / 2).toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="p-2">SGST (9% of GST)</td>
                  <td className="p-2 text-center">Rs. {(gstAmount / 2).toFixed(2)}</td>
                </tr>
                <tr>

                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <hr />

        {/* Total & Pay Button */}
        <div className="p-6 flex flex-col items-end gap-4">
          <div className="text-lg font-bold">Total</div>
          <div className="text-xl font-semibold">Rs. {totalAmount.toFixed(2)}</div>
          {!payment && (
            <button
              onClick={handlePaymentSuccess}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Pay Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
