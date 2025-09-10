import React, { useState, useEffect } from 'react';
import { FaBars, FaUser, FaEnvelope, FaSignOutAlt } from "react-icons/fa";
import { useLocation, useNavigate, Link } from "react-router-dom";
import logo from "../../../media/logo/ejob_ocean.png";
import axios from '../../../utils/axios.js';

const Navbar = ({ onSidebarToggle }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const getCompanyLogo = async () => {
    try {
      const response = await axios.get('/company-information/user/logo', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Check if logo exists in response
      if (response.data.success && response.data.logo) {
        return response.data.logo;
      }
      return null; // Return null if no logo exists
    } catch (error) {
      console.error('Error fetching company logo:', error);
      return null; // Return null on error
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const userData = localStorage.getItem("user");
    setUser(userData ? JSON.parse(userData) : null);

    setShowProfile(false); // close dropdown on route change
  }, [location]);


  // Load user data & listen for external updates
  useEffect(() => {
    const loadUserData = async () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(!!localStorage.getItem("token"));

        try {
          if (parsedUser.roleID?.name === "Employer") {
            const logoPath = await getCompanyLogo();
            if (logoPath) {
              const fullLogoUrl = `http://localhost:5000${logoPath}`;
              setProfileImage(fullLogoUrl);
              console.log("Employer Logo URL:", fullLogoUrl);
            } else {
              // Set default image if no logo exists
              setProfileImage("/img/person-avtar.png");
            }
          } else if (parsedUser.roleID?.name === "seeker") {
            const logoPath = await getCompanyLogo();
            if (logoPath) {
              const fullLogoUrl = `http://localhost:5000${logoPath}`;
              setProfileImage(fullLogoUrl);
            } else {
              setProfileImage("/img/person-avtar.png");
            }
          } else if (parsedUser.roleID?.name === "superadmin") {
            setProfileImage(logo);
          }
        } catch (error) {
          console.error("Error fetching logo/profile:", error);
          setProfileImage("/img/person-avtar.png");
        }
      }

    };

    loadUserData(); // On initial load
    window.addEventListener("userUpdated", loadUserData);
    return () => {
      window.removeEventListener("userUpdated", loadUserData);
    };
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    setProfileImage(null)
    setCompanyLogo(null);
    navigate("/");
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
            <img
              src={profileImage || companyLogo || "/img/person-avtar.png"}
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover"

            />
            <span className="hidden md:block font-medium">
              {user ? `${user.firstName} ${user.lastName}` : "example"}
            </span>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-60 bg-white border rounded-md shadow-md z-10">
              <div className="flex items-center gap-3 p-3 border-b">
                <div>
                  <div className='flex gap-2 items-center'>
                    <img
                      src={profileImage || companyLogo || "/img/person-avtar.png"}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"

                    />
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
                    const roleName = user?.roleID?.name?.toLowerCase();
                    if (roleName === "seeker") navigate("/seeker-dashboard");
                    else if (roleName === "employer") navigate("/employer-dashboard");
                    else if (roleName === "superadmin") navigate("/admin-dash");
                    else navigate("/");
                    setShowProfile(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <FaUser /> Profile
                </li>
                {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                    <FaEnvelope /> Messages
                  </li> */}
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
