import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios.js";
import { useNavigate } from "react-router";

const JobSeekerRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [roleID, setRoleID] = useState(null);
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchRoleID = async () => {
      try {
        const res = await axios.get("/roles");
        console.log("Roles response:", res.data);

        const roles = Array.isArray(res.data) ? res.data : res.data.roles || [];

        // ✅ Find the seeker role
        const seekerRole = roles.find(
          (role) =>
            role.name?.toLowerCase() === "seeker" ||
            role.roleID === "seeker"
        );

        if (seekerRole) {
          setRoleID(seekerRole._id);
        } else {
          console.error("Seeker role not found");
        }
      } catch (err) {
        console.error("Failed to fetch roles", err);
      }
    };

    fetchRoleID();
  }, []);




  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!roleID) {
      alert("Role not loaded yet. Please try again shortly.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }


    try {

      const payload = {
        ...formData,
        roleID, // ✅ include seeker roleID
      };
      const res = axios.post("/auth/register", payload);

      console.log("Register response:", res.data);
      alert("Registration successful!");
      Navigate("/login");
    } catch (error) {
      alert("Registration failed.");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Job Seeker Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="hidden"
              name="roleID"
              value={roleID || ""}
            />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />

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

export default JobSeekerRegister;
