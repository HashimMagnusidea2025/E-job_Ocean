import React from "react";
import { FaClock, FaBookOpen, FaFileAlt } from "react-icons/fa";
import { useState } from "react";
import { CartView } from "../../../cards/cards";

export default function   Big4Masterclass() {

  const [showCart,setShowCart] = useState(false)

  return (
    <div className="bg-gradient-to-r from-[#090A47] to-[#20AEB2]">
      <div className="container mx-auto text-white py-16 px-4 md:px-8 lg:px-20 ">
        <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-10">

          {/* Left Content */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold">Big 4 Masterclass</h1>
            <p className="text-base md:text-lg font-medium">
              Become Industry Ready in Big 4 MasterClass and Join Top Firms
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 border px-4 py-3 rounded-full bg-black/30">
                <FaClock />
                <span>25+ Hrs Hands-on Training on Finance</span>
              </div>
              <div className="flex items-center gap-3 border px-4 py-3 rounded-full bg-black/30">
                <FaBookOpen />
                <span>30+ Interview Resources & Guidebooks</span>
              </div>
              <div className="flex items-center gap-3 border px-4 py-3 rounded-full bg-black/30">
                <FaFileAlt />
                <span>Training for Assurance, Excel, Resume & Personal Interviews</span>
              </div>
            </div>
          </div>

          {/* Right - YouTube Video */}
          <div className="md:w-1/2 w-full">
            <div className="rounded-lg overflow-hidden border border-white shadow-lg">
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/KgTgQy-2JzA"
                title="Big 4 Masterclass Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="mt-10 flex justify-center">
          <button onClick={()=> setShowCart(true)} className="bg-black text-white px-6 py-3 rounded-full text-sm md:text-md transition">
            Register Now @ ₹1999/-
            <span className="line-through ml-2 text-white text-sm">₹10000</span> →
          </button>
        </div>
        {showCart && <CartView onClose={()=>setShowCart(false)}/>}
      </div>
    </div>
  );
}
