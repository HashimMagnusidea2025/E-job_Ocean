import Mission from '../../../../media/jpg/Mission.jpg';
import workingteamoffice from '../../../../media/jpg/working-team-office.jpg';
import React, { useState, useEffect } from "react";
import axios from "../../../../utils/axios.js";
import { FaMapPin, FaEye } from "react-icons/fa";
export default function MissionVision() {


  const [cmsContent, setCmsContent] = useState(null);


  useEffect(() => {
    const fetchAboutUsContent = async () => {

      try {
        const { data } = await axios.get("/cms-content"); // get all content
        const homeData = data.find(
          (item) => item.page?.name === "About"
        );
        setCmsContent(homeData);
        console.log(data);

      } catch (error) {

        console.error("Error fetching CMS content:", error);
      }
    };
    fetchAboutUsContent();
  }, []);
  return (
    <div className="px-4 sm:px-6 md:px-28 py-16 bg-white ">
      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 mb-20">
        <div>
          <div className="flex items-center mb-4">
            <span className="text-[#339ca0] text-2xl mr-3"><FaEye /></span>
            <h2 className="text-3xl font-bold text-[#339ca0]">   Our Vision </h2>
          </div>
          {/* <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            {cmsContent?.line_1}
          </p> */}
          <div
            className="text-gray-700 text-base md:text-lg leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: cmsContent?.line_2,
            }}
          ></div>

        </div>
        <div className="w-full flex justify-center">
          <img
            src={Mission}
            alt="Teamwork"
            className="rounded-lg shadow-xl w-full max-w-md md:max-w-lg"
          />
        </div>
      </div>

      {/* Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        <div className="w-full flex justify-center order-1 md:order-none">
          <img
            src={workingteamoffice}
            alt="Vision"
            className="rounded-lg shadow-xl w-full max-w-md md:max-w-lg"
          />
        </div>
        <div>
          <div className="flex items-center mb-4">
            <span className="text-[#339ca0] text-2xl mr-3"><FaMapPin /></span>
            <h2 className="text-3xl font-bold text-[#339ca0]">Our Mission</h2>
          </div>
          
          <div
            className="text-gray-700 text-base md:text-lg leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: cmsContent?.line_1,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
