import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaBuilding, FaUsers, FaPlusCircle } from 'react-icons/fa';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import headerImage from '../../../media/png/headerImage.png'; // Adjust path
import axios from '../../../utils/axios.js';
import snowfall from 'react-snowfall'
export default function HeroSection() {
  const stats = [
    { label: 'Live Jobs', value: '1,75,324', numeric: 175324, icon: <FaBriefcase size={22} className="text-xl text-[#339ca0]" /> },
    { label: 'Companies', value: '97,354', numeric: 97354, icon: <FaBuilding size={22} className="text-xl text-[#339ca0]" /> },
    { label: 'Candidates', value: '38,47,154', numeric: 3847154, icon: <FaUsers size={22} className="text-xl text-[#339ca0]" /> },
    { label: 'New Jobs', value: '7,532', numeric: 7532, icon: <FaPlusCircle size={22} className="text-xl text-[#339ca0]" /> },
  ];


  const [cmsContent, setCmsContent] = useState(null);
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const { data } = await axios.get("/cms-content"); // get all content
        const homeData = data.find(
          (item) => item.page?.name === "Home"
        );
        setCmsContent(homeData);
      } catch (error) {
        console.error("Error fetching CMS content:", error);
      }
    };
    fetchHomeContent();
  }, []);


  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTitle) params.append("title", searchTitle);
    if (searchLocation) params.append("location", searchLocation);

    navigate(`/placement-program?${params.toString()}`);
  };

  return (
    <section className=" font-[Poppins] px-4 md:px-8 py-20  bg-[linear-gradient(to_right,_#090A47,_#20AEB2)] to-black">
     
      <div className='container mx-auto'>


        <div className="flex flex-col-reverse lg:flex-row items-center gap-10">

          <div className="w-full lg:w-3/5 text-center lg:text-left text-gray-200">
            {/* <h1 className="text-3xl sm:text-[50px] font-bold leading-snug mb-4 text-white">
              Find a job that suits your{' '}
              <span className="text-[#20AEB2]">interest & skills.</span>
            </h1> */}
            <h1 className="text-3xl sm:text-[50px] font-bold leading-snug mb-4 text-white">
              {cmsContent?.line_1} {""}
              <span className="text-[#20AEB2] drop-shadow-[0_0_8px_#20AEB2]">
                {cmsContent?.line_2}
              </span>
            </h1>



            <p className="text-gray-200 mb-6 px-2 lg:px-0 text-[16px] sm:text-[18px]">
              {cmsContent?.line_3}
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <input
                type="text"
                placeholder="Job title, Keyword..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}

                className="flex-1 px-4 py-3 text-black border border-gray-300 rounded-md w-full bg-gray-200"
              />
              <input
                type="text"
                placeholder="Your Location" 
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="flex-1 px-4 py-3 text-black border border-gray-300 rounded-md w-full bg-gray-200"
              />
              {/* <button className="px-6 py-3 bg-gradient-to-r from-[#339ca0] to-black text-white font-medium rounded-md w-full sm:w-auto">
                Find Job
              </button> */}
              <button  onClick={handleSearch} className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-xl font-medium hover:bg-white/20 transition">
                Find Job
              </button>

            </div>

            <p className="text-sm text-gray-200">
              Suggestion: <span className="font-medium">Designer, Programming, </span>
              <a href="#" className="text-[#20AEB2] drop-shadow-[0_0_6px_#20AEB2] font-medium">Digital Marketing</a>, Video, Animation
            </p>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-2/5 text-center">
            <img
              src={headerImage}
              alt="Hero Illustration"
              className="mx-auto max-w-[400px] w-full"
            />
          </div>
        </div>

        {/* Stats Section with Icons and Animation */}
        {/* <div className="mt-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((item, i) => {
            const [ref, inView] = useInView({ triggerOnce: true });
            return (
              <div
                key={i}
                ref={ref}
                className=" bg-gray-200 backdrop-blur-md border border-white/40 p-5 rounded-xl text-center shadow-lg"
              >
                <div className="flex justify-center mb-2">{item.icon}</div>
                <h3 className="text-xl font-semibold text-black">
                  {inView ? (
                    <CountUp end={item.numeric} duration={2.5} separator="," />
                  ) : (
                    '0'
                  )}
                </h3>
                <p className="text-gray-700 text-sm">{item.label}</p>
              </div>
            );
          })}
        </div> */}
      </div>
    </section>
  );
}
