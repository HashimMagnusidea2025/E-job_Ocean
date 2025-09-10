import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import banner1 from "../../media/png/MASTERCLASS.png";
import {
  FaBars, FaTimes, FaPencilAlt, FaEye, FaDesktop,
  FaEnvelope, FaUser, FaSignOutAlt, FaHome,
  FaSearch, FaBriefcase, FaMapMarkerAlt, FaPhoneAlt,
  FaUserAlt, FaBlackTie, FaFileInvoice,
  FaUsers

} from "react-icons/fa";
import JobPackageDetails from "./PurchasedJobPackageDetails";
import UpgradeJobPackages from "./UpgradeJobPackages";

import { FiSearch } from "react-icons/fi";
import logo from "../../media/logo/ejob_ocean.png";
import EditAccountDetails from "./editAccountDetails";
import CompanyPublicProfile from "./companyPublicProfile";
import PostAJob from "./postAJob";
import ManageJobs from './ManageJobs';
import PurchasedCvsPackage from "./CvsSearchPackages";
import PaymentHistory from "./paymentHistory";
import UnlockedUsers from "./unlockedUsers";
// import MyMessages from "../seekerDashboard/MyMessages";
import CompanyFollowers from "./companyFollowers";


const courses = [
  {
    title: "Investment Banking MasterClass",
    image: banner1,
    trainer: "CA Saurabh Bansal",
    hours: "15+ Hrs",
    price: "₹3499/-",
  },
  {
    title: "IND AS & IFRS MasterClass",
    image: banner1,
    trainer: "CA Rakshit Mittal",
    hours: "20+ Hrs",
    price: "₹3499/-",
  },
  {
    title: "AI & ChatGPT For Finance MasterClass",
    image: banner1,
    trainer: "Inderjeet & Archit",
    hours: "20+ Hrs",
    price: "₹2499/-",
  },
  {
    title: "Audit Master Class",
    image: banner1,
    trainer: "CA Archit Agarwal",
    hours: "30+ Hrs",
    price: "₹3499/-",
  },
];

export default function EmployerDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);


  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem("activeSection") || "dashboard";
  });

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
    <div className="font-[Poppins]">

      <div className="flex  bg-[#f6f9f9] overflow-hidden">


        <div className={`fixed top-0 left-0 h-full bg-white  shadow-md w-64 z-30 transform transition-transform duration-300 md:static md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          {/* <div className="flex justify-between">
          <div className="p-4 font-bold text-lg border-b">
            <a href="/">
              <img src={logo} alt="" className="w-[130px]" />
            </a>
          </div>
          
        </div> */}

          <nav className="py-6 text-sm font-medium text-gray-700 h-screen">
            <ul className="space-y-2">
              <div className="flex justify-end">
                <button className="md:hidden text-xl px-4" onClick={toggleSidebar}>
                  <FaTimes size={30} />
                </button>
              </div>

              <SidebarItem icon={<FaHome />} label="Dashboard"
                onClick={() => handleSectionChange("dashboard")} active={activeSection === "dashboard"} />
              <SidebarItem icon={<FaPencilAlt />} label="Edit Account Details"
                onClick={() => handleSectionChange('Edit-Account-Details')} active={activeSection === "Edit-Account-Details"} />
              <SidebarItem icon={<FaUserAlt />} label="Company Public Profile"
                onClick={() => handleSectionChange('Company-Public-Profile')} active={activeSection === "Company-Public-Profile"} />
              <SidebarItem icon={<FaDesktop />} label="Post A Job"
                onClick={() => handleSectionChange('Post-A-Job')} active={activeSection === "Post-A-Job"} />
              <SidebarItem icon={<FaBlackTie />} label="Manage Jobs"
                onClick={() => handleSectionChange("Manage-Jobs")} active={activeSection === "Manage-Jobs"} />
              <SidebarItem icon={<FaSearch />} label="CV Search Packanges"
                onClick={() => handleSectionChange('CV-Search-Packanges')} active={activeSection === "CV-Search-Packanges"} />
              <SidebarItem icon={<FaFileInvoice />} label="Payment History"
                onClick={() => handleSectionChange('Payment-History')} active={activeSection === "Payment-History"} />
              <SidebarItem icon={<FaUser />} label="Unloked Users"
                onClick={() => handleSectionChange("Unloked-Users")} active={activeSection === "Unloked-Users"} />
              {/* <SidebarItem icon={<FaEnvelope />} label="Company Messages"
                onClick={() => handleSectionChange("Company-Messages")} active={activeSection === "Company-Messages"} /> */}
              <SidebarItem icon={<FaUsers />} label="Company Followers"
                onClick={() => handleSectionChange('Company-Followers')} active={activeSection === "Company-Followers"} />
              <SidebarItem
                icon={<FaSignOutAlt />}
                label="Logout"
                onClick={handleLogout}
              />
            </ul>
          </nav>
        </div>

        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden" onClick={toggleSidebar}></div>
        )}


        <div className="flex-1 flex flex-col overflow-y-auto">

          <div className="bg-white   flex items-center justify-between p-4 shadow-md sticky top-0 z-10">
            <div className="flex items-center">
              <button className="md:hidden text-xl" onClick={toggleSidebar}>
                {isOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
              </button>

            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block w-[257px]">

              </div>
              <button onClick={() => setShowSearch(!showSearch)} className="block md:hidden text-gray-600">
                <FiSearch size={28} />
              </button>
              {showSearch && (
                <input
                  type="text"
                  placeholder="Search..."
                  className="block md:hidden border py-3 px-2 rounded-md text-sm absolute right-10 top-20 bg-white shadow z-20 w-80 transition-all duration-300"
                />
              )}
              {/* <div className="relative">
              <button className="flex items-center gap-2 font-semibold focus:outline-none" onClick={() => setShowProfile((prev) => !prev)}>
                <img src="https://i.pravatar.cc/40" alt="Admin" className="w-10 h-10 rounded-full" />
                <span className="hidden md:inline">Super Admin</span>
              </button>
              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-md md:hidden z-10">
                  <div className="flex items-center gap-3 p-3">
                    <img src="https://i.pravatar.cc/40" alt="Admin" className="w-10 h-10 rounded-full" />
                    <span className="font-medium text-sm">Super Admin</span>
                  </div>
                </div>
              )}
            </div> */}
            </div>
          </div>

          <div className="p-4">
            {activeSection === "dashboard" && (
              <div className=" space-y-10">
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-2xl font-semibold text-center">Welcome to Employer Dashboard</h2>
                </div>


                <div className="pt-8 px-4">
                  <div className="flex flex-wrap gap-4 justify-center">
                    <StatCard title="Open Job" value="123" icon={<FaEye />} />
                    <StatCard title="Followers" value="58" icon={<FaUser />} />

                    <StatCard title="Messages" value="0" icon={<FaBriefcase />} />
                  </div>

                  <div className="pt-10">
                    <JobPackageDetails />

                  </div>
                  <div className=" pt-10">
                    <UpgradeJobPackages />
                  </div>
                  <div className="pt-10">
                    <JobPackageDetails />

                  </div>
                  <div className=" pt-10">
                    <UpgradeJobPackages />
                  </div>
                </div>
              </div>
            )}
            <div></div>
            {activeSection === 'Edit-Account-Details' && (
              <EditAccountDetails />
            )}
            {activeSection === "Company-Public-Profile" && (
              <CompanyPublicProfile />
            )}
            {activeSection === "Post-A-Job" && (
              <PostAJob />
            )}
            {activeSection === "Manage-Jobs" && (
              <ManageJobs />
            )}
            {activeSection === "CV-Search-Packanges" && (
              <PurchasedCvsPackage />
            )}
            {activeSection === "Payment-History" && (
              <PaymentHistory />
            )}
            {activeSection === "Unloked-Users" && (
              <UnlockedUsers />
            )}
            {/* {activeSection === "Company-Messages" && (
              <MyMessages />
            )} */}
            {activeSection === "Company-Followers" && (

              <CompanyFollowers />

            )}
          </div>


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


function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4 w-40 md:w-60 lg:w-60">
      <div className={`text-xl md:text-2xl`}>{icon}</div>
      <div>
        <h2 className="text-sm md:text-base font-semibold mb-1">{title}</h2>
        <p className="text-gray-700 text-sm md:text-lg">{value}</p>
      </div>
    </div>
  );
}
