import React from 'react';

import groupIllustration from '../../../../media/logo/whatsapp-illustration.png'; // illustration image
import groupIllustration2 from '../../../../media/png/Social tree-cuate.svg';
import { useNavigate } from 'react-router';
export const WhatsAppGroupSection = () => {

    const navigate = useNavigate()
    return (
        <div className="w-full py-12 bg-white font-[Poppins] ">

            <div className="container mx-auto  ">
                <h2 className="text-[32px] sm:text-[40px] font-bold leading-tight">
                    Join Our <span className="text-[#339ca0]">WhatsApp Group</span> <span>for </span>
                    <span className="text-[#339ca0]">Placement Updates & Important Resources</span>
                </h2>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-10">


                    <div className="flex-1 text-center lg:text-left">
                        <p className="text-[20px]  text-gray-800 mb-6">
                            <span className="text-[32px] text-[#339ca0]">Get Updates for :</span> Get updates for : Latest Job Opportunities in Top CA Firms, Important Resources for Interview Preparation and Updates from the Finance world.
                        </p>

                        <button
                            onClick={() =>
                                window.open(
                                    "https://chat.whatsapp.com/DDwHG9jRtyqAQrzWs5un7q",
                                    "_blank"
                                )
                            }
                            className="bg-gradient-to-r from-[#339ca0] to-black text-white font-medium px-5 py-3 rounded shadow transition-all hover:opacity-90"
                        >
                            Join WhatsApp Group
                        </button>

                    </div>


                    <div className="flex-1 flex justify-center">
                        <img
                            src={groupIllustration2}
                            alt="WhatsApp Group Illustration"
                            className="w-full max-w-[230px]"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};
