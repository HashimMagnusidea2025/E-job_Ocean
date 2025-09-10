import React from "react";
import { FaLightbulb, FaFileAlt, FaCalculator } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Learning Items
const learningItems = [
  {
    title: "Case Studies",
    description:
      "Analyze & explore real-life case studies like Satyam, ILFS, PNB- Nirav Modi.",
    icon: <FaLightbulb size={25} />,
  },
  {
    title: "Excel Application",
    description:
      "Excel Application on real data. Learn Future Analysis in Internship Course.",
    icon: <FaFileAlt size={25} />,
  },
  {
    title: "Audit Training",
    description:
      "Learn Auditing, Cash & Bank, Bank Exposure, and Revenue Section.",
    icon: <FaCalculator size={25} />,
  },
  {
    title: "Audit Practice",
    description:
      "Master practical audit cases and reporting framework with documentation.",
    icon: <FaCalculator size={25} />,
  },
];

export default function WhatYouWillLearn() {
  return (
    <div className=" w-full bg-[#FFFCF7] py-16 px-4 font-[Poppins] text-center">
      {/* Heading */}
      <h2 className="text-[44px] font-semibold">
        What Will <span className="text-[#339ca0]">You Learn</span>
      </h2>

      {/* Swiper Carousel */}
      <div className="mt-12 max-w-6xl mx-auto">
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={30}
          navigation={{ clickable: true }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop={true}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="alumni-swiper max-w-6xl mx-auto px-4"
        >
          {learningItems.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-[#339ca0] rounded-md px-6 py-8 h-[170px] w-full shadow-sm text-left">
                <h3 className="font-semibold text-white text-[22px] mb-2 flex items-center gap-2">
                  {item.title}
                  <span className="text-white">{item.icon}</span>
                </h3>
                <p className="text-sm text-white">{item.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
