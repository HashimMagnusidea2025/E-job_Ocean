import React from "react";
import { FaLaptopCode, FaUsers, FaHandsHelping } from "react-icons/fa";

const cards = [
  {
    icon: <FaLaptopCode size={60} className="text-[#339ca0]" />,
    title: "Industry Specific Training Modules",
    points: [
      "Tailor-made modules for different subjects",
      "Learning from Industry experts",
      "Modules created adhere to the Best Industry Practices",
    ],
  },
  {
    icon: <FaHandsHelping size={60} className="text-[#339ca0]" />,
    title: "Hands-on Training",
    points: [
      "Real life work exposure and skill building",
      "Applied Learning with mock templates",
      "Grip over industry-specific softwares & Excel",
    ],
  },
  {
    icon: <FaUsers size={60} className="text-[#339ca0]" />,
    title: "Industry Specific Training Modules",
    points: [
      "Tailor-made modules for different subjects",
      "Learning from Industry experts",
      "Modules created adhere to the Best Industry Practices",
    ],
  },
];

export default function HowWeDoIt() {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-12 bg-white">
      <h2 className="text-[28px] sm:text-[36px] md:text-[50px] font-bold text-center text-[#339ca0] mb-10">
        That's How We Do It!
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="w-full sm:w-[90%] md:w-[45%] lg:w-[30%] hover:text-white hover:bg-gradient-to-r from-[#090A47] to-[#20AEB2] rounded-xl shadow-lg p-6 sm:p-8 text-black transition-all duration-300 ease-in-out"
          >
            <div className="flex justify-center mb-4">{card.icon}</div>
            <h3 className="text-center text-[16px] sm:text-[18px] font-semibold mb-4">
              {card.title}
            </h3>
            <ul className="text-sm sm:text-[14px] list-disc list-inside space-y-2">
              {card.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
