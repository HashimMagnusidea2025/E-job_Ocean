import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


import alumni from "../../../../media/png/alumni.png";

const logos = [alumni, alumni, alumni, alumni, alumni, alumni, alumni, alumni];

export default function AlumniSlider() {
  return (
    <div className=" container mx-auto py-24 bg-white text-center relative font-[Poppins]">
      <h2 className="text-3xl font-bold mb-10 text-gray-800">Our Alumni Work At</h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
           1920: { slidesPerView: 6 },
        }}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500 }}
        loop
        className="alumni-swiper w-full px-8"
      >
        {logos.map((logo, index) => (
          <SwiperSlide key={index}>
            <div className="alumni-card">
              <img src={logo} alt={`company-${index}`} className="h-16 object-contain" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
