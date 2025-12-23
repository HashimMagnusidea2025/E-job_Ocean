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


// 2. Student Cards Marquee (now Blog Cards Marquee)

// export const StudentCardMarquee = () => {
//     const [blogs, setBlogs] = useState([]);

//     useEffect(() => {
//         const fetchBlogs = async () => {
//             try {
//                 const { data } = await axiosExternal.get("https://blog.ejobocean.com/wp-json/wp/v2/posts?_embed");
//                 setBlogs(data || []);
//             } catch (error) {
//                 console.error("Error fetching blogs:", error);
//             }
//         };
//         fetchBlogs();
//     }, []);

//     const repeatedBlogs = [...blogs, ...blogs];

//     return (
//         <div className="w-full py-10 bg-[#f9fafb]">
//             <Splide
//                 options={{
//                     type: "loop",
//                     drag: false,
//                     arrows: false,
//                     pagination: false,
//                     perPage: 3,
//                     gap: "1rem",
//                     autoScroll: {
//                         speed: -1,
//                         pauseOnHover: true,
//                         pauseOnFocus: false,
//                     },
//                 }}
//                 extensions={{ AutoScroll }}
//                 className="student-marquee"
//             >
//                 {repeatedBlogs.map((blog, index) => {
//                     const featuredImage = blog._embedded && blog._embedded['wp:featuredmedia'] && blog._embedded['wp:featuredmedia'][0] ? blog._embedded['wp:featuredmedia'][0].source_url : noImage;
//                     const authorName = blog._embedded && blog._embedded.author && blog._embedded.author[0] ? blog._embedded.author[0].name : "E-Job Ocean";

//                     return (
//                         <SplideSlide key={index} className="!w-[280px] sm:!w-[340px] py-6">
//                             <div className="px-3 h-full">
//                                 <div
//                                     className="
//         relative
//         h-[280px]
//         sm:h-[320px]
//         rounded-3xl
//         overflow-hidden
        
//         bg-black
//         group
//       "
//                                 >
//                                     {/* Background Image */}
//                                     <img
//                                         src={featuredImage}
//                                         alt={blog.title.rendered}
//                                         className="
//           absolute
//           inset-0
//           w-full
//           h-full
//           object-cover
//           scale-105
//           transition-transform
//           duration-700
//           group-hover:scale-110
//         "
//                                     />

//                                     {/* Gradient Overlay */}
//                                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

//                                     {/* Content */}
//                                     <div className="relative z-10 h-full flex flex-col justify-end p-5 text-left">
//                                         <h3
//                                             className="
//             text-white
//             text-base
//             sm:text-lg
//             font-bold
//             leading-snug
//             line-clamp-2
//           "
//                                             dangerouslySetInnerHTML={{
//                                                 __html: blog.title.rendered,
//                                             }}
//                                         />

//                                         <div className="mt-3 flex items-center justify-between text-xs sm:text-sm text-gray-300">
//                                             <span>{authorName}</span>
//                                             {/* <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur">
//                                                 Blog
//                                             </span> */}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </SplideSlide>

//                     );
//                 })}
//             </Splide>
//         </div>
//     );
// }

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
                    {[1, 2, 3,4].map((i) => (
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

    // ✅ Split webinars into categories
    const upcomingWebinars = webinars.filter((w) => w.WebinarStartDateTime >= now);
    const pastWebinars = webinars.filter((w) => w.WebinarEndDateTime < now);

    // ✅ Define available tabs dynamically
    const availableTabs = [
        { key: "all", label: "All", visible: webinars.length > 0 },
        { key: "upcoming", label: "Upcoming", visible: upcomingWebinars.length > 0 },
        { key: "past", label: "Past", visible: pastWebinars.length > 0 },
    ].filter((tab) => tab.visible); // hide empty categories

    // ✅ Filtered list based on tab
    let filteredWebinars = webinars;
    if (activeTab === "upcoming") filteredWebinars = upcomingWebinars;
    else if (activeTab === "past") filteredWebinars = pastWebinars;

    // ✅ Sort “all” list so upcoming appear first
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
        // ✅ Multiple speakers → WebinarImage
        if (webinar.Speakers && webinar.Speakers.length > 1 && webinar.WebinarImage) {
            return `${baseURL}${webinar.WebinarImage}`;
        }

        // ✅ Single speaker → Speaker profilePic
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

                {/* ✅ Dynamically show only non-empty tabs */}
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

            {/* ✅ Swiper Slider */}
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
                                <div className="h-[420px] mx-auto bg-white w-[300px] sm:w-[290px] rounded-lg shadow hover:shadow-xl transition-all overflow-hidden border border-black">
                                    <div className="h-[250px] w-full overflow-hidden">
                                        {/* <img
                                            src={
                                                webinar.Speaker?.profilePic
                                                    ? `${baseURL}/${webinar.Speaker.profilePic}`
                                                    : "/default-speaker.png"
                                            }
                                            alt={webinar.WebinarTitle}
                                            className="w-full h-full object-cover object-center"
                                        /> */}
                                        <img
                                            src={getWebinarImage(webinar)}
                                            alt={webinar.WebinarTitle}
                                            className="w-full h-full object-cover object-center"
                                        />

                                    </div>
                                    <div className="p-4 h-[120px]">
                                        <h3 className="font-bold text-md mb-2 line-clamp-2">
                                            {webinar.WebinarTitle}
                                        </h3>
                                        <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                                            <span className="flex items-center gap-1">
                                                <IoIosTime size={22} className="text-[#339ca0]" />
                                                {webinar.WebinarStartDateTime.toLocaleString()} -{" "}
                                                {webinar.WebinarEndDateTime.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold">{webinar.WebinarType}</span>

                                            <button
                                                onClick={() => navigate(`/webinars/${webinar.WebinarSlug}`)}
                                                className="bg-gradient-to-r from-[#339ca0] to-black text-white px-3 py-1 rounded text-sm transition-all hover:bg-gray-800"
                                            >
                                                Read More
                                            </button>
                                        </div>
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

















