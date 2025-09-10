import Layout from "./partials/layout";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import caarchitaggarwal from "../../media/png/ca-archit-aggarwal.png";


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
  return (
    <Layout>
      <div className="flex font-[Poppins] ">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="md:p-4 p-0">
            <div className="space-y-10">

              {/* Welcome Card */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-semibold text-center">Welcome to Seeker Dashboard</h2>
              </div>

              {/* Stats Cards */}
              <div className="flex flex-wrap gap-6 justify-center">
                <StatCard title="Profile View" value="123" icon={<FaEye />} />
                <StatCard title="Followings" value="58" icon={<FaUser />} />
                <StatCard title="My CV List" value="1" icon={<FaBriefcase />} />
                <StatCard title="Messages" value="0" icon={<FaBriefcase />} />
              </div>

              {/* Profile Section */}
              <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                  <img
                    src={caarchitaggarwal}
                    className="w-28 h-28 md:w-44 md:h-44 rounded-full border-4 border-[#2167ac] object-cover"
                    alt="profile"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-[#2167ac]">Job Seeker</h2>
                    <p className="text-gray-600 flex items-center gap-2 justify-center md:justify-start">
                      <FaMapMarkerAlt /> Bagaha, Bihar, India
                    </p>
                    <p className="text-gray-600 flex items-center gap-2 justify-center md:justify-start">
                      <FaPhoneAlt /> +1234567890
                    </p>
                    <p className="text-gray-600 flex items-center gap-2 justify-center md:justify-start">
                      <FaEnvelope /> seeker@jobsportal.com
                    </p>
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
