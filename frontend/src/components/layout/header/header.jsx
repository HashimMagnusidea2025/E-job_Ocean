import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaBuilding, FaUsers, FaPlusCircle } from 'react-icons/fa';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import headerImage from '../../../media/png/headerImage.png';
import headerImage2 from '../../../media/png/Chatting-pana.svg';
import headerImage3 from '../../../media/png/Chatting-pana (2).svg';

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
        const { data } = await axios.get("/cms-content");
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

            <h1 className="text-3xl sm:text-[50px] font-bold leading-snug mb-4 text-white">

              {/* LINE 1 */}
              <span
                dangerouslySetInnerHTML={{
                  __html: cmsContent?.line_1,
                }}
              />

            </h1>
            <span className="block text-gray-200 mb-6 px-2 lg:px-0 text-[16px] sm:text-[18px]"
              dangerouslySetInnerHTML={{
                __html: cmsContent?.line_2
              }} />


            <span className="block text-gray-200 mb-6 px-2 lg:px-0 text-[16px] sm:text-[18px]"
              dangerouslySetInnerHTML={{
                __html: cmsContent?.line_3
              }}
            />



            {/* Search Bar */}
            {/* <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
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
              
              <button onClick={handleSearch} className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-xl font-medium hover:bg-white/20 transition">
                Find Job
              </button>

            </div> */}

            <span className=" block text-sm text-gray-200"
              dangerouslySetInnerHTML={{
                __html: cmsContent?.line_4
              }}
            >
            </span>
          </div>


          <div className="w-full lg:w-2/5 text-center">
            <img
              src={headerImage3}
              alt="Hero Illustration"
              className="mx-auto max-w-[400px] w-full"
            />
          </div>
        </div>


      </div>
    </section>
  );
}
