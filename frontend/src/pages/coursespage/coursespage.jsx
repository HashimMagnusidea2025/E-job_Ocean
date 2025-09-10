
import Navbar from "../../components/layout/navbar/navbar";
import Footer from "../../components/layout/footer/footer";
import { CartView } from "../../components/cards/cards";

import Big4Masterclass from "../../components/layout/section/Big4Masterclass/Big4Masterclass";
import { StudentCardMarquee } from "../../components/cards/cards";
import KeyHighlights from "../../components/layout/section/KeyHighlights/KeyHighlights";
import { FaUniversity, FaCheckCircle, FaStar } from "react-icons/fa";
import FacultySection from "../../components/layout/section/FacultySection/FacultySection";
import SessionPlan from "../../components/layout/section/SessionPlan/SessionPlan";
import WhoShouldJoin from "../../components/layout/section/WhoShouldJoin/WhoShouldJoin";
import CompletionCertificate from "../../components/layout/section/CompletionCertificate/CompletionCertificate";
import WhatYouWillLearn from "../../components/layout/section/WhatYouWillLearn/WhatYouWillLearn";
import Whatparticipantssay from '../../components/layout/section/Whatparticipantssay/Whatparticipantssay';
import BonusSection from "../../components/layout/section/BonusSection/BonusSection";
import DemoSessions from "../../components/layout/section/DemoSessions/DemoSessions";
import MasterclassValidity from "../../components/layout/section/MasterclassValidity/MasterclassValidity";
import FAQ from "../../components/layout/section/FAQ/FAQ";
import { PlacementProgramSection } from "../../components/layout/section/AppDownloadSection/AppDownloadSection";

import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { useState } from "react";


export default function CoursesPage() {
    const { ref, inView } = useInView({ triggerOnce: true });
    const [showCart, setShowCart] =useState(false)

    return (
        <>
            <div className="w-full font-[Poppins]">
                <Navbar />


                <Big4Masterclass />
                <div className="bg-[#FFFBF7] w-full">
                    <div className="">

                      
                        <div className="container mx-auto py-16 px-4 text-center">
                            <div className="w-full grid grid-cols-3 gap-6 mb-10" ref={ref}>
                              
                                <div className="flex flex-col items-center">
                                    <FaUniversity className="text-[#339ca0] mb-2" size={35} />
                                    <p className="text-[#339ca0] text-base sm:text-2xl md:text-3xl font-semibold">
                                        {inView && <CountUp end={100} duration={2} />}+
                                    </p>
                                    <p className="text-[#573b2b] text-sm sm:text-lg md:text-xl">Recruiters</p>
                                </div>

                             
                                <div className="flex flex-col items-center">
                                    <FaCheckCircle className="text-[#339ca0] mb-2" size={35} />
                                    <p className="text-[#339ca0] text-base sm:text-2xl md:text-3xl font-semibold">
                                        {inView && <CountUp end={1000} duration={2} />}+
                                    </p>
                                    <p className="text-[#573b2b] text-sm sm:text-lg md:text-xl">Enrollments</p>
                                </div>

                               
                                <div className="flex flex-col items-center">
                                    <FaStar className="text-[#339ca0] mb-2" size={35} />
                                    <p className="text-[#339ca0] text-base sm:text-2xl md:text-3xl font-semibold">
                                        {inView && <CountUp end={4.8} decimals={1} duration={2} />}
                                    </p>
                                    <p className="text-[#573b2b] text-sm sm:text-lg md:text-xl">Reviews</p>
                                </div>
                            </div>



                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold pt-5">
                                Our Alumni Placed in <br />
                                <span className="text-[#339ca0]">100+ Top Companies</span>
                            </h2>
                        </div>

                       
                        <div className="pt-10">
                            <StudentCardMarquee />
                        </div>
                    </div>

                   
                    <div className="container mx-auto py-10">
                        <KeyHighlights />
                        <div className="flex justify-center pt-4">
                            <button onClick={()=> setShowCart(true)} className="mt-6 bg-black text-white px-6 py-3 rounded-full text-md transition">
                                Register Now @ ₹1999/-
                                <span className="line-through ml-2 text-sm text-white">₹10000</span> →
                            </button>
                        </div>
                        {showCart && <CartView onClose={()=>setShowCart(false)}/>}
                        
                    </div>

                    
                    <div className="container mx-auto">
                        <FacultySection />
                    </div>

                    <div className="container mx-auto">
                        <SessionPlan />
                    </div>

                    <div className="container mx-auto">
                        <WhoShouldJoin />

                    </div>
                    <div className="container mx-auto">
                        <CompletionCertificate />
                    </div>
                    <div className="container mx-auto">
                        <WhatYouWillLearn />
                    </div>
                    <div>
                        <Whatparticipantssay />
                    </div>
                    <div className="container mx-auto">
                        <BonusSection />

                    </div>
                    <div className="container mx-auto">
                        <DemoSessions />

                    </div>
                    <div className="bg-[#120D02]">
                        <MasterclassValidity />
                    </div>
                    <div className="container mx-auto">
                        <FAQ />
                    </div>
                    <div className="relative  bg-[linear-gradient(to_right,_#090A47,_#20AEB2)]">
                        <PlacementProgramSection />
                    </div>


                </div>
                <Footer />

            </div>


        </>
    )
}