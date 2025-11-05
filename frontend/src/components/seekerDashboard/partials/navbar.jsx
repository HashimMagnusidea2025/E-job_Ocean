import React, { useState, useEffect } from 'react';
import { FaBars, FaUser, FaEnvelope, FaSignOutAlt } from "react-icons/fa";
import { useLocation, useNavigate, Link } from "react-router-dom";
import logo from "../../../media/logo/ejob_ocean.png";
import axios from '../../../utils/axios.js';

const baseURL = import.meta.env.VITE_BACKEND_URL;

const Navbar = ({ onSidebarToggle }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Company logo fetch function
  const getCompanyLogo = async () => {
    try {
      const response = await axios.get('/company-information/user/logo', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success && response.data.logo) {
        return response.data.logo;
      }
      return null;
    } catch (error) {
      console.error('Error fetching company logo:', error);
      return null;
    }
  };

  // Mentor profile fetch function
  const getMentorProfile = async (userId) => {
    try {
      const response = await axios.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching mentor profile:', error);
      return null;
    }
  };

  // Seeker profile fetch function
  const getSeekerProfile = async (userId) => {
    try {
      const response = await axios.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching seeker profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const userData = localStorage.getItem("user");
    setUser(userData ? JSON.parse(userData) : null);

    setShowProfile(false); // close dropdown on route change
  }, [location]);

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(!!localStorage.getItem("token"));

        try {
          const userRole = parsedUser.roleID?.name?.toLowerCase();

          console.log("User Role:", userRole);
          console.log("User Data:", parsedUser);

          if (userRole === "employer") {
            // Employer - fetch company logo
            const logoPath = await getCompanyLogo();
            if (logoPath) {
              const fullLogoUrl = `${baseURL}${logoPath}`;
              setProfileImage(fullLogoUrl);
              console.log("Employer Logo URL:", fullLogoUrl);
            } else {
              setProfileImage("/img/person-avtar.png");
            }
          }
          else if (userRole === "seeker") {
            // Seeker - fetch seeker profile
            const seekerData = await getSeekerProfile(parsedUser._id);
             console.log("Seeker Data:", seekerData);
            if (seekerData && seekerData.profilePicture) {
              const fullProfileUrl = `${baseURL}${seekerData.profilePicture}`;
              setProfileImage(fullProfileUrl);
              console.log("Seeker Profile URL:", fullProfileUrl);
            } else {
              setProfileImage("/img/person-avtar.png");
            }
          }
          else if (userRole === "mentor") {
            // ✅ MENTOR PROFILE - fetch mentor profile picture
            const mentorData = await getMentorProfile(parsedUser._id);
                 console.log("Mentor Data:", mentorData);
            if (mentorData && mentorData.profilePicture) {
              const fullProfileUrl = `${baseURL}${mentorData.profilePicture}`;
              setProfileImage(fullProfileUrl);
             console.log("Mentor Profile URL:", fullProfileUrl);
            } else {
              // If no profile picture, use default
              setProfileImage("/img/person-avtar.png");
            }
          }
          else if (userRole === "superadmin") {
            // Superadmin - use logo
            setProfileImage(logo);
          }
          else {
            // Default for other roles
            setProfileImage("/img/person-avtar.png");
               console.log("Using default avatar");
          }

        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfileImage("/img/person-avtar.png");
        }
      }
    };

    loadUserProfile();

    // Listen for user updates (like when profile is edited)
    window.addEventListener("userUpdated", loadUserProfile);
    return () => {
      window.removeEventListener("userUpdated", loadUserProfile);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    setProfileImage(null);
    setCompanyLogo(null);
    navigate("/");
  };

  // Get dashboard route based on user role
  const getDashboardRoute = () => {
    const roleName = user?.roleID?.name?.toLowerCase();
    switch (roleName) {
      case "seeker":
        return "/seeker-dashboard";
      case "employer":
        return "/employer-dashboard";
      case "superadmin":
        return "/admin-dash";
      case "mentor":
        return "/mentor-dashboard"; // ✅ Mentor dashboard
      default:
        return "/";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow z-50 flex items-center h-16 px-4">
      {/* Logo + Toggle */}
      <div className="flex items-center gap-4">
        <Link to='/'>
          <img src={logo} alt="Ejob Ocean" className="w-[160px] h-auto" />
        </Link>
        <button
          onClick={onSidebarToggle}
          className="p-2 rounded hover:bg-gray-100 transition ml-24"
        >
          <FaBars size={22} />
        </button>
      </div>

      {/* Search bar */}
      <div className="hidden md:flex ml-6 flex-1 max-w-md">
        <form className="flex items-center border rounded overflow-hidden w-full">
          <input
            type="text"
            placeholder="Search"
            className="px-3 py-2 outline-none flex-1"
          />
        </form>
      </div>

      {/* Profile dropdown */}
      <nav className="ml-auto flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowProfile(prev => !prev)}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <FaUser className="text-gray-600" />
              </div>
            )}

            <span className="hidden md:block font-medium">
              {user ? `${user.firstName} ${user.lastName}` : "example"}
            </span>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-60 bg-white border rounded-md shadow-md z-10">
              <div className="flex items-center gap-3 p-3 border-b">
                <div>
                  <div className='flex gap-2 items-center'>
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <FaUser className="text-gray-600" />
                      </div>
                    )}
                    <p className="font-medium text-sm">
                      {user ? `${user.firstName} ${user.lastName}` : "Admin"}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500">  {user?.email || "@example.com"}</p>
                </div>
              </div>
              <ul className="text-sm text-gray-700">
                <li
                  onClick={() => {
                    const dashboardRoute = getDashboardRoute();
                    navigate(dashboardRoute);
                    setShowProfile(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <FaUser /> Profile
                </li>
                <li
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-red-500"
                >
                  <FaSignOutAlt /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;