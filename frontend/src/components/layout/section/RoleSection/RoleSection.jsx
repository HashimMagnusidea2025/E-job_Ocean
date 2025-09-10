import React from "react";
import profits from "../../../../media/png/profits.png";

import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
const roles = [
  { title: "Statutory Audit", icon: profits },
  { title: "Transfer Pricing", icon: profits },
  { title: "Internal Audit", icon: profits },
  { title: "Risk Assurance", icon: profits },
  { title: "Goods & Services Tax", icon: profits },
  { title: "Direct Taxation", icon: profits },
  { title: "Financial Planning & Analysis", icon: profits },
  { title: "Investment Banking", icon: profits },
  { title: "Management Consulting", icon: profits },
];

export default function RoleSection() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 200, // 👈 triggers animation when 200px before element enters viewport
    });
  }, []);
  return (
    <div className=" container mx-auto py-12 bg-white text-center font-[Poppins]">
      <h2 className="text-3xl font-bold text-gray-800 mb-10">Role</h2>

      <div className="flex flex-wrap justify-center items-center gap-8 max-w-6xl mx-auto px-4">
        {roles.map((role, index) => (
          <div
            key={index}
            data-aos="zoom-in-up"
            data-aos-delay={index * 100}
            data-aos-easing="ease-in-out"
            data-aos-duration="800"
            className="w-[250px] h-40 bg-white rounded-xl shadow-md hover:shadow-lg p-3 flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105"
          >
            <img
              src={role.icon}
              alt={role.title}
              className="w-16 h-16 object-contain mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900">{role.title}</h3>
          </div>
        ))}
      </div>

    </div>
  );
}
