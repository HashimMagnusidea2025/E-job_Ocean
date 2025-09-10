import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../utils/axios";

const CompanyRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [roleID, setRoleID] = useState(null);
  const navigate = useNavigate();

  // Fetch the employer role ID on component mount
  useEffect(() => {
    const fetchRoleID = async () => {
      try {
        const res = await axios.get("/roles");
        console.log("Roles response:", res.data);

        const roles = Array.isArray(res.data) ? res.data : res.data.roles || [];

        const employerRole = roles.find((role) =>
          role.name?.toLowerCase() === "employer" ||
          role.roleID === "employer"
        );

        if (employerRole) {
          setRoleID(employerRole._id);
        } else {
          console.error("Employer role not found");
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
        roleID,
      };

      const res = await axios.post("/auth/register", payload);
      console.log(payload);
      console.log(res);
      
      
      alert("Company registered successfully!");
      navigate("/login"); // or navigate("/employer-dashboard")
    } catch (error) {
      alert("Registration failed.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Company Registration
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* First & Last Name */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={handleChange}
          required
        />
        <input type="hidden" name="roleID" value={roleID || ""} />

        <button
          type="submit"
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-300"
        >
          Register Company
        </button>
      </form>
    </div>
  );
};

export default CompanyRegister;
