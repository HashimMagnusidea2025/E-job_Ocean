// components/ui/RegisterModal.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "../../utils/axios.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function RegisterModal({ isOpen, onClose, webinarId, webinarType }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [postOffices, setPostOffices] = useState([]);
  const [selectedPostOffice, setSelectedPostOffice] = useState("");
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Debounce reference
  const debounceRef = useRef(null);

  // Handle change with mobile validation
  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "mobile") {
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
      }
    } else {
      setFormData({ ...formData, [id]: value });
    }

    // Clear errors when user types
    if (errors[id]) {
      setErrors({ ...errors, [id]: "" });
    }
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

        // // Auto-set country as India
        // const india = countries.find(country =>
        //   country.name.toLowerCase().includes("india")
        // );
        // if (india) {
        //   setFormData(prev => ({ ...prev, country: india.id }));
        // }

        // Swal.fire({
        //   icon: "success",
        //   title: "Location Found!",
        //   text: `Found ${offices.length} post office(s) for PIN code ${pincode}`,
        //   timer: 2000,
        //   showConfirmButton: false
        // });
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

  // Validate function
  const validateForm = () => {
    let newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (formData.mobile.length !== 10) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (!formData.pinCode) {
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

  // Country list
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true); // 🟢 start loader
    try {
      const { data } = await axios.post(`/registrations`, {
        ...formData,
        webinarId,
        type: "webinar",
        selectedPostOffice: selectedPostOffice || (postOffices[0]?.officename || "")
      });
      const registrationId = data.Registration._id;

      if (webinarType?.toLowerCase() === "free") {
        Swal.fire({
          icon: "success",
          title: "Registered Successfully!",
          text: "You have been registered and added to your Google Calendar.",
          confirmButtonColor: "#2563eb",
        });
        onClose();
      } else if (webinarType?.toLowerCase() === "paid") {

        navigate(`/payment-receipt/${webinarId}?registrationId=${registrationId}&email=${formData.email}`);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        Swal.fire({
          icon: "warning",
          title: "Already Registered",
          text: err.response.data.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! Please try again.",
        });
      }
    }
    finally {
      setSubmitting(false); // 🔴 stop loader
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition text-2xl"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Register for Webinar
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { id: "firstName", label: "First Name", type: "text", required: true },
            { id: "lastName", label: "Last Name", type: "text", required: true },
            { id: "email", label: "Email", type: "email", required: true },
            { id: "mobile", label: "Mobile Number", type: "text", required: true, maxLength: 10 },
          ].map((field) => (
            <div key={field.id} className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={field.id}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type}
                id={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                maxLength={field.maxLength}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${errors[field.id] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                placeholder={field.label}
              />
              {errors[field.id] && (
                <p className="text-red-500 text-xs mt-1">{errors[field.id]}</p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: Number(e.target.value) })}
              className={`w-full border rounded-lg px-3 py-2 ${errors.country ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
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
            {/* {formData.pinCode.length === 6 && !loadingPincode && (
              <p className="text-green-600 text-xs mt-1">✓ Valid PIN code format</p>
            )} */}
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

          {/* Country (Auto-set to India) */}


          {/* State (Auto-filled from PIN Code) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
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
          {/* GST Number */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="gstNumber">
              GST Number (Optional)
            </label>
            <input
              type="text"
              id="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="GST Number"
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
                "Register"
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}