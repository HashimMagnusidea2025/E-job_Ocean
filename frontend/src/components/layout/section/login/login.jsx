

import { useState, useEffect } from "react";
import { auth, googleProvider } from "../../../../firebase.js";
import { signInWithPopup } from "firebase/auth";

import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../../../utils/axios.js";
import Navbar from "../../navbar/navbar.jsx";
import Footer from "../../footer/footer.jsx";
import Swal from "sweetalert2";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const r = params.get("role");
    if (r === "Employer" || r === "seeker" || r === "Mentor") setRole(r);
  }, [location]);

  const handleSubmit = async (e, isGoogleLogin = false) => {
    e.preventDefault();
    try {


      let res;
      let user;

      if (isGoogleLogin) {
        // Google login flow
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;

        // Send Google user email to backend
        res = await axios.post("/auth/login", {
          email: firebaseUser.email,
          password: "google_oauth", // dummy password if needed
            role,
        });

        user = res.data.user;
      } else {
        // Normal email/password login
        res = await axios.post("/auth/login", { email, password });
        user = res.data.user;
      }
      // const res = await axios.post("/auth/login", { email, password });
      // const user = res.data.user;

      // Check if the logged-in role matches the selected role
      if ((role === "seeker" && user.roleID.name !== "seeker") ||
        (role === "Employer" && user.roleID.name !== "employer") ||
        (role === "Mentor" && user.roleID.name !== "Mentor")
      ) {
        Swal.fire({
        icon: "warning",
        title: "Wrong Login Portal!",
        text: `You cannot login here. Please use the ${user.roleID.name} login.`,
        confirmButtonColor: "#3085d6",
      });
      return;
      }

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
      } else if (user.roleID.name === "Mentor") {
        navigate("/mentor-dashboard");
        console.log(user.roleID.name);
      }
      else {
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
          <h2 className="text-2xl font-bold text-center text-gray-700">
            {role === "seeker"
              ? "Job Seeker Login"
              : role === "Employer"
                ? "Employer Login"
                : role === "Mentor"
                  ? "mentor Login"
                  : "Login"}
          </h2>


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
<div className="text-right">
  <a href="/forgot-password" className="text-blue-500 hover:underline text-sm">
    Forgot Password?
  </a>
</div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
          >
            Login
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)} // <-- Google login
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition mt-2 flex items-center justify-center gap-2"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

        </form>
      </div>

      <Footer />
    </div>
  );
}
