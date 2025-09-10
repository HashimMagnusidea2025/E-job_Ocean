import { FaQuoteLeft, FaQuoteRight, FaPlayCircle } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import MamtaJangra from '../../../../media/jpg/MamtaJangra.jpg';

const testimonials = [
    {
        name: "Gursaheb Singh",
        image: MamtaJangra,
        text: "eJob Ocean helped me to master the important formulas of excel and their practical implications. The course help me to revise whole concepts in very less hours.",
        company: "KPMG",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/KPMG_logo.svg",
    },
    {
        name: "Mansi Gupta",
        image: MamtaJangra,
        text: "I would like to thanks Archit Sir for taking this initiative of providing insightful & practical courses. I was able to take practical exposure of audit and able to clear my interview at EY.",
        company: "EY",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/EY_logo_2019.svg",
    },
    {
        name: "Mayank Sharma",
        image: MamtaJangra,
        text: "This course gave me immense practical insights. It not only helped me in getting an edge in interview but also helped in dealing with case based & practical questions.",
        company: "KPMG",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/KPMG_logo.svg",
    },
    {
        name: "Anjali Verma",
        image: MamtaJangra,
        text: "One of the best online platforms to learn Excel and Audit practically. The sessions were short, crisp and packed with real-world examples.",
        company: "PwC",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/PwC_Logo.svg",
    },
    {
        name: "Anjali Verma",
        image: MamtaJangra,
        text: "One of the best online platforms to learn Excel and Audit practically. The sessions were short, crisp and packed with real-world examples.",
        company: "PwC",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/PwC_Logo.svg",
    },
];

export default function Testimonials() {
    return (
        <div className="w-full bg-white py-12 px-4 font-[Poppins]">
            <div className="max-w-[1920px] mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-[40px] font-bold">
                        What <span className="text-[#339ca0]">Participants</span> Say?
                    </h2>
                </div>

                <Swiper
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation={true}
                    breakpoints={{
                        640: { slidesPerView: 1.2 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 }, 
                        1280: { slidesPerView: 3 },
                        1920: { slidesPerView: 4 },
                    }}
                    modules={[Navigation]}
                    className="relative"
                >
                    {testimonials.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div className="h-[480px] bg-white border border-gray-300 rounded-lg w-[300px] sm:w-[330px] shadow transition-all hover:shadow-lg mx-auto">
                                <div className="relative">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-[330px] h-[300px] object-cover rounded-t-lg"
                                    />
                                    <div className="absolute bottom-0 left-0 m-2 bg-gradient-to-r from-[#339ca0] to-black text-white px-3 py-1 rounded flex items-center gap-1 text-sm font-medium">
                                        <FaPlayCircle />
                                        Watch Now
                                    </div>
                                </div>

                                <div className="p-4 text-left">
                                    <p className="text-sm text-gray-700 italic mb-3">
                                        <FaQuoteLeft className="inline mr-1" />
                                        {item.text}
                                        <FaQuoteRight className="inline ml-1" />
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-base">{item.name}</h3>
                                        <img
                                            src={item.companyLogo}
                                            alt={item.company}
                                            className="w-[40px] h-auto object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
