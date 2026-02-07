import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaFile, FaPrint, FaHeart, FaBullhorn, FaUser,
  FaPencilAlt, FaEye, FaDesktop, FaEnvelope, FaSignOutAlt, FaHome,
  FaUserAlt, FaCog, FaBuilding, FaList, FaArrowDown, FaArrowUp,
  FaAngleUp
} from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { CiBoxList } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { IoMdMenu, IoMdSettings } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import { FaBriefcase } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
const Sidebar = ({ isOpen, onSidebarToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.roleID?.name;

  //  object state for multiple open menus
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleAddWebinarClick = () => {
    // Redirect to backend Google OAuth route
    window.location.href = "http://localhost:8000/google/auth?redirect=/admin-dashboard/add-webinar";
  };

  const handleLinkClick = (path, keepOpen = false) => {
    if (isMobile && !keepOpen) {
      onSidebarToggle();
    }
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // sessionStorage.removeItem("role");
    localStorage.removeItem("role");

    navigate("/");
  };

  // Seeker Menu
  const SeekerItems = [
    { path: "/", icon: <FaHome />, label: "Home" },
    { path: "/seeker-dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/seeker-dashboard/my-profile", icon: <FaPencilAlt />, label: "Edit Profile" },
    { path: "/seeker-dashboard/my-webinars", icon: <FaVideo />, label: "My Webinars" },
    { path: "/seeker-dashboard/my-one-to-one-sessions", icon: <FaUserFriends />, label: "My One To One Sessions" },
    { path: "/seeker-dashboard/my-courses", icon: <FaBookOpen />, label: "My Courses" },
    { path: "/seeker-dashboard/build-resume", icon: <FaFile />, label: "Build Resume" },
    { path: "/seeker-dashboard/resume", icon: <FaPrint />, label: "Download CV" },
    { path: "/seeker-dashboard/view-Public-Profile", icon: <FaEye />, label: "View Public Profile" },
    { path: "/seeker-dashboard/my-job-applications", icon: <FaDesktop />, label: "My Job Applications" },
    { path: "/seeker-dashboard/my-favourite-jobs", icon: <FaHeart />, label: "My Favourite Jobs" },
    { path: "/seeker-dashboard/my-alerts", icon: <FaBullhorn />, label: "My Job Alerts" },

    { icon: <FaSignOutAlt />, label: "Logout", onClick: handleLogout }
  ];

  // Employer Menu
  const EmployerItems = [

    { path: "/", icon: <FaHome />, label: "Home" },
    { path: "/employer-dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/employer-dashboard/edit/company-profile", icon: <FaPencilAlt />, label: "Edit Account Details" },
    { path: "/employer-dashboard/company-profile", icon: <FaFile />, label: "Company Public Profile" },
    { path: "/employer-dashboard/post-job", icon: <FaPrint />, label: "Post A Job" },
    { path: "/employer-dashboard/posted-jobs", icon: <FaEye />, label: "Manage Jobs" },
    // { path: "/employer-dashboard/job-candidates/:jobId", icon: <CiBoxList  />, label: "Candidates-Register" },

    // { path: "/employer-dashboard/company-packages", icon: <FaDesktop />, label: "CV Search Packages" },
    // { path: "/employer-dashboard/list-payment-history", icon: <RiMoneyDollarCircleLine />, label: "Payment History" },
    // { path: "/employer-dashboard/unloced-seekers", icon: <FaBullhorn />, label: "Unlocked Users" },


    { icon: <FaSignOutAlt />, label: "Logout", onClick: handleLogout }

  ];

  const MentorItems = [
    { path: "/", icon: <FaHome />, label: "Home" },
    { path: "/mentor-dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/mentor-dashboard/edit-mentor-details", icon: <FaUser />, label: "Edit Mentor Details" },
    { path: "/mentor-dashboard/add-mentor-session", icon: <FaUser />, label: "Add Mentor Session" },
    { path: "/mentor-dashboard/mentor-session-list", icon: <FaUser />, label: "Mentor Session List" },


  ]

  // Admin Menu (nested children)
  const AdminItems = [
    { path: "/", icon: <FaHome />, label: "Home" },
    { path: "/admin-dash", icon: <FaHome />, label: "Dashboard" },
    { path: "/admin-dashboard/ca-fresher-list", label: "CA Fresher List", icon: <GoDotFill size={12} className="dot" /> },
    { path: "/admin-dashboard/upload-cv-list", label: "Upload Cv List", icon: <GoDotFill size={12} className="dot" /> },

    {
      icon: <FaUser />, label: "Become-A-Mentor",
      children: [

        {
          path: "/admin/become-a-mentor-registerList", icon: <GoDotFill size={12} className="dot" />,
          label: "Mentor-RegisterList"
        },

      ]
    },
    {
      icon: <FaBriefcase />, label: "Job Post ",
      children: [

        {
          path: "/admin-dashboard/job-post", icon: <GoDotFill size={12} className="dot" />,
          label: " Add Job Post"
        },
        {
          path: "/admin-dashboard/job-post-list", icon: <GoDotFill size={12} className="dot" />,
          label: "Job Post List"
        },


      ]
    },
    {
      icon: <FaBook />, label: "Knowledge Base ",
      children: [

        {
          path: "/admin-dashboard/knowledge-baseform", icon: <GoDotFill size={12} className="dot" />,
          label: " Add Knowledge Base"
        },
        {
          path: "/admin-dashboard/knowledge-base-list", icon: <GoDotFill size={12} className="dot" />,
          label: "Knowledge Base List"
        },
        {
          path: "/admin/knowledge-base-registers", icon: <GoDotFill size={12} className="dot" />,
          label: "Knowledge Base register List"
        },


      ]
    },
    {
      icon: <FaClipboardList />, label: " Registrations List",
      children: [



        {
          path: "/admin-dashboard/job-register-list", icon: <GoDotFill size={12} className="dot" />,
          label: "Job Registration list"
        },
        {
          path: "/admin-dashboard/webinar-registration-list", icon: <GoDotFill size={12} className="dot" />,
          label: "Webinar Registration List"
        },
        {
          path: "/admin-dashboard/one-to-one-registration-list", icon: <GoDotFill size={12} className="dot" />,
          label: "One To One Registration"
        },
        {
          path: "/admin-dashboard/contact-list", icon: <GoDotFill size={12} className="dot" />,
          label: "contact Us list"
        },

      ]
    },

    {
      icon: <FaUserTie />, label: "Speakers",
      children: [

        {
          path: "/admin-dashboard/add-speakers", icon: <GoDotFill size={12} className="dot" />,
          label: " Add Speakers"
        },
        {
          path: "/admin-dashboard/add-one-to-one", icon: <GoDotFill size={12} className="dot" />,
          label: " Add One To One"
        },
        {
          path: "/admin-dashboard/one-to-one-list", icon: <GoDotFill size={12} className="dot" />,
          label: "One To One List"
        },

      ]
    },
    {
      icon: <FaVideo />, label: "Webinars",
      children: [

        {
          path: "/admin-dashboard/add-webinar", icon: <GoDotFill size={12} className="dot" />,
          label: " Add Webinars"
        },

      ]
    },
    {
      icon: <FaUser />, label: "User Management",
      children: [
        {
          path: "/admin-dashboard/user-list", icon: <GoDotFill size={12} className="dot" />,
          label: "User List"
        },
        {
          path: "/admin-dashboard/role-list", icon: <GoDotFill size={12} className="dot" />,
          label: "Role List"
        },
        {
          path: "/admin-dashboard/permission-list", icon: <GoDotFill size={12} className=" dot" />,
          label: "Permission List"
        },
      ]
    },

    {
      icon: <FaBuilding />, label: "Company Registration",

      children: [
        { path: '/admin-dashboard/create-company', icon: <GoDotFill size={12} className=" dot" />, label: "Company List" },


      ]
    },

    {
      icon: <FaBookOpen />, label: "Course Management",

      children: [
        { path: '/admin-dashboard/course', icon: <GoDotFill size={12} className=" dot" />, label: "Course List" },


      ]
    },
    { path: "/admin-dashboard/our-founders", label: "Our Founders", icon: <GoDotFill size={12} className="dot" /> },
    { path: "/admin-dashboard/meet-our-team", label: "Meet Our Team", icon: <GoDotFill size={12} className="dot" /> },

    {
      icon: <IoMdSettings />, label: "Master Settings",
      children: [
        {
          path: "/admin-dashboard/social-media", icon: <GoDotFill size={12} className=" dot" />,
          label: "Social Media"
        },
        {
          path: "/admin-dashboard/company-category", icon: <GoDotFill size={12} className=" dot" />,
          label: "Company Category"
        },
        {
          path: "/admin-dashboard/ownership-category", icon: <GoDotFill size={12} className=" dot" />,
          label: "Ownership Category"
        },
        { path: "/admin-dashboard/no-of-office-category", icon: <GoDotFill size={12} className=" dot" />, label: "No of Office Category" },
        { path: "/admin-dashboard/no-of-employees-category", icon: <GoDotFill size={12} className=" dot" />, label: "No of Employees Category" },
        { path: "/admin-dashboard/established-in-category", icon: <GoDotFill size={12} className=" dot" />, label: "Established In Category" },

        {
          path: "/admin-dashboard/course-category", icon: <GoDotFill size={12} className=" dot" />,
          label: "Course Category"
        },
        {
          path: "/admin-dashboard/general-settings", icon: <GoDotFill size={12} className=" dot" />,
          label: "General Settings"
        },
        {
          path: "/admin-dashboard/navigation-menu", icon: <GoDotFill size={12} className=" dot" />,
          label: "Navigation Menu"
        },
        {
          path: "/admin-dashboard/cms-page", icon: <GoDotFill size={12} className=" dot" />,
          label: "CMS Page Category"
        },
        {
          path: "/admin-dashboard/gallery-category", icon: <GoDotFill size={12} className=" dot" />,
          label: "Gallery Category"
        },
        {
          path: "/admin-dashboard/FAQ-category", icon: <GoDotFill size={12} className=" dot" />,
          label: "FAQ Category"
        },
        { path: "/admin-dashboard/proffessional-category", icon: <GoDotFill size={12} className=" dot" />, label: "Professional Category" },
        {
          path: "/admin-dashboard/location-category", icon: <GoDotFill size={12} className=" dot" />,
          label: "Location Category"
        },
        {
          path: "/admin-dashboard/skills-category", icon: <GoDotFill size={12} className=" dot" />,
          label: "Skills Category"
        },
        { path: "/admin-dashboard/career-level-category", icon: <GoDotFill size={12} className=" dot" />, label: "Career Level Category" },
        { path: "/admin-dashboard/functional-area-category", icon: <GoDotFill size={12} className=" dot" />, label: "Functional Area Category" },
        {
          path: "/admin-dashboard/job-type-category", icon: <GoDotFill size={12} className=" dot" />,
          label: "Job Type Category"
        },
        {
          path: "/admin-dashboard/job-shift-category", icon: <GoDotFill size={12} className=" dot" />,
          label: "Job Shift Category"
        },
        {
          path: "/admin-dashboard/degree-level-category", icon: <GoDotFill size={12} className=" dot" />, label: "Degree Level Category"
        },

        {
          path: "/admin-dashboard/degree-type-category", icon: <GoDotFill size={12} className=" dot" />, label: "Degree Type Category"
        },




      ]
    },

    { icon: <FaSignOutAlt />, label: "Logout", onClick: handleLogout }
  ];

  let menuItems = [];
  if (role === "superadmin") menuItems = AdminItems;
  else if (role === "employer") menuItems = EmployerItems;
  else if (role === "seeker") menuItems = SeekerItems;
  else if (role === "mentor") menuItems = MentorItems

  // auto open menus if child path matches210
  useEffect(() => {
    const openParents = (items) => {
      items.forEach(item => {
        if (item.children) {
          if (item.children.some(child => child.path === location.pathname)) {
            setOpenMenus(prev => ({ ...prev, [item.label]: true }));
          }
          openParents(item.children);
        }
      });
    };
    openParents(menuItems);
  }, [location.pathname]);

  // Recursive menu renderer
  const renderMenu = (items, parent = null) =>
    items.map((item, index) => {
      const isActive = item.path && location.pathname === item.path;
      const isOpen = openMenus[item.label];

      if (item.children) {
        return (
          <li key={index} className="rounded-lg">
            <button
              onClick={() => toggleMenu(item.label)}
              className={`flex items-center justify-between gap-3 p-2 w-full rounded-lg text-left 
                ${isOpen ? "sidebg side text-black" : "side hover:text-black"}`}
            >
              <span className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </span>
              {isOpen ? <FaAngleUp size={20} /> : <FaAngleDown size={20} />}
            </button>

            {isOpen && (
              <ul className="ml-7 mt-1 space-y-1">
                {renderMenu(item.children, item.label)}
              </ul>
            )}
          </li>
        );
      }

      return (
        <li
          key={index}
          className={`${isActive ? "sidebg side text-black" : " side hover:text-black"} rounded-lg `}
        >
          <button
            onClick={() => {
              if (item.onClick) item.onClick();
              else handleLinkClick(item.path, !!parent);
            }}
            className="flex items-center gap-3 p-2 rounded-lg w-full text-left"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        </li>
      );
    });

  return (
    <aside
      className={`bg-white text-black font-semibold h-screen fixed top-16 left-0 overflow-y-auto w-[290px] transform transition-transform duration-300 z-40
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-700">Dashboard Menu</h2>
      </div>

      <ul className="p-4 space-y-2">
        {renderMenu(menuItems)}
      </ul>
    </aside>
  );
};

export default Sidebar;
