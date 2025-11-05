import React, { useState, useEffect } from "react";
import axios from "../../utils/axios.js";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const BecomeAMentorRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    type: "mentor",
  });

  const [errors, setErrors] = useState({});
  const [roleID, setRoleID] = useState(null);
  const Navigate = useNavigate();

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email address";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchRoleID = async () => {
      try {
        const res = await axios.get("/roles");
        const roles = Array.isArray(res.data)
          ? res.data
          : res.data.roles || [];
        const mentorRole = roles.find(
          (role) =>
            role.name?.toLowerCase() === "mentor" || role.roleID === "mentor"
        );
        if (mentorRole) setRoleID(mentorRole._id);
      } catch (err) {
        console.error("Failed to fetch roles", err);
      }
    };

    fetchRoleID();
  }, []);

  // ✅ Fix: clear field-specific error when typing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!roleID) {
      Swal.fire({
        icon: "warning",
        title: "Please Wait!",
        text: "Role not loaded yet. Try again shortly.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      const payload = { ...formData, roleID };
      console.log("📦 Submitting payload:", payload);
      const res = await axios.post("/auth/mentor-register", payload);

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your request has been submitted. Please wait for admin approval.",
        confirmButtonText: "OK",
        confirmButtonColor: "#2563eb",
      }).then(() => {
        Navigate("/");
      });
    } catch (error) {
      console.error("❌ Registration error:", error.response?.data || error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong. Please try again later.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Become A Mentor Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ✅ First & Last name stacked nicely */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.firstName}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.lastName}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.email}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.phone}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default BecomeAMentorRegister;
