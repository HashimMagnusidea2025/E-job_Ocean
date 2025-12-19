import { useState, useEffect } from "react";
import { auth, googleProvider } from "../../../../firebase.js";
import { signInWithPopup } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../../../utils/axios.js";
import Navbar from "../../navbar/navbar.jsx";
import Footer from "../../footer/footer.jsx";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 add this import
export default function Login() {
  const [activeTab, setActiveTab] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 new state
  const [contact, setContact] = useState(""); // can be email or phone
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [role, setRole] = useState("");


  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const r = params.get("role");
    if (r === "Employer" || r === "seeker" || r === "Mentor") setRole(r);
  }, [location]);

  // 🔍 Helper: check if input is email or phone
  const isEmail = (value) => /\S+@\S+\.\S+/.test(value);
  const isPhone = (value) => /^[0-9]{10}$/.test(value);


  const handleResendOtp = async () => {
    try {
      if (!isPhone(contact)) {
        Swal.fire("Invalid Phone", "Enter valid phone number", "warning");
        return;
      }

      const { data } = await axios.post("/auth/resend-otp", { phone: contact });

      Swal.fire("OTP Resent!", data.message, "success");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to resend OTP", "error");
    }
  };


  // 📩 Send OTP intelligently (email or phone)
  const handleSendOTP = async (e) => {
    e.preventDefault();

    try {
      let payload = {};
      let endpoint = "";

      if (isEmail(contact)) {
        payload = { email: contact };
        endpoint = "/auth/send-otp-email";
      } else if (isPhone(contact)) {
        payload = { phone: contact };
        endpoint = "/auth/send-otp";
      } else {
        Swal.fire("Invalid Input", "Please enter a valid email or 10-digit phone number", "warning");
        return;
      }

      const { data } = await axios.post(endpoint, payload);
      Swal.fire("OTP Sent!", data.message, "success");
      setOtpSent(true);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to send OTP", "error");
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const payload = isEmail(contact)
        ? { email: contact, otp }
        : { phone: contact, otp };

      const res = await axios.post("/auth/verify-otp", payload);
      const user = res.data.user;

      if (
        (role === "seeker" && user.roleID.name !== "seeker") ||
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

      if (user.roleID.name === "superadmin") navigate("/admin-dash");
      else if (user.roleID.name === "seeker") navigate("/seeker-dashboard");
      else if (user.roleID.name === "Employer") navigate("/employer-dashboard");
      else if (user.roleID.name === "Mentor") navigate("/mentor-dashboard");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Invalid OTP", "error");
    }
  };

  // ✉️ Email/Password OR Google Login
  const handleSubmit = async (e, isGoogleLogin = false) => {
    e.preventDefault();
    try {
      let res, user;
      if (isGoogleLogin) {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;

        res = await axios.post("/auth/login", {
          email: firebaseUser.email,
          password: "google_oauth",
          role,
        });

        user = res.data.user;
      } else {
        res = await axios.post("/auth/login", { email, password });
        user = res.data.user;
      }

      if (
        (role === "seeker" && user.roleID.name !== "seeker") ||
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

      if (user.roleID.name === "superadmin") navigate("/admin-dash");
      else if (user.roleID.name === "seeker") navigate("/seeker-dashboard");
      else if (user.roleID.name === "Employer") navigate("/employer-dashboard");
      else if (user.roleID.name === "Mentor") navigate("/mentor-dashboard");
    } catch (err) {
      Swal.fire("Login failed", err.response?.data?.message || err.message, "error");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-700">
            {role === "seeker"
              ? "Job Seeker Login"
              : role === "Employer"
                ? "Employer Login"
                : role === "Mentor"
                  ? "Mentor Login"
                  : "Login"}
          </h2>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab("email")}
              className={`w-1/2 py-2 text-center font-medium ${activeTab === "email"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
                }`}
            >
              Email Login
            </button>
            <button
              onClick={() => setActiveTab("phone")}
              className={`w-1/2 py-2 text-center font-medium ${activeTab === "phone"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
                }`}
            >
              OTP Login
            </button>
          </div>

          {/* EMAIL LOGIN TAB */}
          {activeTab === "email" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Password Field with Eye */}
              <div className="flex flex-col relative">
                <label className="text-sm text-gray-600 mb-1">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                />

                {/* Eye Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[35px] text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="text-right">
                <a href="/forgot-password" className="text-blue-500 hover:underline text-sm">
                  Forgot Password?
                </a>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
                Login
              </button>

              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </button>
            </form>
          )}

          {/* OTP LOGIN TAB */}
          {activeTab === "phone" && (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOTP} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">
                  Email or Your Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Your email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value.trim())}
                  required
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {otpSent && (
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">OTP</label>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}

                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              )}

              {otpSent && (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-blue-600 text-sm underline"
                >
                  Resend OTP
                </button>
              )}


              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
              >
                {otpSent ? "Verify OTP" : "Send OTP"}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
