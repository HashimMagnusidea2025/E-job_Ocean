import React, { useCallback } from "react";

import HeaderPalecment from '../../media/png/HeaderPalecment.png'

import logo from '../../media/logo/ejob_ocean.png';
import Navbar from '../../components/layout/navbar/navbar';
import Footer from '../../components/layout/footer/footer';
import OpportunitiesSection from '../../components/layout/section/OpportunitiesSection/OpportunitiesSection';
import BonusSection from '../../components/layout/section/BonusSection/BonusSection';
import Countersection from '../../components/layout/section/countersection/countersection';
import AlumniSlider from '../../components/layout/section/AlumniSlider/AlumniSlider';
import HallOfFrameSlider from '../../components/layout/section/HallOfFrameSlider/HallOfFrameSlider';
import Location from '../../components/layout/section/location/location';
import RoleSection from '../../components/layout/section/RoleSection/RoleSection';
import HowWeWork from '../../components/layout/section/HowWeWork/HowWeWork';
import WhoCanApply from '../../components/layout/section/WhoCanApply/WhoCanApply';
import FAQSection from '../../components/layout/section/FAQSection/FAQSection';
import { PlacementProgramSection } from '../../components/layout/section/AppDownloadSection/AppDownloadSection';

export default function Placementpage() {



    return (
        <div className="w-full">
            <Navbar />



            <section className=" bg-[linear-gradient(to_right,_#090A47,_#20AEB2)] to-black w-full h-[600px] relative overflow-hidden font-[Poppins] flex items-end">

                <div className="relative z-10 flex w-full mx-auto ">
                    <div className="w-[60%] text-white flex justify-center ">
                        <div className="space-y-6 w-[80%]">
                            <h1 className="text-4xl sm:text-5xl md:text-[50px] font-bold leading-tight">
                                eJob Ocean <br /> FREE Placement Program
                            </h1>
                            <h2 className="text-2xl font-semibold">Free Placement Assistance</h2>
                            <p className="text-lg font-medium">
                                Get Your Dream Finance Job/Articleship In Big 4s & Top Firms
                            </p>
                        </div>

                    </div>


                    <div className="w-[40%]">
                        <img
                            src={HeaderPalecment}
                            alt="Girl Image"
                            className="w-full h-auto rounded-lg "
                        />
                    </div>
                </div>
            </section>



            <div className='w-full'>
                <OpportunitiesSection />
            </div>
            <div className='bg-[#FFFBF7] '>
                <BonusSection />
            </div>
            <div className='relative bg-[linear-gradient(to_right,_#090A47,_#20AEB2)]'>
                <Countersection />
            </div>
            <div className='w-full'>
                <AlumniSlider />
            </div>
            <HallOfFrameSlider />
            <div className='bg-[linear-gradient(to_right,_#090A47,_#20AEB2)]'>
                <Location />
            </div>
            <RoleSection />
            <div className='w-full bg-[linear-gradient(to_right,_#090A47,_#20AEB2)]'>
                <HowWeWork />
            </div>
            <div className='container mx-auto'>
                <WhoCanApply />
            </div>
            <div className='container mx-auto'>
                <FAQSection />
            </div>
            <div className='relative bg-[linear-gradient(to_right,_#090A47,_#20AEB2)]'>
                <PlacementProgramSection />
            </div>

            <Footer />
        </div>
    );
}
