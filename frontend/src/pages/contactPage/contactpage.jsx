import React, { useState, useEffect } from "react";
import axios from "../../utils/axios.js";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha"; // ✅ Import captcha
export default function ContactPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        contactNumber: "",
        email: "",
        message: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); // ✅ New loading state
    const [captchaToken, setCaptchaToken] = useState(null); // ✅ Captcha state
    const [companyData, setCompanyData] = useState();

    const fetchCompanydata = async () => {
        try {
            const response = await axios.get("/general-settings");
            setCompanyData(response.data);
        } catch (error) {
            console.error("Failed to fetch company details:", error);
        }
    };

    useEffect(() => {
        fetchCompanydata();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // clear error when typing
    };


    // ✅ Validate before submitting
    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
        if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required.";
        else if (!/^\d{10}$/.test(formData.contactNumber))
            newErrors.contactNumber = "Enter a valid 10-digit number.";

        if (!formData.email.trim()) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Enter a valid email address.";

        if (!formData.message.trim()) newErrors.message = "Message is required.";
        if (!captchaToken) newErrors.captcha = "Please complete the CAPTCHA.";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // stop submission
        }

        try {
            setLoading(true); // ✅ Start loader
            // const res = await axios.post('/contact', formData);

            const res = await axios.post("/contact", {
                ...formData,
                captchaToken, // ✅ Send captcha token
            });
            // ✅ Success popup
            Swal.fire({
                title: "Success!",
                text: res.data.message || "Your message has been sent successfully.",
                icon: "success",
                confirmButtonColor: "#008080",
            });

            setFormData({ fullName: "", contactNumber: "", email: "", message: "" });
            setCaptchaToken(null);
        } catch (err) {
            //  Error popup
            Swal.fire({
                title: "Error!",
                text: "Failed to submit form. Please try again later.",
                icon: "error",
                confirmButtonColor: "#008080",
            });
        } finally {
            setLoading(false); // ✅ Stop loader
        }

    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-50 flex flex-col items-center justify-center p-6">
                {/* Contact Card */}
                <div className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-3xl shadow-lg p-10 w-full max-w-5xl flex flex-col md:flex-row gap-10">
                    {/* Left Info */}
                    <div className="md:w-2/5 space-y-4 text-gray-800">
                        <h2 className="text-3xl font-bold text-[#008080] mb-3">Contact Us</h2>

                        <p className="text-lg font-semibold flex items-center gap-2">
                            <span className="rounded-full bg-[#008080] p-2">
                                <IoLocationSharp size={22} className="text-white" />
                            </span>
                            {companyData?.companyName}
                        </p>

                        <p className="text-gray-700 ml-12">{companyData?.companyAddress}</p>

                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-[#008080] p-2">
                                <FaPhoneAlt size={22} className="text-white" />
                            </span>
                            <span>+91 72080 69325</span>
                        </div>

                        <p className="flex items-center gap-2">
                            <span className="rounded-full bg-[#008080] p-2">
                                <CiMail size={22} className="text-white" />
                            </span>
                            <a
                                href="mailto:purva@ejobocean.com"
                                className="hover:text-[#008080] hover:underline"
                            >
                                purva@ejobocean.com
                            </a>
                        </p>
                    </div>

                    {/* Right Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="md:w-3/5 flex flex-col gap-5 bg-white/70 p-6 rounded-2xl shadow-md border border-white/50"
                    >
                       {["fullName", "contactNumber", "email"].map((field, i) => (
    <div key={i}>
        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {field.replace("Number", " Number")} *
        </label>

        <input
            type={field === "email" ? "email" : "text"}
            name={field}
            value={formData[field]}
            onChange={(e) => {
                // ✅ Special handling for contactNumber
                if (field === "contactNumber") {
                    const value = e.target.value.replace(/\D/g, ""); // remove non-numeric chars
                    if (value.length <= 10) {
                        setFormData({ ...formData, contactNumber: value });
                        setErrors({ ...errors, contactNumber: "" });
                    }
                } else {
                    handleChange(e);
                }
            }}
            className={`w-full border rounded-lg p-2 bg-white/60 focus:ring-2 focus:outline-none ${
                errors[field]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#008080]"
            }`}
        />

        {errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
        )}
    </div>
))}


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Message *
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"

                                className={`w-full border rounded-lg p-2 bg-white/60 focus:ring-2 focus:outline-none ${errors.message
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-[#008080]"
                                    }`}
                            />
                            {errors.message && (
                                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                            )}
                        </div>

                        {/* ✅ Google reCAPTCHA */}
                        <div className="flex justify-center my-2">
                            <ReCAPTCHA
                                sitekey="6Le7NgYsAAAAAF0y5u52pMhAFPK3P1yo4Vcf-KDB"
                                onChange={setCaptchaToken}
                            />
                        </div>

                        {/* ✅ Button with Loader */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center justify-center bg-[#008080] text-white font-medium py-2 px-6 rounded-lg transition ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-black"
                                }`}
                        >
                            {loading ? (
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
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                    Sending...
                                </div>
                            ) : (
                                "Send Message"
                            )}
                        </button>
                    </form>
                </div>

                {/* Location Map */}
                <div className="w-full max-w-8xl mt-10 rounded-3xl overflow-hidden shadow-lg border border-white/60 mb-10">
                    <iframe
                        title="Company Location"
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3856453.981933427!2d72.818874!3d19.279394000000003!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b7c1fc9d2ab5%3A0xbe5acda0041f0faf!2sBOTHRA%20PROPERTIES!5e0!3m2!1sen!2sin!4v1762592179826!5m2!1sen!2sin"
                        width="100%"
                        height="350"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-3xl w-full"
                    ></iframe>
                </div>
            </div>
        </>
    );
}
