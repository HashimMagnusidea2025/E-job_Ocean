import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaCheckCircle } from "react-icons/fa";

export default function CARegistrationSection() {
    const navigate = useNavigate();

    return (
        <section className="relative w-full py-24 overflow-hidden font-[Poppins] bg-gradient-to-br from-[#eefafa] via-white to-[#f2f7f7]">
    
    {/* Background Blurs */}
    <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#339ca0]/20 rounded-full blur-3xl" />
  

    <div className="relative max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-8">
        
        {/* CA Partner Tag */}
        <span className="inline-block mb-4 px-4 py-1 text-sm font-medium rounded-full bg-[#339ca0]/10 text-[#339ca0]">
            CA Partner Program
        </span>

        {/* Heading */}
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Grow Your Practice as a  
            <span className="text-[#339ca0]"> Chartered Accountant</span>
        </h2>

        
        <button
            onClick={() => navigate("/ca-register")}
            className="mt-10 inline-flex items-center gap-3 bg-[#339ca0] text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl hover:bg-[#2b8588] transition-all duration-300"
        >
            <FaUserTie />
            Register as CA
        </button>
    </div>
</section>

    );
}
