import React, { useState, useEffect } from "react";
import { FaClock, FaChevronDown, FaChevronUp } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const sessions = [
  {
    title: "Introductory Session - Career in Finance",
    duration: "0.5 Hrs",
    details: "Explore the vast career opportunities in finance with this introductory session.",
  },
  {
    title: "Basic MS-Excel Training",
    duration: "2 Hrs",
    details: "Learn the basics of MS Excel to boost productivity in daily financial tasks.",
  },
  {
    title: "Advance Excel Training",
    duration: "4 Hrs",
    details: "Master VLOOKUP, pivot tables, conditional formatting, and more.",
  },
  {
    title: "Introduction to Assurance & Audit- Core Field for Big 4s",
    duration: "2 Hrs",
    details: "Understand the core principles of assurance and auditing in large firms.",
  },
  {
    title: "Cash & Bank and Financial Investments: Walkthrough, Testing, Audit Workpaper Formation",
    duration: "2 Hrs",
    details: "Detailed walkthrough on auditing of cash, banks, and investment documents.",
  },
  {
    title: "Substantive Testing- Operating Expenses and Creditors",
    duration: "2.5 Hrs",
    details: "Learn how to test operating expenses and accounts payable in audits.",
  },
  {
    title: "Basic MS-Excel Training",
    duration: "2 Hrs",
    details: "Learn the basics of MS Excel to boost productivity in daily financial tasks.",
  },
  {
    title: "Substantive Testing- Operating Expenses and Creditors",
    duration: "2.5 Hrs",
    details: "Learn how to test operating expenses and accounts payable in audits.",
  },
  {
    title: "Cash & Bank and Financial Investments: Walkthrough, Testing, Audit Workpaper Formation",
    duration: "2 Hrs",
    details: "Detailed walkthrough on auditing of cash, banks, and investment documents.",
  },
];

export default function SessionPlan() {
  const [openIndex, setOpenIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const toggleSession = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const visibleSessions = showAll ? sessions : sessions.slice(0, 5);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-32 font-[Poppins]">
      <h2 className="text-center text-xl sm:text-2xl md:text-[50px] font-semibold mb-8 text-black">
        Session <span className="text-[#339ca0]">Plan</span>
      </h2>

      <div className="flex flex-col justify-center items-center gap-4">
        {visibleSessions.map((session, index) => (
          <div
            key={index}
            data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
            className="session-glass w-full max-w-3xl border border-[#ffffff2e] backdrop-blur-md rounded-xl px-4 sm:px-6 py-4 relative transition duration-300"
          >
            <span className="absolute left-2 top-2 sm:top-3 text-[#339ca0] font-bold text-xs sm:text-sm">
              {`Session ${index + 1}`}
            </span>
            <div className="flex items-center text-gray-700 text-xs sm:text-sm mt-6">
              <FaClock className="mr-2 text-[#339ca0]" />
              <span>{session.duration}</span>
            </div>
            <div className="mt-2 text-sm sm:text-base font-semibold text-black">
              {session.title}
            </div>

            <div
              className="absolute right-4 top-4 text-[#339ca0] cursor-pointer"
              onClick={() => toggleSession(index)}
            >
              {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {openIndex === index && (
              <div className="mt-4 text-sm text-gray-800 transition-all duration-300 ease-in-out">
                {session.details}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Toggle button */}
      <div className="flex justify-center mt-10" data-aos="zoom-in">
        <button
          className="bg-black text-white rounded-full px-6 py-2 text-sm sm:text-base font-medium hover:bg-[#339ca0] hover:text-white transition"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "View Less" : "View Full Plan"}
        </button>
      </div>
    </div>
  );
}
