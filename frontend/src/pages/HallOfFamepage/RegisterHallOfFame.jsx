// components/ui/RegisterModal.jsx
import React, { useState, useEffect } from "react";
import axios from "../../utils/axios.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function RegisterHallOfFame({ isOpen, onClose, webinarId, webinarType, selectedSlot }) {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        pinCode: "",
        country: "",
        state: "",
        city: "",
        gstNumber: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;

        if (id === "mobile") {
            // Only digits and max 10
            if (/^\d*$/.test(value) && value.length <= 10) {
                setFormData({ ...formData, [id]: value });
            }
        } else {
            setFormData({ ...formData, [id]: value });
        }

        // Clear error when typing
        setErrors((prev) => ({ ...prev, [id]: "" }));
    };

    useEffect(() => {
        axios.get("/country").then((res) => setCountries(res.data.country));
    }, []);

    useEffect(() => {
        if (formData.country) {
            axios.get(`/state/country/${formData.country}`).then((res) => setStates(res.data.data));
        } else setStates([]);
    }, [formData.country]);

    useEffect(() => {
        if (formData.state) {
            axios.get(`/city/state/${formData.state}`).then((res) => setCities(res.data.data));
        } else setCities([]);
    }, [formData.state]);

    const validateForm = () => {
        let newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.mobile.trim()) {
            newErrors.mobile = "Mobile number is required";
        } else if (formData.mobile.length !== 10) {
            newErrors.mobile = "Mobile number must be 10 digits";
        }
        if (!formData.pinCode.trim()) newErrors.pinCode = "Pin code is required";
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.city) newErrors.city = "City is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const { data } = await axios.post(`/registrations/one-to-one`, {
                ...formData,
                one_to_oneId: selectedSlot.sessionId,
                type: "one_to_one",
            });

            const paymentType = (selectedSlot.paymentType || "").toLowerCase();

            if (paymentType === "free") {
                await Swal.fire({
                    icon: "success",
                    title: "Thank you!",
                    text: "You have successfully registered for the free session. Confirmation email has been sent to your email.",
                    confirmButtonColor: "#2563eb",
                });
                //  Reset form and close modal
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    mobile: "",
                    pinCode: "",
                    country: "",
                    state: "",
                    city: "",
                    gstNumber: "",
                });
                setErrors({});
                onClose();
            } else if (paymentType === "paid") {
                console.log("Form email before navigate:", formData.email);
                if (!formData.email) {
                    Swal.fire({
                        icon: "error",
                        title: "Email missing",
                        text: "Please enter your email before proceeding to payment.",
                    });
                    return;
                }

                navigate(`/one-to-one-receipt/${selectedSlot.sessionId}?registrationId=${data.Registration._id}&email=${formData.email}&type=${data.Registration.type}`);

                // ✅ Optional: reset form here too
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    mobile: "",
                    pinCode: "",
                    country: "",
                    state: "",
                    city: "",
                    gstNumber: "",
                });
                setErrors({});
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err.response?.data?.message || "Something went wrong!",
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Register for Webinar
                </h2>
                {selectedSlot && (
                    <p className="text-center text-sm text-gray-600 mb-4">
                        Selected Slot: <b>{selectedSlot.startTime} - {selectedSlot.endTime}</b>
                    </p>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                        { id: "firstName", label: "First Name", type: "text", required: true },
                        { id: "lastName", label: "Last Name", type: "text", required: true },
                        { id: "email", label: "Email", type: "email", required: true },
                        { id: "mobile", label: "Mobile Number", type: "text", required: true },
                        { id: "pinCode", label: "Pin Code", type: "text", required: true },
                        { id: "gstNumber", label: "GST Number (Optional)", type: "text" },
                    ].map((field) => (
                        <div key={field.id} className="col-span-1">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor={field.id}
                            >
                                {field.label}{" "}
                                {field.required && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                type={field.type}
                                id={field.id}
                                value={formData[field.id]}
                                onChange={handleChange}
                                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors[field.id] ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder={field.label}
                            />
                            {errors[field.id] && (
                                <p className="text-red-500 text-xs mt-1">{errors[field.id]}</p>
                            )}
                        </div>
                    ))}

                    {/* Country */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                        <select
                            value={formData.country}
                            onChange={(e) =>
                                setFormData({ ...formData, country: Number(e.target.value) })
                            }
                            className={`w-full border rounded-lg px-3 py-2 ${errors.country ? "border-red-500" : "border-gray-300"
                                }`}
                        >
                            <option value="">-- Select Country --</option>
                            {countries.map((country) => (
                                <option key={country._id} value={country.id}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                        {errors.country && (
                            <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                        )}
                    </div>

                    {/* State */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                        <select
                            value={formData.state}
                            onChange={(e) =>
                                setFormData({ ...formData, state: Number(e.target.value) })
                            }
                            disabled={!formData.country}
                            className={`w-full border rounded-lg px-3 py-2 ${errors.state ? "border-red-500" : "border-gray-300"
                                }`}
                        >
                            <option value="">-- Select State --</option>
                            {states.map((state) => (
                                <option key={state._id} value={state.id}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                        {errors.state && (
                            <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                        )}
                    </div>

                    {/* City */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                        <select
                            value={formData.city}
                            onChange={(e) =>
                                setFormData({ ...formData, city: Number(e.target.value) })
                            }
                            disabled={!formData.state}
                            className={`w-full border rounded-lg px-3 py-2 ${errors.city ? "border-red-500" : "border-gray-300"
                                }`}
                        >
                            <option value="">-- Select City --</option>
                            {cities.map((city) => (
                                <option key={city._id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                        {errors.city && (
                            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="col-span-1 md:col-span-2 mt-4 flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium shadow hover:bg-blue-700 transition"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
