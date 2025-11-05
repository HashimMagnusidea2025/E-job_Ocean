import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../utils/axios.js";
import Navbar from "../../layout/navbar/navbar.jsx";
import Footer from "../../layout/footer/footer.jsx";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/auth/login", { email, password });
      const user = res.data.user;
      const roleName = user.roleID?.name?.toLowerCase();

      // ✅ Allow only superadmin
      if (roleName !== "superadmin") {
        alert("Access denied. Only Super Admins can log in here.");
        return;
      }

      // ✅ Store tokens
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("role", roleName);

      // ✅ Navigate to admin dashboard
      navigate("/admin-dash");
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-4"
        >
          <h2 className="text-2xl font-bold text-center text-gray-700">
            Super Admin Login
          </h2>

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-sm text-gray-600">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 text-sm text-gray-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
          >
            Login
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
