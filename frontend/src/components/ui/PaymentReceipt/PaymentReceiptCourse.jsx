


import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../../../utils/axios.js";
import Swal from "sweetalert2";

export default function PaymentReceiptCourse() {
    const navigate = useNavigate()
    const location = useLocation();
    const { courseId } = useParams(); // path param
    const searchParams = new URLSearchParams(location.search);
    const registrationId = searchParams.get("registrationId");
    const userEmail = searchParams.get("email");
    const userType = searchParams.get("type") || "course";
    const [isPaying, setIsPaying] = useState(false);

    console.log("courseId:", courseId);
    console.log("registrationId:", registrationId);
    console.log("userEmail:", userEmail);
    console.log("userType:", userType);

    const [course, setCourse] = useState(null);
    const [registration, setRegistration] = useState(null);
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);

    // Parse money values
    const parseMoney = (val) => {
        if (val == null) return 0;
        if (typeof val === "number") return val;
        const cleaned = String(val).replace(/[^0-9.]/g, "");
        const n = parseFloat(cleaned);
        return Number.isFinite(n) ? n : 0;
    };

    // Fixed GST Calculation - Same as PaymentReceipt
    const calculateGST = (amount, state) => {
        const baseAmount = amount;

        // Check if state is Maharashtra
        const isMaharashtra = state === '4008' ||
            (typeof state === 'string' && state.toUpperCase() === 'MAHARASHTRA');

        console.log("🔍 GST CALCULATION DEBUG (Course):");
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
            try {
                console.log("🔄 Fetching details for registrationId:", registrationId);

                const promises = [
                    registrationId ? axios.get(`/course-register/${registrationId}`) : Promise.resolve({ data: null }),
                    registrationId ? axios.get(`/payment/registration/${registrationId}`) : Promise.resolve({ data: null }),
                ];

                const [regRes, payRes] = await Promise.allSettled(promises);

                // Registration data
                if (regRes.status === "fulfilled") {
                    const registrationData = regRes.value.data?.data || null;
                    setRegistration(registrationData);
                    
                    setCourse(registrationData?.courseId || null);
                    console.log("✅ Registration data:", registrationData);
                    console.log("✅ Course data from registration:", registrationData?.courseId);
                    console.log("📍 Registration state:", registrationData?.state);
                } else {
                    setRegistration(null);
                    setCourse(null);
                    console.log("❌ Registration data not found");
                }

                // Payment data
                // if (payRes.status === "fulfilled" && payRes.value?.data?.success) {
                //     setPayment(payRes.value.data.data || null);
                //     console.log("✅ Payment data:", payRes.value.data.data);
                // } else {
                //     setPayment(null);
                //     console.log("❌ Payment data not found or error:", payRes.status === "fulfilled" ? payRes.value?.data : payRes.reason);
                // }

            } catch (err) {
                console.error("Fetch error:", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch details. Please try again.",
                });
            } finally {
                setLoading(false);
            }
        };

        if (registrationId) fetchDetails();
    }, [registrationId]);

    // Calculate fees and GST
    const courseFee = parseMoney(course?.fees);
    const regFee = parseMoney(registration?.fee) ||
        parseMoney(registration?.registrationFee) ||
        parseMoney(registration?.amount) || 0;
    const paymentFee = parseMoney(payment?.total_amount);

    const registrationFee = paymentFee || regFee || courseFee || 0;

    // Get state from registration for GST calculation
    const registrationState = registration?.state || '';

    console.log("📍 CURRENT STATE ANALYSIS (Course):");
    console.log("Registration state:", registrationState);
    console.log("Registration fee:", registrationFee);
    console.log("Course fee:", courseFee);
    console.log("Registration object:", registration);

    // Calculate GST
    const gstDetails = calculateGST(registrationFee, registrationState);

    const totalAmount = registrationFee + gstDetails.totalGST;

    console.log("🧾 FINAL GST DETAILS (Course):", gstDetails);
    console.log("💰 TOTAL AMOUNT (Course):", totalAmount);

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

    const handlePayment = async () => {
        if (!registrationId) {
            alert("registrationId missing.");
            return;
        }

        // DEBUG: Check values before sending to Razorpay
        console.log("🔍 PAYMENT DEBUG VALUES (Course):");
        console.log("Registration Fee:", registrationFee);
        console.log("GST Total:", gstDetails.totalGST);
        console.log("Total Amount (₹):", totalAmount);
        console.log("Registration State:", registrationState);
        console.log("GST Type:", gstDetails.type);

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

            setIsPaying(true); // 🟢 Start loader

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
                currency: order.currency,
                name: course?.courseTitle || "Course Registration",
                description: "Course Registration Payment",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        await axios.post("/payment/verify-payment", {
                            registrationId,
                            courseId: courseId,
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
                            type: userType,
                            userType: "student" // or whatever
                        });

                        setPayment(true);

                        setTimeout(() => {
                            setIsPaying(false);
                            Swal.fire({
                                icon: "success",
                                title: "Payment Successful!",
                                text: `You have successfully registered for the course.`,
                                confirmButtonColor: "#2563eb",
                            }).then(() => {
                                navigate("/");
                            });
                        }, 1000);

                    } catch (err) {
                        setIsPaying(false);
                        console.error("Payment success handling error:", err);
                        Swal.fire({
                            icon: "warning",
                            title: "Payment Completed",
                            text: "Payment was successful but there was an issue with confirmation.",
                        });
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
                    course: course?.courseTitle || "Course",
                    userType: "student"
                },
                modal: {
                    ondismiss: () => {
                        setIsPaying(false); // 🔴 Stop loader if user closes Razorpay modal
                    },
                },
            };

            if (!window.Razorpay) {
                alert("Razorpay SDK not loaded. Please refresh the page.");
                return;
            }

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Error creating order:", error);
            Swal.fire({
                icon: "error",
                title: "Payment Error",
                text: "Failed to initialize payment. Please try again.",
            });
        }
    };

    if (loading) return <div className="p-6 text-center">Loading receipt details...</div>;
    if (!course) return <div className="p-6 text-center">No course data found.</div>;

    return (
        <div className="max-w-3xl mx-auto mt-10 mb-10 p-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border">
                {/* Header */}
                <div className="bg-blue-600 text-white p-6">
                    <h1 className="text-2xl font-bold text-center">Payment Receipt - Course Registration</h1>
                </div>

                {/* Course Info */}
                <div className="p-6 border-b">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-bold text-gray-600">Course Title</p>
                            <p className="text-gray-800 text-lg">
                                {course?.courseTitle || "Course title not available"}
                            </p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-600">Course Type</p>
                            <p className="text-gray-800">
                                Course Registration
                            </p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-600">Duration</p>
                            <p className="text-gray-800">
                                {course?.duration || "—" }
                            </p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-600">Payment Type</p>
                            <p className="text-gray-800">
                                {course?.paymentType || "—"}
                            </p>
                        </div>
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
                                    <td className="p-3">Course Fees</td>
                                    <td className="p-3 text-right">₹ {registrationFee.toFixed(2)}</td>
                                </tr>

                                {/* GST Details */}
                                {registrationFee > 0 && gstDetails.totalGST > 0 && (
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
                </div>

                {/* Payment Button */}
                <div className="p-6 bg-gray-50 border-t">
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-2xl font-bold text-gray-800">
                            Total: ₹ {totalAmount.toFixed(2)}
                        </div>

                        {!payment ? (
                            <button
                                onClick={handlePayment}
                                disabled={isPaying}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition transform hover:scale-105 disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {isPaying ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Processing Payment...</span>
                                    </>
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