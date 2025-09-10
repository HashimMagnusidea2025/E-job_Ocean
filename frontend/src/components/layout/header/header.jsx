import React from 'react';
import { FaBriefcase, FaBuilding, FaUsers, FaPlusCircle } from 'react-icons/fa';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import headerImage from '../../../media/png/headerImage.png'; // Adjust path

export default function HeroSection() {
  const stats = [
    { label: 'Live Jobs', value: '1,75,324', numeric: 175324, icon: <FaBriefcase className="text-xl text-[#339ca0]" /> },
    { label: 'Companies', value: '97,354', numeric: 97354, icon: <FaBuilding className="text-xl text-[#339ca0]" /> },
    { label: 'Candidates', value: '38,47,154', numeric: 3847154, icon: <FaUsers className="text-xl text-[#339ca0]" /> },
    { label: 'New Jobs', value: '7,532', numeric: 7532, icon: <FaPlusCircle className="text-xl text-[#339ca0]" /> },
  ];

  return (
    <section className="bg-[#f9fafb] font-[Poppins] px-4 md:px-8 py-12">
      <div className='container mx-auto'>

        {/* Top Section */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10">
          {/* Left Content */}
          <div className="w-full lg:w-3/5 text-center lg:text-left">
            <h1 className="text-3xl sm:text-[50px] font-bold leading-snug mb-4">
              Find a job that suits your{' '}
              <span className="text-[#339ca0]">interest & skills.</span>
            </h1>
            <p className="text-gray-600 mb-6 px-2 lg:px-0 text-[16px] sm:text-[18px]">
              Aliquam vitae turpis in diam convallis finibus in at risus. Nullam in
              scelerisque leo, eget sollicitudin velit vestibulum.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <input
                type="text"
                placeholder="Job title, Keyword..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md w-full"
              />
              <input
                type="text"
                placeholder="Your Location"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md w-full"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-[#339ca0] to-black text-white font-medium rounded-md w-full sm:w-auto">
                Find Job
              </button>
            </div>

            <p className="text-sm text-gray-600">
              Suggestion: <span className="font-medium">Designer, Programming, </span>
              <a href="#" className="text-[#339ca0] font-medium">Digital Marketing</a>, Video, Animation
            </p>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-2/5 text-center">
            <img
              src={headerImage}
              alt="Hero Illustration"
              className="mx-auto max-w-[400px] w-full"
            />
          </div>
        </div>

        {/* Stats Section with Icons and Animation */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((item, i) => {
            const [ref, inView] = useInView({ triggerOnce: true });
            return (
              <div
                key={i}
                ref={ref}
                className="bg-white/30 backdrop-blur-md border border-white/40 p-5 rounded-xl text-center shadow-lg"
              >
                <div className="flex justify-center mb-2">{item.icon}</div>
                <h3 className="text-xl font-semibold text-black">
                  {inView ? (
                    <CountUp end={item.numeric} duration={2.5} separator="," />
                  ) : (
                    '0'
                  )}
                </h3>
                <p className="text-gray-700 text-sm">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
