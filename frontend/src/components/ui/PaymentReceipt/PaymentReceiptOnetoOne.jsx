// src/pages/PaymentReceiptOneToOne.jsx
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../../../utils/axios.js";
import Swal from "sweetalert2";


export default function PaymentReceiptOneToOne() {
    const navigate = useNavigate()
    const location = useLocation();
    const { oneToOneId } = useParams(); // path param
    // <-- missing
    const searchParams = new URLSearchParams(location.search);
    const registrationId = searchParams.get("registrationId");
    let paymentType = searchParams.get("type") || "one_to_one";



    console.log("oneToOneId:", oneToOneId);
    console.log("registrationId:", registrationId);



    const [session, setSession] = useState(null);
    const [payment, setPayment] = useState(null);


    let userEmail = searchParams.get("email");

    if (!userEmail) {
        // fallback: try session email
        userEmail = session?.email;
    }

    console.log("userEmail:", userEmail);
    useEffect(() => {
        if (!oneToOneId) {
            console.error("No oneToOneId provided!");
            return;
        }
        const fetchSession = async () => {
            try {
                const { data } = await axios.get(`/one-to-one/${oneToOneId}`);
                setSession(data);
                console.log(data);

            } catch (err) {
                console.error("Error fetching session:", err);
            }
        };
        fetchSession();
    }, [oneToOneId]);

    const parseMoney = (val) => {
        if (!val) return 0;
        const cleaned = String(val).replace(/[^0-9.]/g, "");
        return parseFloat(cleaned) || 0;
    };

    const fees = parseMoney(session?.fees);
    const gstAmount = fees > 0 ? +(fees * 0.18).toFixed(2) : 0;
    const totalAmount = fees + gstAmount;

    const handlePayment = async () => {
        try {
            const orderRes = await axios.post("/payment/create-order", {
                amount: totalAmount,
                registrationId, // ✅ abhi bhi backend ko chahiye for linking payment
            });

            const order = orderRes.data;
            const RAZORPAY_KEY = "rzp_test_xAK5yuk7ejZvD3";

            const options = {
                key: RAZORPAY_KEY,
                amount: order.amount,
                currency: order.currency,
                name: session?.courseTitle || "One-to-One Session",
                description: "Session Registration Fee",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        await axios.post("/payment/verify-payment", {
                            registrationId,
                            courseId: oneToOneId,
                            user_email: userEmail,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: totalAmount,
                            gst: gstAmount,
                            type: paymentType,
                        });

                        setPayment(true);   // payment mark kar diya
                        setSession(null);

                        Swal.fire({
                            icon: "success",
                            title: "Payment Successful!",
                            text: "You are registered and payment confirmed.",
                            confirmButtonColor: "#2563eb",
                        }).then(() => {
                            navigate("/"); // ✅ Payment ke baad redirect
                        });
                    } catch (err) {
                        Swal.fire({
                            icon: "warning",
                            title: "Payment Done",
                            text: "But failed to verify. Contact support.",
                        });
                    }
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Payment error:", err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Payment Receipt</h2>
            <p><b>Session:</b> {session?.courseTitle}</p>
            <p><b>Speaker:</b>{session?.Speaker?.salutation}{session?.Speaker?.firstName} {session?.Speaker?.lastName}</p> {/*  Speaker show kar diya */}
            <p><b>Type:</b> {session?.paymentType}</p>

            <table className="w-full mt-4 border">
                <tbody>
                    <tr><td className="p-2">Fees</td><td className="p-2 text-right">₹ {fees}</td>
                    </tr>
                    <tr>
                        <td className="p-2">GST (18%)</td>
                        <td className="p-2 text-right">₹ {gstAmount.toFixed(2)}</td>
                    </tr>

                    <tr className="font-bold"><td className="p-2">Total</td><td className="p-2 text-right">₹ {totalAmount}</td>
                    </tr>
                </tbody>
            </table>

            {!payment && (
                <button
                    onClick={handlePayment}
                    className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
                >
                    Pay Now
                </button>
            )}
        </div>
    );
}
