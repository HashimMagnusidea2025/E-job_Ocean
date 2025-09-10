import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../../utils/axios.js";
import Navbar from "../../navbar/navbar.jsx";
import Footer from "../../footer/footer.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("/auth/login", { email, password });
    const user = res.data.user;

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("role", user.roleID.name); 
    

    //  Navigate based on role
    if (user.roleID.name === "superadmin") {
      navigate("/admin-dash");
      console.log(user.roleID.name);
      
    } else if (user.roleID.name === "seeker") {
      navigate("/seeker-dashboard");
      console.log(user.roleID.name);
    } else if (user.roleID.name === "Employer") {
      navigate("/employer-dashboard");
      console.log(user.roleID.name);
    } else {
      alert("Role not recognized");
    }
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
          <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-sm text-gray-600">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
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

      <Footer/>
    </div>
  );
}
