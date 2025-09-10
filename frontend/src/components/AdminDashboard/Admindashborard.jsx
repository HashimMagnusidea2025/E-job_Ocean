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
  FaSearch, FaBriefcase,
  FaUserAlt,
  FaBook,
  FaCog
} from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { IoMdMenu } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";

import { FiSearch } from "react-icons/fi";
import logo from "../../media/logo/ejob_ocean.png";
import PermissionsPage from "./PermissionsPage/PermissionsPage";
import UsersPage from "./userspage/userspage";
import RolesPage from "./rolepage/rolepage";
import CourseCategory from "./OurCoursesCategory/OurCoursesCategory";
import GeneralSettings from "./generalSettings/generalSettings";
import ProfessionalCategoryPage from "./ProfessionalCategory/ProfessionalCategory";
import LocationForm from "./location/location";
import CAFresherListPage from "./CAFresherListPage/CAFresherListPage";
import SkillsCategoryPage from "./SkillsCategory/SkillsCategory";
import CareerCategoryPage from "./CareerLevelCategory/CareerLevelCategory";
import FunctionalAreaCategory from "./FunctionalAreaCategory/FunctionalAreaCategory";
import JobTypeCategoryPage from "./jobTypeCategory/jobTypeCategory";
import JobShiftCategoryPage from "./jobShiftCategory/jobShiftCategory";
import DegreeLevelCategoryPage from "./DegreeLevelCategory/DegreeLevelCategory";



export default function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMasterSettings, setShowMasterSettings] = useState(false);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });


  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem("activeSection") || "dashboard";
  });

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleSectionChange = (sectionName) => {
    setActiveSection(sectionName);
    localStorage.setItem("activeSection", sectionName);
  };

  return (
    <div className="flex h-screen bg-[#f6f9f9] overflow-hidden font-[Poppins]">

     <div className={`fixed top-0 left-0 h-full bg-white shadow-md w-64 z-30 transform transition-transform duration-300 md:static md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} overflow-y-auto`}>

        <div className="flex justify-between">
          <div className="p-4 font-bold text-lg border-b">
            <a href="/">
              <img src={logo} alt="" className="w-[130px]" />
            </a>
          </div>
          <button className="md:hidden text-xl px-4" onClick={toggleSidebar}>
            {isOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
          </button>
        </div>

        <nav className="py-4 text-sm font-medium text-gray-700">
          <ul className="space-y-2 overflow-y-auto">
            <SidebarItem
              icon={<FaHome />}
              label="Dashboard"
              onClick={() => handleSectionChange("Dashboard")}
              active={activeSection === "dashboard"}
            />

            {/* Master Settings Parent */}
            <li>
              <button
                onClick={() => setShowMasterSettings((prev) => !prev)}
                className={`w-full px-[15px] py-[10px] flex items-center gap-2 rounded cursor-pointer 
              ${showMasterSettings ? "text-[#00b6bd] bg-[#f6f9ff]" : "text-gray-700"} 
              hover:text-[#00b6bd] hover:bg-[#f6f9ff]`}
              >
                <IoMdSettings />
                <span>Master Settings</span>
              </button>

              {/* Nested Items */}
              {showMasterSettings && (
                <ul className="ml-2 mt-2 space-y-1">
                  <SidebarItem
                    icon={<FaPencilAlt />}
                    label="RoleList"
                    onClick={() => handleSectionChange("Role-List")}
                    active={activeSection === "Role-List"}
                  />
                  <SidebarItem
                    icon={<FaUserAlt />}
                    label="UserList"
                    onClick={() => handleSectionChange("User-List")}
                    active={activeSection === "User-List"}
                  />
                  <SidebarItem
                    icon={<FaDesktop />}
                    label="PermissionList"
                    onClick={() => handleSectionChange("Permission-List")}
                    active={activeSection === "Permission-List"}
                  />

                  <SidebarItem
                    icon={<BiSolidCategory />}
                    label="Course Category"
                    onClick={() => handleSectionChange('Course-Category')}
                    active={activeSection === "Course-Category"}
                  />
                  <SidebarItem
                    icon={<IoMdSettings />}
                    label="General Settings"
                     onClick={()=> handleSectionChange("General-Settings")}
                     active={activeSection === "General-Settings"} />
                  <SidebarItem
                   label="Navigation Menu"
                    icon={<IoMdMenu />} />
                  <SidebarItem 
                  label="CMS Page"
                   icon={<FaCog />} />
                  <SidebarItem 
                  label="Gallery Category" 
                  icon={<BiSolidCategory />} />
                  <SidebarItem 
                  label="FAQ Category"
                   icon={<BiSolidCategory />} />
                  <SidebarItem 
                  icon={<BiSolidCategory />}
                  label="Professional Category" 
                  onClick={()=> handleSectionChange("Professional-Category")}
                  active={activeSection === "Professional-Category"}
                  />
                  <SidebarItem 
                  label="Location Caregory"
                   onClick={()=> handleSectionChange('Location-Caregory')}
                   active={activeSection === "Location-Caregory"}/>
                   <SidebarItem
                   label="Skills Caregory"
                   icon={<BiSolidCategory />}
                   onClick={()=> handleSectionChange("Skills-Caregory")}
                   active={activeSection === "Skills-Caregory"}
                   />
                   <SidebarItem
                   label="Career Caregory"
                   icon={<BiSolidCategory />}
                   onClick={()=> handleSectionChange('Career-Caregory')}
                   active={activeSection === "Career-Caregory"}
                   />
                   <SidebarItem 
                    label="Functional Area Caregory"
                     icon={<BiSolidCategory />}
                       onClick={()=> handleSectionChange('Functional-Area-Caregory')}
                        active={activeSection === "Functional-Area-Caregory"}
                   
                   />
                   <SidebarItem
                    label="Job Type Caregory"
                    icon={<BiSolidCategory />}
                    onClick={()=> handleSectionChange('Job-Type-Caregory')}
                        active={activeSection === "Job-Type-Caregory"}
                   
                   />
                   <SidebarItem
                    label="Job Shift Caregory"
                    icon={<BiSolidCategory />}
                    onClick={()=> handleSectionChange('Job-Shift-Caregory')}
                        active={activeSection === "Job-Shift-Caregory"}
                   
                   />
                   <SidebarItem
                    label="Degree Level Caregory"
                    icon={<BiSolidCategory />}
                    onClick={()=> handleSectionChange('Degree-Level-Caregory')}
                        active={activeSection === "Degree-Level-Caregory"}
                   
                   />


                </ul>
              )}

            </li>
            <SidebarItem
             label="Course Management"
              icon={<FaBook />} />
            <SidebarItem
             label="CA Fresher Inquiry"
              icon={<FaBook />} 
              onClick={()=> handleSectionChange("CA-Fresher-Inquiry")}/>

            
            
            
          </ul>
        </nav>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden" onClick={toggleSidebar}></div>
      )}

      <div className="flex-1 flex flex-col overflow-y-auto">

        <div className="bg-white flex items-center justify-between p-4 shadow-md sticky top-0 z-10">
          <div className="flex items-center">
            <button className="md:hidden text-xl" onClick={toggleSidebar}>
              {isOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
            </button>
            <h2 className="ml-4 text-xl font-semibold text-[#00b6bd] hidden md:block">Super Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block w-[257px]">
              <FaSearch size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input type="text" placeholder="Search..." className="border p-2 pl-9 px-2 rounded-md text-sm w-full" />
            </div>
            <button onClick={() => setShowSearch(!showSearch)} className="block md:hidden text-gray-600">
              <FiSearch size={28} />
            </button>
            {showSearch && (
              <input
                type="text"
                placeholder="Search..."
                className="block md:hidden border py-3 px-2 rounded-md text-sm absolute right-0 top-20 bg-white shadow z-20 w-full transition-all duration-300"
              />
            )}
            <div className="relative">

              <button className="flex items-center gap-2 font-semibold focus:outline-none" onClick={() => setShowProfile((prev) => !prev)}>
                {/* <img src="https://i.pravatar.cc/40" alt="Admin" className="w-10 h-10 rounded-full" /> */}
                <span className="hidden md:inline">{user?.firstName || "Admin"}</span>
              </button>
              {showProfile && (
                <div className="absolute right-6 mt-2 w-60 bg-white border rounded-md shadow-md z-10">
                  <div className="flex items-center gap-3 p-3 border-b">
                    {/* <img src="https://i.pravatar.cc/40" alt="Admin" className="w-10 h-10 rounded-full" /> */}
                    <div>
                      <p className="font-medium text-sm">{user?.firstName || "Admin"}</p>
                      <p className="text-xs text-gray-500">{user?.email || "admin@example.com"}</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                      <FaUser /> Profile
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                      <FaEnvelope /> Messages
                    </li>
                    <li
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        localStorage.removeItem("activeSection");
                        window.location.href = "/"; 
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-red-500"
                    >
                      <FaSignOutAlt /> Logout
                    </li>
                  </ul>
                </div>
              )}


            </div>
          </div>
        </div>


        {activeSection === "dashboard" && (
          <div className="pt-8 px-4">
            <div className="flex flex-wrap gap-4 justify-center">
              <StatCard title="Open Job" value="123" icon={<FaEye />} />
              <StatCard title="Followers" value="58" icon={<FaUser />} />

              <StatCard title="Messages" value="0" icon={<FaBriefcase />} />
            </div>
          </div>
        )}
        {activeSection === "Permission-List" && (
          <div>
            <PermissionsPage />
          </div>
        )}
        {activeSection === "User-List" && (
          <div>
            <UsersPage />
          </div>
        )}
        {activeSection === "Role-List" && (
          <div>
            <RolesPage />
          </div>
        )}
        {activeSection === "Course-Category" && (
          <div>
            <CourseCategory />
          </div>
        )}
        {activeSection === "General-Settings" && (
          <div>
            <GeneralSettings/>
          </div>
        )}
        {
          activeSection === "Professional-Category" && (
            <div>
              <ProfessionalCategoryPage/>
            </div>
          )
        }
        {
          activeSection === "Location-Caregory" &&(
            <div>
              <LocationForm/>
            </div>
          )
        }
        {
          activeSection === "Skills-Caregory" &&(
            <div>
              <SkillsCategoryPage/>
            </div>
          )
        }
        {activeSection === "Career-Caregory" &&(
          <div>
            <CareerCategoryPage/>
          </div>
        )}

        {activeSection === "Functional-Area-Caregory" && (
          <div>
            <FunctionalAreaCategory/>
          </div>
        )}
        {activeSection === "Job-Type-Caregory" &&(

          <div>
            <JobTypeCategoryPage/>
          </div>
        )}
        {activeSection === "Job-Shift-Caregory" && (
          <div>
            <JobShiftCategoryPage/>
          </div>
        )}
        {activeSection === "Degree-Level-Caregory" && (
          <div>
            <DegreeLevelCategoryPage/>
          </div>
        )}


        {
          activeSection === "CA-Fresher-Inquiry" && (
            <div>
              <CAFresherListPage/>
            </div>
          )
        }



      </div>
    </div>
  );
}


function SidebarItem({ icon, label, onClick, active }) {
  return (
    <li
      onClick={onClick}
      className={`px-[15px] py-[10px] flex gap-2 items-center cursor-pointer rounded 
        ${active ? "text-[#00b6bd] bg-[#f6f9ff]" : "text-gray-700"} 
        hover:text-[#00b6bd] hover:bg-[#f6f9ff]"`}
    >
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
