import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../../media/logo/ejob_ocean.png';
import axios from '../../../utils/axios.js';
import { IoMdClose } from "react-icons/io";
import { FaUser, FaEnvelope, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);

  const fetchCompanyLogo = async () => {
    try {
      const response = await axios.get('/general-settings'); // ya aapke backend endpoint
      if (response.data && response.data.logo) {
        setCompanyLogo(`http://localhost:5000${response.data.logo}`);
      }
    } catch (error) {
      console.error("Failed to fetch company logo:", error);
      setCompanyLogo(null);
    }
  };
  useEffect(() => {
    fetchCompanyLogo();
  }, []);



  const navigate = useNavigate();
  const location = useLocation();

  // API function to get company logo
  const getCompanyLogo = async () => {
    try {
      const response = await axios.get('/company-information/user/logo', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching company logo:', error);
      throw error;
    }
  };

  useEffect(() => {

    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));


    } else {
      setUser(null);
    }

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
            // 🔹 Employer -> fetch company logo
            const response = await getCompanyLogo();
            if (response.success) {
              const fullLogoUrl = `http://localhost:5000${response.logo}`;
              setProfileImage(fullLogoUrl);
              console.log("Employer Logo URL:", fullLogoUrl);
            } else {
              setProfileImage(null);
            }
          } else if (parsedUser.roleID?.name === "seeker") {
            const response = await getCompanyLogo();
            const fullLogoUrl = `http://localhost:5000${response.logo}`;
            setProfileImage(fullLogoUrl);
          } else if (parsedUser.roleID?.name === "superadmin") {
            // 🔹 Superadmin -> use default logo
            setProfileImage(logo);
          }

          console.log("Parsed User Data:", parsedUser);
        } catch (error) {
          console.error("Error fetching logo/profile:", error);
          setProfileImage(null);
        }
      }

    };

    loadUserData(); // On initial load
    window.addEventListener("userUpdated", loadUserData);
    return () => {
      window.removeEventListener("userUpdated", loadUserData);
    };
  }, []);


  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => {
    setMenuOpen(false);
    setShowMoreDropdown(false);
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleMoreDropdown = () => setShowMoreDropdown(!showMoreDropdown);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const getImageSource = () => {
    return profileImage; // Just return profileImage, no fallback
  };

  return (
    <div className='bg-[#edf1f9]'>
      <div className='container mx-auto'>
        <nav className="h-[70px] text-black px-10 flex items-center justify-between relative font-[Poppins] z-50">
          <div className="flex items-center">
            <Link to="/">
              <img
                src={companyLogo || '/media/logo/ejob_ocean.png'}
                alt="Company Logo"
                className="h-8"
              />
            </Link>

          </div>

          <div className="text-4xl cursor-pointer block md:hidden" onClick={toggleMenu}>
            ☰
          </div>

          <ul className="hidden md:flex items-center gap-4 text-sm font-medium px-6 py-4">
            <li className="relative">
              <span onClick={toggleDropdown} className=" cursor-pointer p-4">
                <Link to='/courses' className='hover:text-[#339ca0]'>COURSES</Link>
              </span>
              {showDropdown && (
                <div className="absolute left-[-110px] top-[28px] mt-1 w-[900px] bg-white border shadow-xl flex z-50 p-16 rounded-lg">
                  <div className="w-1/3 border-r pr-4">
                    <ul className="space-y-2 font-semibold text-sm">
                      <li className="hover:bg-[#339ca0] hover:text-white p-2 rounded cursor-pointer">FLAGSHIP MASTERCLASSES [DOMAIN-WISE]</li>
                      <li className="hover:bg-[#339ca0] hover:text-white cursor-pointer p-2">FINANCE TOOLS MASTERCLASSES</li>
                      <li className="hover:bg-[#339ca0] hover:text-white cursor-pointer p-2">INTERVIEW AND SOFT SKILLS</li>
                      <li className="hover:bg-[#339ca0] hover:text-white cursor-pointer p-2">COMBO PACKAGES</li>
                      <li className="hover:bg-[#339ca0] hover:text-white cursor-pointer p-2">FREE COURSES</li>
                      <button className="mt-4 bg-black text-white px-4 py-2 rounded w-full">VIEW ALL COURSES</button>
                    </ul>
                  </div>
                  <div className="w-2/3 grid grid-cols-2 gap-4 pl-4 text-sm">
                    {[
                      "Investment Banking Masterclass",
                      "IND AS & IFRS Masterclass",
                      "AI & ChatGPT For Finance MasterClass",
                      "Dubai (UAE) Tax MasterClass",
                      "Audit MasterClass",
                      "Financial Statement MasterClass",
                      "Financial Modelling & Valuation MasterClass",
                      "GST MasterClass"
                    ].map((item, idx) => (
                      <Link key={idx} className="p-3 hover:bg-[#339ca0] hover:text-white cursor-pointer">{item}</Link>
                    ))}
                  </div>
                </div>
              )}
            </li>

            <li><Link to="/placement-program" className="hover:text-[#339ca0]">PLACEMENT PROGRAM</Link></li>
            <li><Link to="/webinars" className="hover:text-[#339ca0]">WEBINARS</Link></li>
            <li><Link to="/hall-of-fame" className="hover:text-[#339ca0]">LIVE MENTORSHIP</Link></li>
            {/* <li><Link to="/live-mentorship" className="hover:text-[#339ca0]">LIVE MENTORSHIP</Link></li> */}
            
              <Link to="/placement-program">
              <li className="hover:bg-[#339ca0] hover:text-white p-2 rounded cursor-pointer">JOBS</li>
              </Link>
            <li className="relative">
              <span onClick={toggleMoreDropdown} className="cursor-pointer hover:text-[#339ca0] p-4">MORE</span>
              {showMoreDropdown && (
                <div className="absolute left-[-130px] top-[28px] mt-1 w-[250px] bg-white border shadow-xl z-50 p-6 rounded-lg text-sm">
                  <ul className="space-y-3">
                    <li className="hover:bg-[#339ca0] hover:text-white p-2 rounded cursor-pointer">WHATSAPP GROUPS</li>

                    <li className="hover:bg-[#339ca0] hover:text-white p-2 rounded cursor-pointer">TESTIMONIALS</li>
                    <li className="hover:bg-[#339ca0] hover:text-white p-2 rounded cursor-pointer">BECOME A MENTOR</li>
                    <li className="hover:bg-[#339ca0] hover:text-white p-2 rounded cursor-pointer">HIRE FORM US</li>
                    <li className="hover:bg-[#339ca0] hover:text-white p-2 rounded cursor-pointer">B2B CORPORATE TRAINING</li>
                    <Link to='/About-Us'><li className="hover:bg-[#339ca0] hover:text-white p-2 rounded cursor-pointer">ABOUT US</li></Link>
                    <Link to='/Blogs-page'><li className="hover:bg-[#339ca0] hover:text-white p-2 rounded cursor-pointer">BLOGS</li></Link>
                  </ul>
                </div>
              )}
            </li>

            <Link to="/CA-register"><li className="cursor-pointer hover:text-[#339ca0]">CA Fresher</li></Link>

            {!isLoggedIn ? (
              <>
                <li onClick={() => setShowRegisterModal(true)} className="cursor-pointer hover:text-[#339ca0]">Register</li>
                <Link to='/login'><li className="cursor-pointer hover:text-[#339ca0]">LOGIN</li></Link>
              </>
            ) : (
              <div className="relative profile-dropdown">
                <button
                  className="flex items-center gap-2 font-semibold focus:outline-none"
                  onClick={() => setShowProfile(prev => !prev)}
                >
                  {profileImage ? (
                    <img
                      src={getImageSource()}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <FaUser className="text-gray-600" />
                    </div>
                  )}
                  <span className="hidden md:inline">{user?.firstName || "Admin"}</span>
                </button>

                {showProfile && (
                  <div className="absolute right-0 mt-2 w-60 bg-white border rounded-md shadow-md z-10">
                    <div className="flex items-center gap-3 p-3 border-b">
                      <div>
                        <div className='flex gap-2 items-center'>
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="h-8 w-8 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = "/img/person-avtar.png";
                            }}
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
            )}
          </ul>

          {/* Mobile Menu */}
          {menuOpen && (
            <ul className="space-y-2 absolute top-[70px] left-0 w-full bg-white shadow-md py-4 px-6 flex flex-col md:hidden text-sm font-medium z-50">
              <li onClick={closeMenu}><Link to="/Courses" className="p-2 border-b block hover:text-[#339ca0]">COURSES</Link></li>
              <li onClick={closeMenu}><Link to="/placement-program" className="p-2 border-b block hover:text-[#339ca0]">PLACEMENT PROGRAM</Link></li>
              <li onClick={closeMenu}><Link to="/webinars" className="p-2 border-b block hover:text-[#339ca0]">WEBINARS</Link></li>
              <li onClick={closeMenu}><Link to="/hall-of-fame" className="p-2 border-b block hover:text-[#339ca0]">HALL OF FAME</Link></li>
              <li onClick={closeMenu}><Link to="/live-mentorship" className="p-2 border-b block hover:text-[#339ca0]">LIVE MENTORSHIP</Link></li>

              {!isLoggedIn ? (
                <>
                  <li onClick={closeMenu}><Link to="/CA-register" className="p-2 block hover:text-[#339ca0]">CA Fresher</Link></li>
                  <li onClick={() => { setShowRegisterModal(true); closeMenu(); }} className="p-2 cursor-pointer hover:text-[#339ca0]">Register</li>
                  <li onClick={closeMenu}><Link to="/login" className="p-2 block hover:text-[#339ca0]">Login</Link></li>
                </>
              ) : (
                <li onClick={() => { handleLogout(); closeMenu(); }} className="p-2 cursor-pointer text-red-500">Logout</li>
              )}
            </ul>
          )}

          {/* REGISTER MODAL */}
          {showRegisterModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              onClick={() => setShowRegisterModal(false)}
            >
              <div
                className="bg-white p-6 rounded-lg w-[400px] text-center space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold mb-4">Register As</h2>
                  <button onClick={() => setShowRegisterModal(false)}>
                    <IoMdClose size={20} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setShowRegisterModal(false);
                    window.location.href = "/job-seeker-register";
                  }}
                  className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Job Seeker
                </button>
                <button
                  onClick={() => {
                    setShowRegisterModal(false);
                    window.location.href = "/company-register";
                  }}
                  className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Company
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
