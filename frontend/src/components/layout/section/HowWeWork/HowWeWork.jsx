import React from "react";

import practical from "../../../../media/png/practical.png";

const step1 = {
  number: "1",
  title: "Practical Hands on Training",
  points: [
    "Hands-on training for CA job/articleship work exposure and skill building",
    "Perform practical testing and analysis on actual data",
    "Real-Life Case Studies",
    "Create Self-Explanatory Work papers",
    "Grip over Industry specific Software like Excel, Power BI, Alteryx",
  ],
  img: practical,
};

const step2 = {
  number: "2",
  title: "Industry Connect",
  points: [
    "Benefit from our industry connect with Partners and HRs",
    "Get 100% trained and mentored by industry experts",
    "Save unnecessary hassle and get placed with a proper channel",
  ],
  img: practical,
};

const step3 = {
  number: "3",
  title: "Interview Guidance",
  points: [
    "Resume & LinkedIn Profile Evaluation",
    "One-on-One Mock Interviews",
    "Group Discussion Moderated by Industry Experts",
  ],
  img: practical,
};

export default function HowWeWork() {
  return (
    <div className="container mx-auto relative  overflow-hidden py-16 px-4 max-w-6xl mx-auto text-white font-[Poppins]">
      {/* Animated Floating Circles */}
      

      {/* Main Content */}
      <div className="relative z-10">
        <h2 className="text-center text-3xl font-bold mb-12 text-white">
          How We Work
        </h2>
        <ul className="circles">
        {Array.from({ length: 20 }).map((_, i) => (
          <li key={i}></li>
        ))}
      </ul>

        {/* Step 1 - Image Right */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 border-l-4 border-dashed border-white pl-10">
          <div className="absolute -left-[17px] top-18 w-7 h-7 rounded-full bg-white border-4 border-[#339ca0] flex items-center justify-center text-sm font-bold text-[#339ca0]">
            {step1.number}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2 text-white">{step1.title}</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-white">
              {step1.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
          <img
            src={step1.img}
            alt={`step-${step1.number}`}
            className="w-64 h-auto object-contain"
          />
        </div>

        {/* Step 2 - Image Left */}
        <div className="relative flex flex-col md:flex-row-reverse items-start md:items-center gap-6 mb-12 border-l-4 border-dashed border-white pl-10">
          <div className="absolute -left-[17px] top-18 w-7 h-7 rounded-full bg-white border-4 border-[#339ca0] flex items-center justify-center text-sm font-bold text-[#339ca0]">
            {step2.number}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2 text-white">{step2.title}</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-white">
              {step2.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
          <img
            src={step2.img}
            alt={`step-${step2.number}`}
            className="w-64 h-auto object-contain"
          />
        </div>

        {/* Step 3 - Image Right */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 border-l-4 border-dashed border-white pl-10">
          <div className="absolute -left-[17px] top-18 w-7 h-7 rounded-full bg-white border-4 border-[#339ca0] flex items-center justify-center text-sm font-bold text-[#339ca0]">
            {step3.number}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2 text-white">{step3.title}</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-white">
              {step3.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
          <img
            src={step3.img}
            alt={`step-${step3.number}`}
            className="w-64 h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
