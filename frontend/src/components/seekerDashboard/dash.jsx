import React, { useState, useEffect } from "react";
import Layout from "./partials/layout";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import caarchitaggarwal from "../../media/png/ca-archit-aggarwal.png";
import noImage from '../../media/png/no-image.png';
import axios from '../../utils/axios.js';

import {
  FaBars, FaTimes, FaPencilAlt, FaFile, FaPrint, FaEye, FaDesktop,
  FaHeart, FaBullhorn, FaEnvelope, FaUser, FaSignOutAlt, FaHome,
  FaBriefcase, FaMapMarkerAlt, FaPhoneAlt
} from "react-icons/fa";
import banner1 from "../../media/png/MASTERCLASS.png";
import { OurFreeCoursesCrds } from "../cards/cards";
import "swiper/css";
import "swiper/css/navigation";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [seekerData, setSeekerData] = useState(null);
  const [locationNames, setLocationNames] = useState({
    country: "",
    state: "",
    city: ""
  });
  const [loading, setLoading] = useState(true);
  const baseURL = import.meta.env.VITE_BACKEND_URL;

  // Fetch user and seeker data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          return;
        }

        // Fetch user data
        const userRes = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch seeker data
        try {
          const seekerRes = await axios.get("/seeker/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (seekerRes.data.success && seekerRes.data.data) {
            setSeekerData(seekerRes.data.data);
            
            // Fetch location names after getting seeker data
            if (seekerRes.data.data.city || seekerRes.data.data.state || seekerRes.data.data.country) {
              await fetchLocationNames(seekerRes.data.data);
            }
          }
        } catch (seekerErr) {
          console.log("Seeker profile not found");
        }

        setUserData(userRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Listen for profile updates
    const handleUserUpdate = () => {
      fetchData();
    };

    window.addEventListener("userUpdated", handleUserUpdate);
    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate);
    };
  }, []);

  // Fetch location names like in CompanyPublicProfile
  const fetchLocationNames = async (seekerData) => {
    try {
      const newLocationNames = { country: "", state: "", city: "" };

      // Fetch country name
      if (seekerData.country) {
        try {
          const countryResponse = await axios.get(`/country/${seekerData.country}`);
          if (countryResponse.data.success) {
            newLocationNames.country = countryResponse.data.data.name;
          }
        } catch (err) {
          console.error("Error fetching country:", err);
          newLocationNames.country = seekerData.country; // Fallback to ID if name not found
        }
      }

      // Fetch state name
      if (seekerData.state) {
        try {
          const stateResponse = await axios.get(`/state/${seekerData.state}`);
          if (stateResponse.data.success) {
            newLocationNames.state = stateResponse.data.data.name;
          }
        } catch (err) {
          console.error("Error fetching state:", err);
          newLocationNames.state = seekerData.state; // Fallback to ID if name not found
        }
      }

      // Fetch city name
      if (seekerData.city) {
        try {
          const cityResponse = await axios.get(`/city/${seekerData.city}`);
          if (cityResponse.data.success) {
            newLocationNames.city = cityResponse.data.data.name;
          }
        } catch (err) {
          console.error("Error fetching city:", err);
          newLocationNames.city = seekerData.city; // Fallback to ID if name not found
        }
      }

      setLocationNames(newLocationNames);
    } catch (err) {
      console.error("Error fetching location names:", err);
    }
  };

  const courses = [
    {
      title: "Investment Banking MasterClass",
      image: banner1,
      trainer: "CA Saurabh Bansal",
      hours: "15+ Hrs",
      price: "\u20b93499/-",
    },
    {
      title: "IND AS & IFRS MasterClass",
      image: banner1,
      trainer: "CA Rakshit Mittal",
      hours: "20+ Hrs",
      price: "\u20b93499/-",
    },
    {
      title: "AI & ChatGPT For Finance MasterClass",
      image: banner1,
      trainer: "Inderjeet & Archit",
      hours: "20+ Hrs",
      price: "\u20b92499/-",
    },
    {
      title: "Audit Master Class",
      image: banner1,
      trainer: "CA Archit Agarwal",
      hours: "30+ Hrs",
      price: "\u20b93499/-",
    },
  ];

  // Get profile image
  const getProfileImage = () => {
    if (seekerData?.profileImage) {
      const cleanBase = baseURL.replace(/\/+$/, "");
      const cleanPath = seekerData.profileImage.replace(/^\/+/, "");
      return `${cleanBase}/${cleanPath}`;
    }
    return noImage;
  };

  // Get user name
  const getUserName = () => {
    if (seekerData?.firstName) {
      return seekerData.firstName;
    }
    if (userData?.firstName) {
      return userData.firstName;
    }
    return "Job Seeker";
  };

  // Get location - Updated like CompanyPublicProfile
  const getLocation = () => {
    if (!seekerData) return "Location not specified";

    const locationParts = [
      locationNames.city || seekerData.city || '',
      locationNames.state || seekerData.state || '',
      locationNames.country || seekerData.country || ''
    ];

    const filteredParts = locationParts.filter(part => part && part !== '');
    
    if (filteredParts.length === 0) {
      return "Bagaha, Bihar, India"; // Default location
    }
    
    return filteredParts.join(", ");
  };

  // Get phone number
  const getPhoneNumber = () => {
    if (seekerData?.mobile) {
      return seekerData.mobile;
    }
    if (seekerData?.phone) {
      return seekerData.phone;
    }
    return "+1234567890";
  };

  // Get email
  const getEmail = () => {
    if (userData?.email) {
      return userData.email;
    }
    return "seeker@jobsportal.com";
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex font-[Poppins]">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="md:p-4 p-0">
            <div className="space-y-10">

              {/* Welcome Card */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-semibold text-center">
                  Welcome  to Seeker Dashboard
                </h2>
              </div>

              {/* Profile Section */}
              <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                  <img
                    src={getProfileImage()}
                    className="w-28 h-28 md:w-44 md:h-44 rounded-full border-4 border-[#2167ac] object-cover"
                    alt="profile"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-[#2167ac]">{getUserName()}</h2>
                    <p className="text-gray-600 flex items-center gap-2 justify-center md:justify-start">
                      <FaMapMarkerAlt /> {getLocation()}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2 justify-center md:justify-start">
                      <FaPhoneAlt /> {getPhoneNumber()}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2 justify-center md:justify-start">
                      <FaEnvelope /> {getEmail()}
                    </p>
                    
                    {/* Additional seeker information */}
                    {seekerData && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {seekerData.gender && (
                          <p><span className="font-semibold">Gender:</span> {seekerData.gender}</p>
                        )}
                        {seekerData.maritalStatus && (
                          <p><span className="font-semibold">Marital Status:</span> {seekerData.maritalStatus}</p>
                        )}
                        {seekerData.jobExperience && (
                          <p><span className="font-semibold">Experience:</span> {seekerData.jobExperience}</p>
                        )}
                      </div>
                    )}
                    
                    {/* Edit Profile Button */}
                    <button 
                      onClick={() => window.location.href = "/seeker-dashboard/my-profile"}
                      className="mt-4 bg-[#00b6bd] hover:bg-[#239da1] text-white px-4 py-2 rounded flex items-center gap-2"
                    >
                      <FaPencilAlt /> Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Courses Section */}
              <div className="bg-white rounded-xl shadow">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                  <h2 className="text-2xl font-bold">
                    Our <span className="text-[#339ca0]">Free Courses</span>
                  </h2>
                  <button className="bg-gradient-to-r from-[#339ca0] to-black text-white px-4 py-2 rounded hover:opacity-90">
                    View All
                  </button>
                </div>
                <Swiper
                  className="w-full"
                  spaceBetween={20}
                  slidesPerView={1}
                  navigation
                  breakpoints={{
                    640: { slidesPerView: 1.2 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 3 },
                    1920: { slidesPerView: 4 },
                  }}
                  modules={[Navigation]}
                >
                  {courses.map((course, i) => (
                    <SwiperSlide key={i}>
                      <OurFreeCoursesCrds {...course} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4 sm:w-40 md:w-60">
      <div className="text-xl md:text-2xl text-[#339ca0]">{icon}</div>
      <div>
        <h2 className="text-sm md:text-base font-semibold mb-1">{title}</h2>
        <p className="text-gray-700 text-sm md:text-lg">{value}</p>
      </div>
    </div>
  );
}