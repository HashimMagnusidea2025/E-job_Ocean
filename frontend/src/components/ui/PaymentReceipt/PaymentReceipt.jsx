// src/pages/PaymentReceipt.jsx
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../../../utils/axios.js";
import Swal from "sweetalert2";

export default function PaymentReceipt() {
  const [isPaying, setIsPaying] = useState(false);

  const { webinarId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const registrationId = new URLSearchParams(location.search).get("registrationId");
  const userEmail = new URLSearchParams(location.search).get("email");

  const [webinar, setWebinar] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parse money values
  const parseMoney = (val) => {
    if (val == null) return 0;
    if (typeof val === "number") return val;
    const cleaned = String(val).replace(/[^0-9.]/g, "");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  // Fixed GST Calculation
  const calculateGST = (amount, state) => {
    const baseAmount = amount;

    // Check if state is Maharashtra
    const isMaharashtra = state === '4008' ||
      (typeof state === 'string' && state.toUpperCase() === 'MAHARASHTRA');

    console.log("🔍 GST CALCULATION DEBUG:");
    console.log("State received:", state);
    console.log("Is Maharashtra:", isMaharashtra);
    console.log("Base amount:", baseAmount);

    if (isMaharashtra) {
      // CGST + SGST (9% each) = Total 18%
      const totalGST = baseAmount * 0.18;
      console.log("✅ Applying CGST+SGST:", totalGST);
      return {
        type: 'CGST+SGST',
        cgst: parseMoney(totalGST / 2),
        sgst: parseMoney(totalGST / 2),
        igst: 0,
        totalGST: parseMoney(totalGST)
      };
    } else {
      // IGST (18%)
      const totalGST = baseAmount * 0.18;
      console.log("ℹ️ Applying IGST:", totalGST);
      return {
        type: 'IGST',
        cgst: 0,
        sgst: 0,
        igst: parseMoney(totalGST),
        totalGST: parseMoney(totalGST)
      };
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("🔄 Fetching details for registrationId:", registrationId);

        const promises = [
          webinarId ? axios.get(`/webinars/${webinarId}`) : Promise.resolve({ data: null }),
          registrationId ? axios.get(`/registrations/${registrationId}`) : Promise.resolve({ data: null }),
          registrationId ? axios.get(`/payments/registration/${registrationId}`) : Promise.resolve({ data: null }),
        ];

        const [webRes, regRes, payRes] = await Promise.allSettled(promises);

        // Webinar data
        if (webRes.status === "fulfilled") {
          setWebinar(webRes.value.data || null);
          console.log("✅ Webinar data:", webRes.value.data);
        } else {
          setWebinar(null);
          console.log("❌ Webinar data not found");
        }

        // ✅ FIX: Registration data fetch UNCOMMENTED
        if (regRes.status === "fulfilled") {
          const registrationData = regRes.value.data || null;
          setRegistration(registrationData);
          console.log("✅ Registration data:", registrationData);
          console.log("📍 Registration state:", registrationData?.state);
          console.log("📍 Registration full object:", registrationData);
        } else {
          setRegistration(null);
          console.log("❌ Registration data not found");
        }

        // // Payment data
        // if (payRes.status === "fulfilled") {
        //   setPayment(payRes.value.data || null);
        //   console.log("✅ Payment data:", payRes.value.data);
        // } else {
        //   setPayment(null);
        //   console.log("❌ Payment data not found");
        // }

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

  // Calculate fees and GST
  const webinarFee = parseMoney(webinar?.registrationFees);
  const regFee = parseMoney(registration?.fee) ||
    parseMoney(registration?.registrationFee) ||
    parseMoney(registration?.amount) || 0;
  const paymentFee = parseMoney(payment?.total_amount);

  const registrationFee = paymentFee || regFee || webinarFee || 0;

  // Get state from registration for GST calculation
  const registrationState = registration?.state || '';

  console.log("📍 CURRENT STATE ANALYSIS:");
  console.log("Registration state:", registrationState);
  console.log("Registration fee:", registrationFee);
  console.log("Webinar fee:", webinarFee);
  console.log("Registration object:", registration);

  // Calculate GST
  const gstDetails = calculateGST(registrationFee, registrationState);

  const totalAmount = registrationFee + gstDetails.totalGST;

  console.log("🧾 FINAL GST DETAILS:", gstDetails);
  console.log("💰 TOTAL AMOUNT:", totalAmount);

  // Razorpay payment handler
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

    // DEBUG: Check values before sending to Razorpay
    console.log("🔍 PAYMENT DEBUG VALUES:");
    console.log("Registration Fee:", registrationFee);
    console.log("GST Total:", gstDetails.totalGST);
    console.log("Total Amount (₹):", totalAmount);
    console.log("Registration State:", registrationState);
    console.log("GST Type:", gstDetails.type);


    setIsPaying(true); // 🔹 start loader

    const razorpayAmount = Math.round(totalAmount * 100);
    console.log("Total Amount (paise):", razorpayAmount);
    console.log("Razorpay will show: ₹", razorpayAmount / 100);

    // Validate amount
    if (razorpayAmount < 100) {
      Swal.fire({
        icon: "error",
        title: "Invalid Amount",
        text: "Payment amount is too low.",
      });
      return;
    }

    try {
      // Create order
      const orderRes = await axios.post("/payment/create-order", {
        amount: razorpayAmount,
        registrationId,
        userEmail: userEmail
      });
      const order = orderRes.data;

      const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: webinar?.WebinarTitle || "Webinar Registration",
        description: `Webinar: ${webinar?.WebinarTitle || "Registration"}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            await axios.post("/payment/verify-payment", {
              registrationId,
              user_email: userEmail,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: totalAmount,
              gst: gstDetails.totalGST,
              gst_type: gstDetails.type,
              cgst: gstDetails.cgst,
              sgst: gstDetails.sgst,
              igst: gstDetails.igst,
              type: "webinar",
            });

            // Add to Google Calendar
            await axios.post(`/registrations/${registrationId}/create-google-event`);
            setPayment(true);
            Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              text: "You are registered and added to the webinar Google Calendar event.",
              confirmButtonColor: "#2563eb",
            }).then(() => {
              navigate("/webinars");
            });

            // Refresh payment info
            const pay = await axios.get(`/payments/registration/${registrationId}`).catch(() => null);
            if (pay) setPayment(pay.data);

          } catch (err) {
            console.error("Payment success handling error:", err);
            Swal.fire({
              icon: "warning",
              title: "Payment Completed",
              text: "Payment was successful but there was an issue with confirmation.",
            });
          }
          finally {
            setIsPaying(false); // 🔹 stop loader
          }
        },
        prefill: {
          name: `${registration?.firstName || ''} ${registration?.lastName || ''}`.trim(),
          email: userEmail || "",
          contact: registration?.mobile || "",
        },
        theme: {
          color: "#3399cc"
        },
        notes: {
          registrationId: registrationId,
          webinar: webinar?.WebinarTitle || "Webinar"
        }
      };

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Please refresh the page.");
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', function () {
        setIsPaying(false); // 🔹 stop loader if failed
      });

    } catch (error) {
      console.error("Error creating order:", error);
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: "Failed to initialize payment. Please try again.",
      });
      setIsPaying(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading receipt details...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  if (!registration && !webinar) return <div className="p-6 text-center">No data found.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 mb-10 p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold text-center">Payment Receipt</h1>
        </div>

        {/* Session Info */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-gray-600">Session Title</p>
              <p className="text-gray-800 text-lg">
                {webinar?.WebinarTitle || "Session title not available"}
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-600">Session Type</p>
              <p className="text-gray-800">
                {webinar?.WebinarType || "—"}
              </p>
            </div>
            {/* ✅ Debug Info - Show Registration State */}
            {/* <div className="col-span-2 mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-bold text-gray-600">Registration Information</p>
              <p className="text-gray-800">
                <strong>State:</strong> {registration?.state ? `📍 ${registration.state}` : "State not available"}
              </p>
              <p className="text-gray-800">
                <strong>GST Type:</strong> {gstDetails.type}
              </p>
              <p className="text-gray-800">
                <strong>Registration ID:</strong> {registrationId}
              </p>
            </div> */}
          </div>
        </div>

        {/* Fees Table with GST */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Payment Breakdown</h2>
          <div className="bg-gray-50 rounded-lg overflow-hidden border">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">Registration Fees</td>
                  <td className="p-3 text-right">₹ {registrationFee.toFixed(2)}</td>
                </tr>

                {/* GST Details */}
                {webinar?.IncludingGST === "active" && gstDetails.totalGST > 0 && (
                  <>
                    {gstDetails.type === 'CGST+SGST' ? (
                      <>
                        <tr className="border-b">
                          <td className="p-3">CGST (9%)</td>
                          <td className="p-3 text-right">₹ {gstDetails.cgst.toFixed(2)}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3">SGST (9%)</td>
                          <td className="p-3 text-right">₹ {gstDetails.sgst.toFixed(2)}</td>
                        </tr>
                      </>
                    ) : (
                      <tr className="border-b">
                        <td className="p-3">IGST (18%)</td>
                        <td className="p-3 text-right">₹ {gstDetails.igst.toFixed(2)}</td>
                      </tr>
                    )}
                  </>
                )}

                <tr className="bg-blue-50 font-bold">
                  <td className="p-3">Total Amount</td>
                  <td className="p-3 text-right text-blue-700">₹ {totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* GST Note with State Information */}
          {/* <div className={`mt-3 p-3 rounded text-sm ${
            gstDetails.type === 'CGST+SGST' 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
          }`}>
            <strong>GST Information:</strong><br/>
            {gstDetails.type === 'CGST+SGST' 
              ? `✅ CGST (9%) + SGST (9%) applied for Maharashtra state`
              : `ℹ️ IGST (18%) applied for other states`}
            <br/>
            <strong>Detected State:</strong> {registration?.state || 'Not available'}
          </div> */}
        </div>

        {/* Payment Button */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="flex flex-col items-center gap-4">
            <div className="text-2xl font-bold text-gray-800">
              Total: ₹ {totalAmount.toFixed(2)}
            </div>

            {!payment ? (
              <button
                onClick={handlePaymentSuccess}
                disabled={isPaying}
                className={`px-8 py-3 rounded-lg font-semibold shadow-lg transition transform hover:scale-105 ${isPaying
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
              >
                {isPaying ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Pay Now"
                )}
              </button>
            ) : (
              <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg font-semibold">
                ✅ Payment Completed Successfully
              </div>
            )}


            <div className="text-xs text-gray-500 text-center">
              You will be redirected to Razorpay for secure payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}