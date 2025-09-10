import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css/navigation";
import "swiper/css/pagination";

// Replace with your local images
import rajkumar from '../../../../media/jpg/rajkumar.jpeg';

const alumni = [
    {
        name: "Shahid Hussain",
        course: "Audit Master Class",
        companyLogo: "/logos/pwc.png",
        image: rajkumar,
    },
    {
        name: "Wenkata Saiiraaj",
        course: "Audit Master Class",
        companyLogo: "/logos/ey.png",
        image: rajkumar,
    },
    {
        name: "Tanmay Jadhav",
        course: "Audit Master Class",
        companyLogo: "/logos/bdo.png",
        image: rajkumar,
    },
    {
        name: "Another Student",
        course: "Audit Master Class ",
        companyLogo: "/logos/kpmg.png",
        image: rajkumar,
    },
    {
        name: "Another Student",
        course: "Audit Master Class ",
        companyLogo: "/logos/kpmg.png",
        image: rajkumar,
    },
    {
        name: "Another Student",
        course: "Audit Master Class ",
        companyLogo: "/logos/kpmg.png",
        image: rajkumar,
    },
    {
        name: "Another Student",
        course: "Audit Master Class ",
        companyLogo: "/logos/kpmg.png",
        image: rajkumar,
    },
];

export default function HallOfFrameSlider() {
    return (
        <div className="py-12 container mx-auto text-center font-[Poppins]">

            <div className="flex justify-between items-center mb-10 px-28">
                <h2 className="text-3xl font-bold text-gray-800">Hall of Frame</h2>
                <button className="bg-gradient-to-r from-[#339ca0] to-black text-white px-3 py-1 rounded hover:opacity-80">
                    View More
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-4">


                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                    }}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 2500 }}
                      loop={alumni.length > 4} 
                    className="alumni-swiper"
                >
                    {alumni.map((person, index) => (
                        <SwiperSlide key={index}>
                            <div className="h-[400px] bg-white rounded-xl shadow p-4 flex flex-col items-center text-center transition hover:shadow-lg">
                                <div className="w-full h-56 overflow-hidden flex justify-center items-center mb-4">
                                    <img
                                        src={person.image}
                                        alt={person.name}
                                        className="h-full object-contain"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold">{person.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">Course taken: {person.course}</p>
                                <p className="text-sm font-semibold">Selected In</p>
                                <img
                                    src={person.companyLogo}
                                    alt="Company"
                                    className="h-6 mt-2 object-contain"
                                />
                            </div>
                        </SwiperSlide>

                    ))}
                </Swiper>


            </div>
        </div>
    );
}
