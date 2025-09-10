import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import banner1 from "../../media/png/MASTERCLASS.png";
import {
  FaBars, FaTimes, FaPencilAlt, FaFile, FaPrint, FaEye, FaDesktop,
  FaHeart, FaBullhorn, FaEnvelope, FaUser, FaSignOutAlt, FaHome,
  FaBriefcase, FaMapMarkerAlt, FaPhoneAlt
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import caarchitaggarwal from "../../media/png/ca-archit-aggarwal.png";
import { OurFreeCoursesCrds } from "../cards/cards";
import EditProfile from "./editProfile";
import BuildResume from "./BuildResume";
import PrintResume from "./PrintResume";
import MyJobAplications from "./myJobAplications";
import MyFevoriteJob from "./myFevoriteJobs";
import MYJobAlerts from "./MyJobAlerts";
import MyMessages from './MyMessages';
import MyFollowings from "./myFollowings";

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

export default function SeekerDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem("activeSection") || "dashboard";
  });

  useEffect(() => {
    document.title = `Seeker | ${activeSection.replace(/-/g, ' ')}`;
  }, [activeSection]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleSectionChange = (sectionName) => {
    setActiveSection(sectionName);
    localStorage.setItem("activeSection", sectionName);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("role");
    navigate("/"); // ✅ redirect to home
  };

  return (
    <div className="flex bg-[#eef4f6] min-h-screen font-[Poppins]">

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-100% bg-white shadow-xl w-64 z-30 transform transition-transform duration-300 md:static md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <nav className="py-6 text-sm font-medium text-gray-700">
          <ul className="space-y-2">
            <div className="flex justify-end">
              <button className="md:hidden text-xl px-4" onClick={toggleSidebar}>
                <FaTimes size={30} />
              </button>
            </div>
            <SidebarItem icon={<FaHome />} label="Dashboard" onClick={() => handleSectionChange("dashboard")} active={activeSection === "dashboard"} />
            <SidebarItem icon={<FaPencilAlt />} label="Edit Profile" onClick={() => handleSectionChange("Edit-profile")} active={activeSection === "Edit-profile"} />
            <SidebarItem icon={<FaFile />} label="Build Resume" onClick={() => handleSectionChange("Build-resume")} active={activeSection === "Build-resume"} />
            <SidebarItem icon={<FaPrint />} label="Download CV" onClick={() => handleSectionChange("Download-CV")} active={activeSection === "Download-CV"} />
            <Link to="/View-Public-Profile">
              <SidebarItem icon={<FaEye />} label="View Public Profile" active={false} />
            </Link>
            <SidebarItem icon={<FaDesktop />} label="My Job Applications" onClick={() => handleSectionChange("My-Job-Applications")} active={activeSection === "My-Job-Applications"} />
            <SidebarItem icon={<FaHeart />} label="My Favourite Jobs" onClick={() => handleSectionChange("My-Favourite-Jobs")} active={activeSection === "My-Favourite-Jobs"} />
            <SidebarItem icon={<FaBullhorn />} label="My Job Alerts" onClick={() => handleSectionChange("My-Job-Alerts")} active={activeSection === "My-Job-Alerts"} />
            <SidebarItem icon={<FaEnvelope />} label="My Messages" onClick={() => handleSectionChange("My-Messages")} active={activeSection === "My-Messages"} />
            <SidebarItem icon={<FaUser />} label="My Followings" onClick={() => handleSectionChange("My-Followings")} active={activeSection === "My-Followings"} />
            <SidebarItem className="text-red-500 "
              icon={<FaSignOutAlt  className="text-red-500 "/>}
              label="Logout"
              onClick={handleLogout}
            />
          </ul>
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden" onClick={toggleSidebar}></div>}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="bg-white flex items-center  justify-between p-4 shadow sticky top-0 z-10">
          <div className="flex items-center">
            <button className="md:hidden text-xl" onClick={toggleSidebar}>
              {isOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowSearch(!showSearch)} className="block md:hidden text-gray-600">
              <FiSearch size={28} />
            </button>
            {showSearch && (
              <input
                type="text"
                placeholder="Search..."
                className="block md:hidden border py-4 px-3 rounded-md text-sm absolute right-10 top-20 bg-white shadow z-20 w-80"
              />
            )}
          </div>
        </div>

        {/* Conditional Sections */}
        <div className="p-4">
          {activeSection === "dashboard" && <Dashboard />}
          {activeSection === "Edit-profile" && <EditProfile />}
          {activeSection === "Build-resume" && <BuildResume />}
          {activeSection === "Download-CV" && <PrintResume />}
          {activeSection === "My-Job-Applications" && <MyJobAplications />}
          {activeSection === "My-Favourite-Jobs" && <MyFevoriteJob />}
          {activeSection === "My-Job-Alerts" && <MYJobAlerts />}
          {activeSection === "My-Messages" && <MyMessages />}
          {activeSection === "My-Followings" && <MyFollowings />}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, onClick, active }) {
  return (
    <li onClick={onClick} className={`px-5 py-3 flex gap-2 items-center cursor-pointer rounded-lg transition-colors duration-200 ${active ? "text-white bg-[#00b6bd]" : "text-gray-700 hover:bg-gray-100"}`}>
      {icon}
      <span>{label}</span>
    </li>
  );
}

function Dashboard() {
  return (
    <div className="space-y-10">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold text-center">Welcome to Seeker Dashboard</h2>
      </div>

      <div className="flex flex-wrap gap-6 justify-center">
        <StatCard title="Profile View" value="123" icon={<FaEye />} />
        <StatCard title="Followings" value="58" icon={<FaUser />} />
        <StatCard title="My CV List" value="1" icon={<FaBriefcase />} />
        <StatCard title="Messages" value="0" icon={<FaBriefcase />} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img src={caarchitaggarwal} className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-[#2167ac] object-cover" alt="profile" />
          <div>
            <h2 className="text-2xl font-bold text-[#2167ac]">Job Seeker</h2>
            <p className="text-gray-600 flex items-center gap-2"><FaMapMarkerAlt /> Bagaha, Bihar, India</p>
            <p className="text-gray-600 flex items-center gap-2"><FaPhoneAlt /> +1234567890</p>
            <p className="text-gray-600 flex items-center gap-2"><FaEnvelope /> seeker@jobsportal.com</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Our <span className="text-[#339ca0]">Free Courses</span></h2>
          <button className="bg-gradient-to-r from-[#339ca0] to-black text-white px-4 py-2 rounded hover:opacity-90">View All</button>
        </div>
        <Swiper
          spaceBetween={30}
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
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4 w-40 md:w-60">
      <div className="text-xl md:text-2xl text-[#339ca0]">{icon}</div>
      <div>
        <h2 className="text-sm md:text-base font-semibold mb-1">{title}</h2>
        <p className="text-gray-700 text-sm md:text-lg">{value}</p>
      </div>
    </div>
  );
}