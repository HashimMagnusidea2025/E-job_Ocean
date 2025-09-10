import React from "react";
import { FaRocket, FaUsers, FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlineOnlinePrediction } from "react-icons/md";
import { AiOutlineRise } from "react-icons/ai";

const timelineData = [
  {
    date: "JUN 2019",
    title: "Thinking Bridge Launched",
    icon: <FaRocket size={24} className="sm:size-[36px]" />,
  },
  {
    date: "SEP 2019",
    title: "Started Training Offline & B2B Batches.",
    icon: <FaChalkboardTeacher size={24} className="sm:size-[36px]" />,
  },
  {
    date: "NOV 2020",
    title: "Launched Online Training & Upskilling Platform",
    icon: <MdOutlineOnlinePrediction size={24} className="sm:size-[36px]" />,
  },
  {
    date: "FEB 2021",
    title: "Crossed 1000 Active learners.",
    icon: <FaUsers size={24} className="sm:size-[36px]" />,
  },
  {
    date: "MAR 2022",
    title: "Registered 10x growth in active learners (10,000 learners.)",
    icon: <AiOutlineRise size={24} className="sm:size-[36px]" />,
  },
];

export default function JourneyTimeline() {
  return (
    <div className="py-10 px-4 sm:px-8 bg-white ">
      <h2 className="text-3xl sm:text-[50px] font-bold text-center text-[#339ca0] mb-12 leading-tight">
        Our Journey So Far
      </h2>

      <div className="relative flex flex-col sm:flex-row sm:justify-center sm:items-start gap-10 max-w-7xl mx-auto">
        {timelineData.map((item, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center text-center sm:max-w-[220px] transition-transform hover:-translate-y-1"
          >
            {/* Horizontal connector line for desktop */}
            {index < timelineData.length - 1 && (
              <div className="hidden sm:block absolute top-8 right-[-70px] w-16 border-t-2 border-dashed border-gray-400"></div>
            )}

            {/* Vertical connector line for mobile */}
            {index < timelineData.length - 1 && (
              <div className="sm:hidden absolute bottom-[-30px] w-1 h-6 border-l-2 border-dashed border-gray-400"></div>
            )}

            {/* Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full text-white bg-[#339ca0] shadow-lg">
              {item.icon}
            </div>

            {/* Date */}
            <div className="mt-3 text-[#339ca0] bg-[#339ca0] text-black font-semibold text-xs px-4 py-1 rounded-full shadow">
              {item.date}
            </div>

            {/* Title */}
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-700 px-2">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
