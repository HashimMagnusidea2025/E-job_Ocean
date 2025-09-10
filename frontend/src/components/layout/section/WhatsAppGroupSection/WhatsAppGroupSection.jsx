import React from 'react';

import groupIllustration from '../../../../media/logo/whatsapp-illustration.png'; // illustration image

export const WhatsAppGroupSection = () => {
    return (
        <div className="w-full py-12 bg-white font-[Poppins] ">

            <div className="container mx-auto  ">
                <h2 className="text-[32px] sm:text-[40px] font-bold leading-tight mb-4">
                    Join Our <span className="text-[#339ca0]">WhatsApp Group</span> <span>for </span> 
                     <span className="text-[#339ca0]">Placement Updates & Important Resources</span>
                </h2>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

                    
                    <div className="flex-1 text-center lg:text-left">
                        <p className="text-[20px]  text-gray-800 mb-6">
                            <span className="text-[32px] text-[#339ca0]">Get Updates for :</span> Latest Job opportunities in Big 4s & Top Firms,
                            Important Resources for Interview Preparation, & Updates from the Finance World.
                        </p>
                        <button className=" bg-gradient-to-r from-[#339ca0] to-black text-white font-medium px-5 py-3 rounded shadow hover:bg-green-700 transition-all">
                            Join WhatsApp Group
                        </button>
                    </div>

                    
                    <div className="flex-1 flex justify-center">
                        <img
                            src={groupIllustration}
                            alt="WhatsApp Group Illustration"
                            className="w-full max-w-[370px]"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};
