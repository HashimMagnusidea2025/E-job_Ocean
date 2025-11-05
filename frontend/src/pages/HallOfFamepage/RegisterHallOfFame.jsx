// components/ui/RegisterModal.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "../../utils/axios.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function RegisterHallOfFame({ isOpen, onClose, webinarId, webinarType, selectedSlot, userType, userData }) {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [postOffices, setPostOffices] = useState([]);
    const [selectedPostOffice, setSelectedPostOffice] = useState("");
    const [loadingPincode, setLoadingPincode] = useState(false);
    const [submitting, setSubmitting] = useState(false);

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
    const debounceRef = useRef(null);

    // ✅ Debug logs
    useEffect(() => {
        console.log("RegisterHallOfFame Props:", {
            isOpen,
            webinarId,
            webinarType,
            selectedSlot,
            userType,
            userData
        });
    }, [isOpen, selectedSlot, userType, userData]);

    const handleChange = (e) => {
        const { id, value } = e.target;

        if (id === "mobile") {
            // Only digits and max 10
            if (/^\d*$/.test(value) && value.length <= 10) {
                setFormData({ ...formData, [id]: value });
            }
        } else if (id === "pinCode") {
            // PIN code change - only numbers and max 6 digits
            const pinValue = value.replace(/\D/g, '').slice(0, 6);
            setFormData({ ...formData, [id]: pinValue });

            // Auto-fetch when 6 digits entered
            if (pinValue.length === 6) {
                fetchPostOfficeByPincode(pinValue);
            } else {
                // Reset if PIN code is incomplete
                setPostOffices([]);
                setSelectedPostOffice("");
                setFormData(prev => ({
                    ...prev,
                    state: "",
                    city: ""
                }));
            }
        } else {
            setFormData({ ...formData, [id]: value });
        }

        // Clear error when typing
        setErrors((prev) => ({ ...prev, [id]: "" }));
    };

    // Fetch post office data by pincode
    const fetchPostOfficeByPincode = async (pincode) => {
        setLoadingPincode(true);
        try {
            const response = await axios.get(`/post-offices/pincode/${pincode}`);

            if (response.data && response.data.length > 0) {
                const offices = response.data;
                setPostOffices(offices);

                // Auto-fill state and city from the first post office
                const firstOffice = offices[0];
                setFormData(prev => ({
                    ...prev,
                    state: firstOffice.statename,
                    city: firstOffice.RelatedSuboffice || firstOffice.Districtname
                }));

                // Auto-set country as India
                // const india = countries.find(country => 
                //     country.name.toLowerCase().includes("india")
                // );
                // if (india) {
                //     setFormData(prev => ({ ...prev, country: india.id }));
                // }
            }
        } catch (error) {
            console.error("Error fetching post office data:", error);

            Swal.fire({
                icon: "error",
                title: "PIN Code Not Found",
                text: "Please enter a valid 6-digit PIN code",
                timer: 3000,
                showConfirmButton: false
            });

            setPostOffices([]);
            setSelectedPostOffice("");
            setFormData(prev => ({
                ...prev,
                state: "",
                city: ""
            }));
        } finally {
            setLoadingPincode(false);
        }
    };

    // Handle post office selection
    const handlePostOfficeChange = (e) => {
        const officeName = e.target.value;
        setSelectedPostOffice(officeName);

        // If user selects a specific post office, update city accordingly
        if (officeName) {
            const selectedOffice = postOffices.find(office => office.officename === officeName);
            if (selectedOffice) {
                setFormData(prev => ({
                    ...prev,
                    city: selectedOffice.RelatedSuboffice || selectedOffice.Districtname
                }));
            }
        }
    };

    useEffect(() => {
        axios.get("/country").then((res) => setCountries(res.data.country));
    }, []);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
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
            setPostOffices([]);
            setSelectedPostOffice("");
        }
    }, [isOpen]);

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
        if (!formData.pinCode.trim()) {
            newErrors.pinCode = "PIN Code is required";
        } else if (formData.pinCode.length !== 6) {
            newErrors.pinCode = "PIN Code must be 6 digits";
        }
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.city) newErrors.city = "City is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setSubmitting(true); // 🟢 Start loader
        try {
            // Use correct session ID based on user type
            const sessionId = selectedSlot?.sessionId || webinarId;

            console.log("Submitting registration for:", {
                sessionId,
                userType,
                webinarType,
                selectedSlot
            });

            const { data } = await axios.post(`/registrations/one-to-one`, {
                ...formData,
                one_to_oneId: sessionId,
                type: "one_to_one",
                userType: userType,
                selectedPostOffice: selectedPostOffice || (postOffices[0]?.officename || "")
            });

            const paymentType = (selectedSlot.paymentType || "").toLowerCase();

            if (paymentType === "free") {
                await Swal.fire({
                    icon: "success",
                    title: "Thank you!",
                    text: `You have successfully registered for the ${userType === 'mentor' ? 'mentor' : 'speaker'} session. Confirmation email has been sent to your email.`,
                    confirmButtonColor: "#2563eb",
                });
                // Reset form and close modal
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

                navigate(`/one-to-one-receipt/${sessionId}?registrationId=${data.Registration._id}&email=${formData.email}&type=${data.Registration.type}&userType=${userType}`);

                // Optional: reset form here too
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
        finally {
            setSubmitting(false); // 🔴 Stop loader
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition">
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Register for {userType === 'mentor' ? 'Mentor' : 'Speaker'} Session
                </h2>

                {selectedSlot && (
                    <div className="text-center mb-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                            <span className="font-bold">Selected Slot:</span>{" "}
                            <b>{selectedSlot.startTime} - {selectedSlot.endTime}</b>
                        </p>
                        {selectedSlot.courseTitle && (
                            <p className="text-sm text-gray-600 mt-1">
                                <span className="font-bold">Course:</span> {selectedSlot.courseTitle}
                            </p>
                        )}
                        {selectedSlot.paymentType && (
                            <p className={`text-sm font-bold mt-1 ${selectedSlot.paymentType === 'Free' ? 'text-green-600' : 'text-orange-600'
                                }`}>
                                {selectedSlot.paymentType} Session
                            </p>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* First Name */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.firstName ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>

                    {/* Last Name */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.lastName ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>

                    {/* Email */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.email ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Mobile Number */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="Mobile Number"
                            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.mobile ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                    </div>


                    {/* Country (Auto-set to India from PIN code) */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: Number(e.target.value) })}
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
                        {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                    </div>

                    {/* PIN Code with loading */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            PIN Code <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="pinCode"
                                value={formData.pinCode}
                                onChange={handleChange}
                                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${errors.pinCode ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                                    }`}
                                placeholder="Enter 6-digit PIN Code"
                                maxLength={6}
                            />
                            {loadingPincode && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
                    </div>



                    {/* State (Auto-filled from PIN Code) */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            State <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.state}
                            readOnly
                            className={`w-full border rounded-lg px-3 py-2 bg-gray-50 ${errors.state ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="State will auto-fill from PIN Code"
                        />
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>

                    {/* City (Auto-filled from PIN Code) */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.city}
                            readOnly
                            className={`w-full border rounded-lg px-3 py-2 bg-gray-50 ${errors.city ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="City will auto-fill from PIN Code"
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>

                    {/* Post Office Selection - Show when multiple post offices found */}
                    {/* {postOffices.length > 1 && (
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Post Office <span className="text-blue-600 text-xs">(Optional)</span>
                            </label>
                            <select
                                value={selectedPostOffice}
                                onChange={handlePostOfficeChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">-- Select Specific Post Office --</option>
                                {postOffices.map((office, index) => (
                                    <option key={index} value={office.officename}>
                                        {office.officename} - {office.RelatedSuboffice}
                                    </option>
                                ))}
                            </select>
                            <p className="text-gray-500 text-xs mt-1">
                                {postOffices.length} post office(s) found for this PIN code
                            </p>
                        </div>
                    )} */}

                    {/* GST Number (Optional) */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            GST Number (Optional)
                        </label>
                        <input
                            type="text"
                            id="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleChange}
                            placeholder="GST Number"
                            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300`}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-1 md:col-span-2 mt-4 flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium shadow hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 justify-center"
                            disabled={loadingPincode || submitting}
                        >
                            {submitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Registering...</span>
                                </>
                            ) : loadingPincode ? (
                                "Loading Location..."
                            ) : (
                                `Register for ${userType === "mentor" ? "Mentor" : "Speaker"} Session`
                            )}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}