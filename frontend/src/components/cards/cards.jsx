import { useState,useEffect  } from 'react';

import logo from '../../media/logo/ejob_ocean.png';
import profile from '../../media/logo/ejob_ocean.png';
import linkedInIcon from '../../media/logo/in.png';

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import { FaTimes } from "react-icons/fa";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/react-splide/css";
import axios from '../../utils/axios.js'



// 🔹 1. Partner Logo Marquee


export const MarqueeTagCards = () => {
  const [companies, setCompanies] = useState([]);
  const baseURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await axios.get("/Company-Information"); // ✅ fetch all
        setCompanies(data?.data || []);
      } catch (error) {
        console.error("Error fetching company info:", error);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="bg-[#f9fafb]">
      <div className="overflow-hidden w-full py-8 sm:py-10">
        <Splide
          options={{
            type: "loop",
            drag: false,
            arrows: false,
            pagination: false,
            perPage: 8,
            gap: "1rem",
            autoScroll: {
              speed: 1,
              pauseOnHover: true,
              pauseOnFocus: false,
            },
            breakpoints: {
              640: { perPage: 4 },
            },
          }}
          extensions={{ AutoScroll }}
        >
          {companies.length > 0 ? (
            companies.map((company, index) => {
              const logoPath = company.company?.hiringcompanies;
              const website = company.company?.website;

              if (!logoPath) return null; // skip companies without a logo

              return (
                <SplideSlide key={index}>
                  <a
                    href={website || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={`${baseURL}${logoPath}`}
                      alt={company.company?.name || "Company"}
                      className="h-20 sm:h-24 w-24 bg-[#EDF1F9] p-4 sm:p-6 rounded-lg shadow hover:shadow-xl transition-all duration-300 hover:scale-105"
                    />
                  </a>
                </SplideSlide>
              );
            })
          ) : (
            <div className="text-center text-gray-500 w-full py-6">
              No company logos available
            </div>
          )}
        </Splide>
      </div>
    </div>
  );
};


// 2. Student Cards Marquee
const students = [
    {
        name: "Sanchita Agarwal",
        course: "GST MasterClass",
        company: "KPMG",
    },
    {
        name: "Som Khandelwal",
        course: "Audit Masterclass",
        company: "CRISIL",
    },
    {
        name: "Aditi Khaitan",
        course: "Audit MasterClass",
        company: "Grant Thornton",
    },
];



export const StudentCardMarquee = () => {
    const repeatedStudents = [...students, ...students];

    return (
        <div className="w-full py-10 bg-[#f9fafb]">
            <Splide
                options={{
                    type: "loop",
                    drag: false,
                    arrows: false,
                    pagination: false,
                    perPage: 3,
                    gap: "1rem",
                    autoScroll: {
                        speed: -1,
                        pauseOnHover: true,
                        pauseOnFocus: false,
                    },
                }}
                extensions={{ AutoScroll }}
                className="student-marquee"
            >
                {repeatedStudents.map((student, index) => (
                    <SplideSlide key={index} className="!w-[300px] py-2">
                        <div className="relative pt-14 px-2">
                            <div className="bg-white min-w-[280px] max-w-[280px] mx-auto rounded-xl shadow-md p-7 text-center relative">

                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <img
                                        src={profile}
                                        alt={student.name}
                                        className="w-[70px] h-[70px] rounded-full object-cover border-4 border-white shadow"
                                    />
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold flex justify-center items-center gap-1">
                                        {student.name}
                                        <img src={linkedInIcon} alt="LinkedIn" className="w-4 h-4" />
                                    </h3>
                                    <hr className="my-2 border-gray-200" />
                                    <p className="text-sm text-gray-600 mb-1">Course enrolled in</p>
                                    <p className="text-[#339ca0] font-semibold mb-1">{student.course}</p>
                                    <p className="text-sm text-gray-700">{student.company}</p>
                                </div>
                            </div>
                        </div>
                    </SplideSlide>

                ))}
            </Splide>
        </div>
    );
}






import banner1 from "../../media/png/MASTERCLASS.png";
import banner2 from "../../media/png/MASTERCLASS.png";
import banner3 from "../../media/png/MASTERCLASS.png";
import banner4 from "../../media/png/MASTERCLASS.png";

const tabs = [
    "Flagship MasterClasses",
    "Finance Tools",
    "Interview Preparation & Soft Skills",
    "Combos Courses",
    "Free Courses",
];

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
        image: banner2,
        trainer: "CA Rakshit Mittal",
        hours: "20+ Hrs",
        price: "₹3499/-",

    },
    {
        title: "AI & ChatGPT For Finance MasterClass",
        image: banner3,
        trainer: "Inderjeet & Archit",
        hours: "20+ Hrs",
        price: "₹2499/-",

    },
    {
        title: "Audit Master Class",
        image: banner4,
        trainer: "CA Archit Agarwal",
        hours: "30+ Hrs",
        price: "₹3499/-",

    },
    {
        title: "Audit Master Class",
        image: banner4,
        trainer: "CA Archit Agarwal",
        hours: "30+ Hrs",
        price: "₹3499/-",

    },
];

export const OurCourses = () => {
    return (
        <div className="py-12 px-4 bg-white font-[Poppins]">
            <div className="container mx-auto">
                <div className='flex justify-center items-center'>
                    <h2 className="text-[40px] font-bold mb-6 px-5">
                        Our <span className="text-[#339ca0]">Courses</span>
                    </h2>
                </div>

                <div className="flex justify-center flex-wrap gap-4 mb-8 px-5">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            className={`tab-btn border px-4 py-2 rounded-full text-sm font-medium transition 
                                ? "bg-slate-900 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Swiper */}
            </div>
            <Swiper className='max-w-[1920px]'
                spaceBetween={30}
                slidesPerView={1}
                navigation={true}
                breakpoints={{
                    640: { slidesPerView: 1.2 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 },
                    1920: { slidesPerView: 5 },
                }}
                modules={[Navigation]}
            >
                {courses.map((course, index) => (
                    <SwiperSlide key={index} >
                        <div className="h-[330px] mx-auto bg-white w-[300px] sm:w-[310px] rounded-lg shadow hover:shadow-xl  transition-all overflow-hidden border border-black">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-50 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-bold text-md mb-2">{course.title}</h3>
                                <p className="text-xs text-gray-600 mb-1">
                                    BY {course.trainer.toUpperCase()}
                                </p>
                                <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                                    <span className="flex items-center gap-1">
                                        <span>⏱</span>
                                        {course.hours}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">{course.price}</span>
                                    <button className="bg-gradient-to-r from-[#339ca0] to-black text-white px-3 py-1 rounded text-sm  transition-all hover:bg-gray-800">
                                        Learn More
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="flex justify-center mt-6">
                <button className=" bg-gradient-to-r from-[#339ca0] to-black text-white px-4 py-2 rounded hover:bg-gray-800 transition font-medium">
                    View All Courses
                </button>
            </div>
        </div>
    );
};


export const OurFreeCoursesCrds = ({ image, title, trainer }) => {
    return (
        <div className="mx-auto h-[330px] bg-white w-[300px] sm:w-[310px] rounded-lg shadow hover:shadow-xl transition-all overflow-hidden border border-black">
            <img
                src={image}
                alt={title}
                className="w-full h-50 object-cover"
            />

            <div className="p-4">
                <h3 className="font-bold text-md mb-2">{title}</h3>
                <hr className="border-t border-gray-300 my-3" />
                <p className="text-xs text-gray-600 mb-1">
                    BY {trainer.toUpperCase()}
                </p>

                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Free</span>
                    <button className="bg-gradient-to-r from-[#339ca0] to-black text-white px-3 py-1 rounded text-sm transition-all hover:bg-gray-800">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
};






export default function MasterclassCard({ title, instructor, price, image }) {
    return (
        <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-all p-3 w-full max-w-xs">
            <div className="rounded-md overflow-hidden mb-3">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-40 object-cover"
                />
            </div>

            <h3 className="text-[15px] font-semibold leading-snug mb-1">{title}</h3>
            <p className="text-sm text-gray-500 mb-2">{instructor}</p>
            <p className="text-[15px] font-semibold text-[#f59e0b]">{price}</p>
        </div>
    );
}






export const CartView = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg font-[Poppins] relative">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-black"
                >
                    <FaTimes className="text-xl" />
                </button>


                <div className="text-black flex justify-between items-center border-b pb-3 mt-3">
                    <span className="text-2xl font-semibold flex items-center gap-2">
                        Cart (1 Item)
                    </span>
                </div>

                <div className="flex justify-between items-start py-4 border-b">
                    <div className="flex items-start gap-3">
                        <div>
                            <h3 className="text-black font-semibold text-sm sm:text-base">
                                Big 4 MasterClass for College Students
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                OTP | Till 120 days or Max Viewing Time 75 hours
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">₹1,999</p>
                        <p className="text-xs text-gray-500">incl. 18% GST</p>

                    </div>
                </div>

                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                    <p className="italic">
                        Note: Promo Codes can be applied after checkout
                    </p>
                    <p className="text-black font-semibold">
                        Total Amount : <span className="text-[#339ca0]">₹1999.00</span>
                    </p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button className="text-[#339ca0] font-semibold">Add More</button>
                    <button className="bg-gradient-to-r from-[#339ca0] to-black text-white px-5 py-2 rounded">
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};


// components/WebinarCard.jsx



export const ActiveCoursesCard = ({ image, tag, title, date, isUpcoming }) => {
    const status = isUpcoming ? "Upcoming" : "Recorded";

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative">
                <img src={image} alt={title} className="w-full h-52 object-cover" />
                {tag && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                        {tag}
                    </span>
                )}
                <span
                    className={`absolute bottom-2 left-2 text-white text-xs px-3 py-1 rounded ${isUpcoming
                        ? "bg-[#101828]"
                        : "bg-[#667085] opacity-90"
                        }`}
                >
                    {status}
                </span>
            </div>
            <div className="p-4">
                <h3 className="text-base font-semibold text-black mb-2">{title}</h3>
                <div className="text-sm text-gray-600 flex items-center gap-2 mb-2">

                    <span>{date}</span>
                </div>
                <p className="text-sm font-semibold text-black">Free</p>
            </div>
        </div>
    );
};

















