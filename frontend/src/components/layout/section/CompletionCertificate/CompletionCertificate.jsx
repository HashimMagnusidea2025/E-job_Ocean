import React from "react";
import wofD9samplecertificate from "../../../../media/jpg/wofD9samplecertificate.jpg";

export default function CompletionCertificate() {
  return (
    <div className="w-full  px-4 py-16 bg-[#FFFCF7] font-[Poppins] text-[#1a1a1a] relative overflow-hidden flex items-center justify-center">
      
      {/* GLASS CONTAINER */}
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-3xl p-8 w-full max-w-5xl flex flex-col md:flex-row items-center gap-10 z-10">
        
        {/* CERTIFICATE IMAGE */}
        <div className="w-full md:w-[50%] flex justify-center">
          <img
            src={wofD9samplecertificate}
            alt="Certificate"
            className="w-[100%] max-w-[400px] rounded-xl border border-white/30 shadow-md"
          />
        </div>

        {/* TEXT CONTENT */}
        <div className="w-full md:w-[50%] text-center md:text-left">
          <h2 className="text-[38px] md:text-[44px] font-bold leading-tight mb-4 text-black drop-shadow">
            Completion <span className="text-[#339ca0]">Certificate</span>
          </h2>
          <p className="text-white/90 text-[18px] leading-relaxed mb-4">
            A Certificate of Completion of course along with Mark-sheet based
            on the performance will be awarded to each candidate.
          </p>
          <p className="text-[#339ca0] font-semibold text-[18px]">
            Register Now to Get the Certificate
          </p>
        </div>
      </div>

     
    </div>
  );
}
