import React from "react";

export default function DemoSessions() {
  return (
    <div className="bg-[#fffaf4] py-12 px-4 sm:px-6 md:px-12 lg:px-24 text-center">
      <h2 className="text-[44px] font-semibold text-black mb-2">
        Demo Sessions of
      </h2>
      <h3 className="text-[44px] font-semibold text-[#339ca0] mb-10">
        Big 4 MasterClass
      </h3>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6">
        {/* Video 1 */}
        <div className="w-full md:w-1/2 max-w-md">
          <iframe
            className="w-full h-56 md:h-64 rounded-xl shadow-lg"
            src="https://www.youtube.com/embed/bUgUu1TzFTU"
            title="Demo Session - Flow Of Audit"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>

        {/* Video 2 */}
        <div className="w-full md:w-1/2 max-w-md">
          <iframe
            className="w-full h-56 md:h-64 rounded-xl shadow-lg"
            src="https://www.youtube.com/embed/qgjA8Njg87E"
            title="Demo Session - Pareto Analysis"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
