import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router";
import { OurFreeCoursesCrds } from "../../../cards/cards";
import banner1 from "../../../../media/png/MASTERCLASS.png";
import { useState, useEffect } from "react";
import axios from '../../../../utils/axios.js';
const baseURL = import.meta.env.VITE_BACKEND_URL;
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
        image: banner1,
        trainer: "CA Rakshit Mittal",
        hours: "20+ Hrs",
        price: "₹3499/-",
    },
    {
        title: "AI & ChatGPT For Finance MasterClass",
        image: banner1,
        trainer: "Inderjeet & Archit",
        hours: "20+ Hrs",
        price: "₹2499/-",
    },
    {
        title: "Audit Master Class",
        image: banner1,
        trainer: "CA Archit Agarwal",
        hours: "30+ Hrs",
        price: "₹3499/-",
    },
    {
        title: "Audit Master Class",
        image: banner1,
        trainer: "CA Archit Agarwal",
        hours: "30+ Hrs",
        price: "₹3499/-",
    },
];

export default function OurFreeCourses() {

    const [jobs, setJobs] = useState([]);

    const fetchJobs = async () => {

        try {
            const responce = await axios.get('/job-post/active');
            const jobsData = responce.data;
            setJobs(jobsData);
            console.log(jobsData);

        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    }
    useEffect(() => {
        fetchJobs();
    }, [])

    const navigate = useNavigate();
    
    return (
        <div className="py-12 px-4 bg-white font-[Poppins]">
            <div className="container mx-auto">
                <div className="flex sm:flex-row justify-between items-start sm:items-center mb-6 px-4 sm:px-8 gap-4">
                    <h2 className="text-[23px] sm:text-[40px] font-bold leading-tight">
                        <span className="text-[#339ca0]">Letest Jobs Updates</span>
                    </h2>
                    <button onClick={() => navigate('/placement-program')} className="bg-gradient-to-r from-[#339ca0] to-black text-white px-4 py-2 text-[18px] sm:text-[18px] rounded font-medium transition-all hover:bg-gray-800">
                        View All
                    </button>
                </div>
            </div>

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
                {jobs.map((job) => (
                    <SwiperSlide key={job._id}>
                        <OurFreeCoursesCrds
                            title={job.jobTitle}
                            image={
                                `${baseURL}${job.companyId?.company?.employerLogo}`
                            }
                            companyname={job?.companyId?.company?.name}
                            date={job?.expiryDate}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

        </div>
    );
}
