import React, { useEffect, useState } from 'react';
import { WebinarCardsList } from '../../../ui/cards/cards';
import axios from '../../../../utils/axios.js';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


const baseURL = import.meta.env.VITE_BACKEND_URL;

export default function BonusSection() {
    const [webinars, setWebinars] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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

    const getWebinarImage = (webinar) => {
        
        if (webinar.Speakers && webinar.Speakers.length > 1 && webinar.WebinarImage) {
            return `${baseURL}${webinar.WebinarImage}`;
        }

       
        if (
            webinar.Speakers &&
            webinar.Speakers.length === 1 &&
            webinar.Speakers[0]?.profilePic
        ) {
            return `${baseURL}/${webinar.Speakers[0].profilePic}`;
        }

       
        if (webinar.Speaker?.profilePic) {
            return `${baseURL}/${webinar.Speaker.profilePic}`;
        }

        
        return "/default-webinar.png";
    };

    const now = new Date();
    const pastWebinars = webinars.filter((webinar) => new Date(webinar.WebinarEndDateTime) < now);

    const handleRegisterClick = (webinar) => {
        console.log("User clicked register for webinar:", webinar);
    };

    return (
        <section className="container mx-auto py-5 w-full font-[Poppins]">
            <h2 className="text-2xl md:text-4xl font-semibold text-center text-gray-800 mb-10">
                <span className="text-[#339ca0] font-bold">Webinars</span>
            </h2>

            <Swiper
                modules={[Navigation, Pagination]}   
                spaceBetween={20}
                navigation  
                slidesPerView={1}
                pagination={isMobile ? { clickable: true } : false}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 },
                }}
                className={isMobile ? "pb-10" : ""}
            >

                {pastWebinars.map((webinar) => (
                    <SwiperSlide key={webinar._id} className="p-5 sm:p-0">
                        <WebinarCardsList
                            webinar={webinar}
                            image={getWebinarImage(webinar)}
                            onRegisterClick={handleRegisterClick}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

        </section>
    );
}
