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


export default function OurFreeCourses() {

    const [jobs, setJobs] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
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
    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchTitle) params.append("title", searchTitle);
        if (searchLocation) params.append("location", searchLocation);

        navigate(`/placement-program?${params.toString()}`);
    };
    return (
        <div className="py-12  bg-white font-[Poppins]">

            <div className="container mx-auto px-4">
                <div className="bg-white rounded-2xl  p-6 mb-12">

                    <div className="flex flex-col md:flex-row items-stretch gap-4 justify-center">

                        {/* Job Title */}
                        <input
                            type="text"
                            placeholder="Job title or keyword"
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                            className="flex-2 px-5 py-3 rounded-xl border border-gray-300
                   focus:ring-2 focus:ring-[#339ca0] focus:outline-none"
                        />

                        {/* Location */}
                        <input
                            type="text"
                            placeholder="Location"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            className="flex-2 px-5 py-3 rounded-xl border border-gray-300
                   focus:ring-2 focus:ring-[#339ca0] focus:outline-none"
                        />

                        {/* Button */}
                        <button
                            onClick={handleSearch}
                            className="px-8 py-3 rounded-xl font-semibold text-white
                   bg-gradient-to-r from-[#339ca0] to-black
                   hover:scale-105 transition-transform duration-300"
                        >
                            Find Jobs
                        </button>

                    </div>
                </div>
            </div>

            <div className="">
                <div className="flex sm:flex-row justify-between items-start sm:items-center mb-6 px-4 sm:px-8 gap-4">
                    <h2 className="text-xl sm:text-[40px] font-bold leading-tight">
                        <span className="text-[#339ca0]">Latest Jobs Updates</span>
                    </h2>
                    <button onClick={() => navigate('/placement-program')} className="bg-gradient-to-r from-[#339ca0] to-black text-white sm:px-4 sm:py-2 px-2 py-1 text-[18px] sm:text-[18px] rounded font-medium transition-all hover:bg-gray-800">
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
                            id={job._id}
                            title={job.jobTitle}
                            image={
                                `${baseURL}${job.companyId?.company?.employerLogo}`
                            }
                            companyname={job?.companyId?.company?.name}
                            date={job?.expiryDate}
                            createdAt={job?.createdAt}
                            experience={job?.experience}
                            mode={job?.mode}  

                        />
                    </SwiperSlide>
                ))}
            </Swiper>

        </div>
    );
}
