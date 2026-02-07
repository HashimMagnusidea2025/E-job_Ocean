import { useState, useEffect } from 'react';

import logo from '../../media/logo/ejob_ocean.png';
import profile from '../../media/logo/ejob_ocean.png';
import linkedInIcon from '../../media/logo/in.png';
import { IoIosTimer } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { IoIosTime } from "react-icons/io";
import { Navigation } from "swiper/modules";
import { FaTimes } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/react-splide/css";
import axios from '../../utils/axios.js'
import axiosExternal from "axios";
import { useNavigate } from "react-router-dom";
import noImage from '../../media/png/no.png';


const baseURL = import.meta.env.VITE_BACKEND_URL; // Vite
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



export const StudentCardMarquee = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data } = await axiosExternal.get(
                    "https://blog.ejobocean.com/wp-json/wp/v2/posts?_embed"
                );
                setBlogs(data || []);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    /* 🔴 LOADER UI */
    if (loading) {
        return (
            <div className="w-full py-16 flex justify-center items-center bg-[#f9fafb]">
                <div className="flex gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="
                                w-[280px]
                                sm:w-[340px]
                                h-[320px]
                                rounded-3xl
                                bg-gray-200
                                animate-pulse
                            "
                        />
                    ))}
                </div>
            </div>
        );
    }

    const repeatedBlogs = [...blogs, ...blogs];

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
            >
                {repeatedBlogs.map((blog, index) => {
                    const featuredImage =
                        blog._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                        noImage;

                    const authorName =
                        blog._embedded?.author?.[0]?.name || "E-Job Ocean";

                    return (
                        <SplideSlide key={index} className="!w-[280px] sm:!w-[340px] py-6">
                            <Link to={`/blogs/${blog.slug}`}>
                                <div className="px-3 h-full">
                                    <div className="relative h-[280px] sm:h-[320px] rounded-3xl overflow-hidden bg-black group">
                                        <img
                                            src={featuredImage}
                                            alt={blog.title.rendered}
                                            className="absolute inset-0 w-full h-full object-cover scale-105"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                        <div className="relative z-10 h-full flex flex-col justify-end p-5">
                                            <h3
                                                className="text-white text-base sm:text-lg font-bold leading-snug line-clamp-2"
                                                dangerouslySetInnerHTML={{
                                                    __html: blog.title.rendered,
                                                }}
                                            />

                                            <div className="mt-3 text-xs sm:text-sm text-gray-300">
                                                {authorName}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </SplideSlide>
                    );
                })}
            </Splide>
        </div>
    );
};



import banner1 from "../../media/png/MASTERCLASS.png";
import banner2 from "../../media/png/MASTERCLASS.png";
import banner3 from "../../media/png/MASTERCLASS.png";
import banner4 from "../../media/png/MASTERCLASS.png";



export const OurCourses = () => {
    const [webinars, setWebinars] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWebinars = async () => {
            try {
                const { data } = await axios.get("/webinars/active");
                const validData = data.map((w) => ({
                    ...w,
                    WebinarStartDateTime: new Date(w.WebinarStartDateTime),
                    WebinarEndDateTime: new Date(w.WebinarEndDateTime),
                }));
                setWebinars(validData);
            } catch (err) {
                console.error("Error fetching webinars:", err);
            }
        };
        fetchWebinars();
    }, []);

    const now = new Date();

    //  Split webinars into categories
    const upcomingWebinars = webinars.filter((w) => w.WebinarStartDateTime >= now);
    const pastWebinars = webinars.filter((w) => w.WebinarEndDateTime < now);

    //  Define available tabs dynamically
    const availableTabs = [
        { key: "all", label: "All", visible: webinars.length > 0 },
        { key: "upcoming", label: "Upcoming", visible: upcomingWebinars.length > 0 },
        { key: "past", label: "Past", visible: pastWebinars.length > 0 },
    ].filter((tab) => tab.visible); // hide empty categories

    //  Filtered list based on tab
    let filteredWebinars = webinars;
    if (activeTab === "upcoming") filteredWebinars = upcomingWebinars;
    else if (activeTab === "past") filteredWebinars = pastWebinars;

    //  Sort “all” list so upcoming appear first
    if (activeTab === "all") {
        filteredWebinars.sort((a, b) => {
            const aEnd = new Date(a.WebinarEndDateTime);
            const bEnd = new Date(b.WebinarEndDateTime);
            const aUpcoming = aEnd >= now;
            const bUpcoming = bEnd >= now;
            if (aUpcoming && !bUpcoming) return -1;
            if (!aUpcoming && bUpcoming) return 1;
            return new Date(a.WebinarStartDateTime) - new Date(b.WebinarStartDateTime);
        });
    }


    const getWebinarImage = (webinar) => {
        //  Multiple speakers → WebinarImage
        if (webinar.Speakers && webinar.Speakers.length > 1 && webinar.WebinarImage) {
            return `${baseURL}${webinar.WebinarImage}`;
        }

        //  Single speaker → Speaker profilePic
        if (
            webinar.Speakers &&
            webinar.Speakers.length === 1 &&
            webinar.Speakers[0].profilePic
        ) {
            return `${baseURL}/${webinar.Speakers[0].profilePic}`;
        }

    };
    return (
        <div className="py-12 px-4 bg-white font-[Poppins] container mx-auto">
            <div className="container mx-auto">
                <div className="flex justify-center items-center">
                    <h2 className="text-[40px] font-bold mb-6 px-5">
                        <span className="text-[#339ca0]">Webinars</span>
                    </h2>
                </div>

                {/*  Dynamically show only non-empty tabs */}
                <div className="flex justify-center flex-wrap gap-4 mb-8 px-5">
                    {availableTabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2 rounded-full font-medium transition-all border ${activeTab === tab.key
                                ? "bg-[#339ca0] text-white border-[#339ca0]"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/*  Swiper Slider */}
            <Swiper
                className="max-w-[1920px]"
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
                {filteredWebinars.length > 0 ? (
                    filteredWebinars.map((webinar, index) => (
                        <SwiperSlide key={index}>
                            <Link to={`/webinars/${webinar.WebinarSlug}`}>
                                <div className="group relative h-[430px] mx-auto w-[300px] sm:w-[290px] rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300">

                                    {/* IMAGE */}
                                    <div className="relative h-[240px] overflow-hidden">
                                        <img
                                            src={getWebinarImage(webinar)}
                                            alt={webinar.WebinarTitle}
                                            className="w-full h-full object-cover transition-transform duration-500 "
                                        />

                                        {/* IMAGE OVERLAY */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                                        {/* TYPE BADGE */}
                                        <span className="absolute top-4 right-4 bg-[#339ca0] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                                            {webinar.WebinarType}
                                        </span>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-4 flex flex-col justify-between h-[190px]">

                                        <h3 className="font-bold text-[15px] text-gray-900 leading-snug line-clamp-2">
                                            {webinar.WebinarTitle}
                                        </h3>

                                        {/* TIME */}
                                        <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">
                                            <IoIosTime size={18} className="text-[#339ca0] mt-[2px]" />
                                            <span className="leading-tight">
                                                {webinar.WebinarStartDateTime.toLocaleString()}
                                                <br />
                                                {webinar.WebinarEndDateTime.toLocaleString()}
                                            </span>
                                        </div>

                                        {/* BUTTON */}
                                        <button
                                            onClick={() => navigate(`/webinars/${webinar.WebinarSlug}`)}
                                            className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-[#339ca0] to-[#1d1d1d] text-white text-sm font-semibold tracking-wide hover:opacity-90 transition-all"
                                        >
                                            Read More →
                                        </button>

                                    </div>
                                </div>

                            </Link>
                        </SwiperSlide>
                    ))
                ) : (
                    <div className="w-full flex justify-center items-center py-20">
                        <p className="text-gray-500 text-4xl font-medium italic">🎉 Coming Soon!</p>
                    </div>
                )}
            </Swiper>

            <div className="flex justify-center mt-6">
                <button
                    onClick={() => navigate("/webinars")}
                    className="bg-gradient-to-r from-[#339ca0] to-black text-white px-4 py-2 rounded hover:bg-gray-800 transition font-medium"
                >
                    View All Webinars
                </button>
            </div>
        </div>
    );
};

// OurFreeCoursesCrds

export const OurFreeCoursesCrds = ({ id, image, title, companyname, date, createdAt, experience, mode }) => {
    const formatDate = (isoDate) => {
        if (!isoDate) return "N/A";
        const date = new Date(isoDate);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };
    const timeAgo = (dateString) => {
        if (!dateString) return "";

        const now = new Date();
        const past = new Date(dateString);
        const diffInSeconds = Math.floor((now - past) / 1000);

        const minutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (diffInSeconds < 60) return "Just now";
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        return `${days} day${days > 1 ? "s" : ""} ago`;
    };

    const navigate = useNavigate();

    return (
        <div className="mx-auto w-[300px] min-h-[370px] bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col relative group">

            {/* Decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#339ca0]/20 to-transparent rounded-bl-full" />

            {/* Logo */}
            
            <div className="p-6 flex justify-center">
                <div className="w-20 h-20 rounded-2xl bg-white border shadow-sm flex items-center justify-center p-3">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="px-6 pb-6 flex flex-col flex-1">

                {/* Title – fixed height */}
                <h3 className="font-bold text-lg text-center text-gray-900 line-clamp-2 min-h-[52px]">
                    {title}
                </h3>

                {/* Company */}
                <div className="flex justify-center mt-3 min-h-[32px]">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 truncate max-w-[200px]">
                        🏢 {companyname}
                    </span>
                </div>

                {/* Tags Section – fixed height */}
                <div className="flex flex-wrap justify-center gap-2 mt-4 min-h-[30px]">
                    {experience && (
                        <span className="px-3 py-1 text-xs font-medium bg-blue-50  rounded-full">
                            💼 {experience} Years
                        </span>
                    )}

                    {mode && (
                        <span className="px-3 py-1 text-xs font-medium bg-purple-50  rounded-full">
                            🏢 {mode}
                        </span>
                    )}

                    {/* {createdAt && (
                        <span className="px-3 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full">
                            ⏱ {timeAgo(createdAt)}
                        </span>
                    )} */}
                </div>

                {/* PUSH BUTTON TO BOTTOM */}
                <div className="mt-auto">

                    {date && (
                        <div className="flex items-center gap-2 mb-4 text-sm text-gray-700">
                            <svg
                                className="w-5 h-5 text-[#339ca0]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            {formatDate(date)}
                        </div>
                    )}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/job-details/${id}`);
                        }}
                        className="w-full bg-gradient-to-r from-[#339ca0] via-[#2a8c91] to-black text-white py-3 rounded-xl font-semibold text-sm hover:scale-[1.02] transition-all"
                    >
                        View & Apply
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

















