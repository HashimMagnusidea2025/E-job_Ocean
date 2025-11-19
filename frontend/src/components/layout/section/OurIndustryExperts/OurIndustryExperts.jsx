import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import shubhangijain from '../../../../media/png/ca-shubhangi-jain.png'
import axios from '../../../../utils/axios.js';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
const baseURL = import.meta.env.VITE_BACKEND_URL;


const experts = [
    {
        name: "CA Sanat Goyal",
        experience: "10+ Years Of Experience",
        role: "Transfer Pricing Expert | Direct Taxes | FCA",
        image: shubhangijain,
        logos: [
            "https://upload.wikimedia.org/wikipedia/commons/0/0b/EY_logo_2019.svg",
        ],
    },
    {
        name: "CA Shubhangi Jain",
        experience: "10+ Years Of Experience",
        role: "Strategy and Operations Manager",
        image: shubhangijain,
        logos: [
            "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png",
            "https://upload.wikimedia.org/wikipedia/commons/1/1c/Deloitte_Logo.png",
        ],
    },
    {
        name: "CA Gaurav Malik",
        experience: "10+ Years Of Experience",
        role: "FP&A | Automation | PE Deal Management",
        image: shubhangijain,
        logos: [
            "https://upload.wikimedia.org/wikipedia/commons/0/0b/EY_logo_2019.svg",
        ],
    },
    {
        name: "CA Sameeha Mehta",
        experience: "10+ Years Of Experience",
        role: "Tax Analyst | Assistant Manager",
        image: shubhangijain,
        logos: [
            "https://upload.wikimedia.org/wikipedia/commons/e/e1/Pwc_logo.svg",
        ],
    },
    {
        name: "CA Sameeha Mehta",
        experience: "10+ Years Of Experience",
        role: "Tax Analyst | Assistant Manager",
        image: shubhangijain,
        logos: [
            "https://upload.wikimedia.org/wikipedia/commons/e/e1/Pwc_logo.svg",
        ],
    },
    {
        name: "CA Sameeha Mehta",
        experience: "10+ Years Of Experience",
        role: "Tax Analyst | Assistant Manager",
        image: shubhangijain,
        logos: [
            "https://upload.wikimedia.org/wikipedia/commons/e/e1/Pwc_logo.svg",
        ],
    },
    {
        name: "CA Sameeha Mehta",
        experience: "10+ Years Of Experience",
        role: "Tax Analyst | Assistant Manager",
        image: shubhangijain,
        logos: [
            "https://upload.wikimedia.org/wikipedia/commons/e/e1/Pwc_logo.svg",
        ],
    },
];

export default function IndustryExperts() {

    const [speakers, setSpeakers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSpeakers = async () => {
            try {
                const { data } = await axios.get("/speakers/active");
                setSpeakers(data);
                console.log("Fetched Speakers", data);

            } catch (err) {
                console.error("Error fetching speakers:", err);
            }
        }
        fetchSpeakers();
    }, [])



    return (
        <div className="bg-[#1c1c1c] text-white py-12 px-4 font-[Poppins]">
            <div className="container mx-auto flex justify-between items-center">
                <h2 className="text-[32px] font-bold mb-8">
                    Our <span className="text-[#339ca0]">Speakers</span>
                </h2>
                <h2 className="text-[22px] font-semibold mb-8 flex items-center gap-2">
                    <span>
                        View All
                    </span>
                    <span>
                        <FaArrowRightLong />
                    </span>


                </h2>


            </div>
            <Swiper spaceBetween={20}
                slidesPerView={1}
                navigation={true}
                autoplay={{
                    delay: 3000, // 3 second baad slide change hoga
                    disableOnInteraction: false, // user click kare to bhi autoplay continue rahega
                }}
                breakpoints={{
                    640: { slidesPerView: 1.2 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 },
                    1920: { slidesPerView: 5 },
                }}

                className="relative container mx-auto"
                modules={[Navigation, Autoplay]}>
                {speakers.length > 0 ? (
                    speakers.map((speaker, index) => {
                        const imageUrl = speaker.profilePic
                            ? `${baseURL}/${speaker.profilePic}`
                            : "/default-avatar.png";

                        const fullName = `${speaker.salutation ? speaker.salutation + " " : ""}${speaker.firstName} ${speaker.lastName}`;

                        return (
                            <SwiperSlide key={index}>
                                <div
                                    onClick={() => navigate(`/hall-of-fame/${speaker._id}`)}
                                    className="cursor-pointer bg-[#339ca0] text-white border border-white rounded-xl overflow-hidden text-center pb-5 relative hover:scale-105 transition-transform duration-300"
                                >
                                    <img
                                        src={imageUrl}
                                        alt={fullName}
                                        className="w-full h-[320px] object-cover"
                                    />
                                    <div className="h-[120px] p-4">
                                        <h3 className="text-lg font-bold">{fullName}</h3>
                                        <p className="text-sm mt-1">
                                            {/* {speaker.qualification || "N/A"} */}
                                        </p>
                                        <p className="text-sm line-clamp-2">
                                            {speaker.description || "No expertise mentioned"}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-300">Loading speakers...</p>
                )}
            </Swiper>
        </div>
    );
}
