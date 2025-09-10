import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import cashubhangijain from '../../../../media/png/ca-shubhangi-jain.png'

const experts = [
    {
        name: "CA Shubhangi Jain",
        role: "Lead Faculty of Business Analytics Masterclass",
        image: cashubhangijain,
        linkedin: "#",
    },
    {
        name: "CA Nikhil Dhingra",
        role: "Lead Faculty of Applied Excel & Data Analytics and Internal Audit Masterclass",
        image: cashubhangijain,
        linkedin: "#",
    },
    {
        name: "CA Archit Agarwal",
        role: "Lead Faculty of Audit Masterclass",
        image: cashubhangijain,
        linkedin: "#",
    },
    {
        name: "CA Archit Agarwal",
        role: "Lead Faculty of Audit Masterclass",
        image: cashubhangijain,
        linkedin: "#",
    },
    {
        name: "CA Archit Agarwal",
        role: "Lead Faculty of Audit Masterclass",
        image: cashubhangijain,
        linkedin: "#",
    },
    {
        name: "CA Archit Agarwal",
        role: "Lead Faculty of Audit Masterclass",
        image: cashubhangijain,
        linkedin: "#",
    },
    {
        name: "CA Archit Agarwal",
        role: "Lead Faculty of Audit Masterclass",
        image: cashubhangijain,
        linkedin: "#",
    },
];

export default function IndustryExperts() {
    return (
        <section className="py-16 bg-white text-center">
            <h2 className=" font-bold text-3xl md:text-[50px] inline-block px-6 py-2 text-[#339ca0] rounded mb-12">
                Our Industry Experts
            </h2>

            <div className="relative w-full mx-auto px-4">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 3 },
                         1920: { slidesPerView: 4 },
                    }}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 2500 }}
                    loop
                    className="alumni-swiper mx-auto px-4"
                >
                    {experts.map((expert, index) => (
                        <SwiperSlide key={index}>
                            <div className="flex flex-col items-center text-center">
                                <div className="relative w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden mb-4">
                                    <img
                                        src={expert.image}
                                        alt={expert.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <a
                                        href={expert.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3"
                                    >
                                        <img
                                            src="/images/linkedin-icon.png"
                                            alt="LinkedIn"
                                            className="w-6 h-6"
                                        />
                                    </a>
                                </div>
                                <h3 className="text-[#339ca0] font-semibold text-[22px]">
                                    {expert.name}
                                </h3>
                                <p className="text-[17px] text-gray-700 mt-1 px-4">
                                    {expert.role}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>




            </div>
        </section>
    );
}
