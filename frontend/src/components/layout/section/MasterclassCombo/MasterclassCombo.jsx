import React from "react";
import WEn37placement from '../../../../media/png/WEn37placement.png'


export default function MasterclassCombo() {
  return (
    <div className="to-yellow-700 text-white py-16 px-4">
      <div className="text-center mb-10">
        <h1 className="text-[47.2px] font-bold">All MasterClasses MEGA Package</h1>
        <p className="mt-2 text-[21.4px] font-medium text-white">Become Industry-Ready and Join Top Firms</p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-4">
        {/* Card 1 */}
        <div className="bg-white text-black rounded-lg p-6 flex gap-4 items-start shadow-md">
          <img src={WEn37placement} alt="Expert Icon" className="w-12 h-12 text-orange-500" />
          <div>
            <h3 className="text-[15px] font-bold text-[#339ca0] uppercase">Industry Experts</h3>
            <p className="text-[13px] mt-1">Learn from Industry Experts with 10+ years of experience in Finance domains.</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white text-black rounded-lg p-6 flex gap-4 items-start shadow-md">
          <img src={WEn37placement} alt="Training Icon" className="w-12 h-12 text-orange-500" />
          <div>
            <h3 className="text-sm font-bold text-[#339ca0] uppercase">Hands-on Training</h3>
            <p className="text-sm mt-1">Get Practical Hands-on Training that will make you 100% Industry Ready.</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white text-black rounded-lg p-6 flex gap-4 items-start shadow-md">
          <img src={WEn37placement} alt="Faculty Icon" className="w-12 h-12 text-orange-500" />
          <div>
            <h3 className="text-sm font-bold text-[#339ca0] uppercase">World-Class Faculty</h3>
            <p className="text-sm mt-1">Case-study based approach to learn real world application of knowledge.</p>
          </div>
        </div>
      </div>

      {/* Register Now Button */}
      <div className="flex justify-center mt-12">
        <button className="bg-gradient-to-r from-black to-gray-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:opacity-90 transition">
          REGISTER NOW
        </button>
      </div>
    </div>
  );
}
