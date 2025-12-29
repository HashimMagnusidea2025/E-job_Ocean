import React, { useCallback } from "react";
import { useState, useEffect, Suspense, lazy } from "react";
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
import CARegistrationSection from "../../components/layout/section/CARegistrationSection/CARegistrationSection.jsx";
import axios from '../../utils/axios.js'
export default function Placementpage() {

    const [data, setData] = useState()
    const fetchCompanydata = async () => {
        try {
            const response = await axios.get('/general-settings'); // backend endpoint
            // console.log("✅ Full Response:", response);              // logs full Axios response object
            // console.log("✅ Data Received:", response.data);          // logs only your actual data

            setData(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch company logo:", error);
        }
    };

    useEffect(() => {
        fetchCompanydata();
    }, []);

    return (
        <div className="w-full overflow-x-hidden">
            <Navbar />



            <section className="bg-[linear-gradient(to_right,_#090A47,_#20AEB2)] w-full min-h-[350px] relative overflow-hidden font-[Poppins] flex flex-col-reverse md:flex-row items-center md:items-end">
                <div className="relative z-10 flex flex-col md:flex-row w-full mx-auto px-4 md:px-8  md:py-0">

                    {/* LEFT — TEXT */}
                    <div className="w-full md:w-[60%] mt-2 sm:mt-0 lg:mt-0 text-white flex justify-center items-center text-center md:text-left">
                        <div className="space-y-4 md:space-y-6 w-full md:w-[80%]">
                            <h1 className="text-3xl sm:text-4xl md:text-[50px] font-bold leading-tight md:leading-[1.2]">
                                {data?.name} <br /> FREE Placement Program
                            </h1>

                            <h2 className="text-xl sm:text-2xl font-semibold">
                                Free Placement Assistance
                            </h2>
                            <p className="text-base sm:text-lg font-medium">
                                Get Your Dream Finance Job/Articleship In Big 4s & Top Firms
                            </p>
                        </div>
                    </div>

                    {/* RIGHT — IMAGE */}
                    <div className="w-full md:w-[36%] flex justify-center md:justify-end  md:mb-0">
                        <img
                            src={HeaderPalecment}
                            alt="Placement Program"
                            className="w-[80%] sm:w-[60%] md:w-full h-auto rounded-lg object-contain"
                        />
                    </div>
                </div>
            </section>


            <div className='w-full'>
                <OpportunitiesSection />
            </div>
            <div className=''>
                <BonusSection />
            </div>
            {/* <div className='relative bg-[linear-gradient(to_right,_#090A47,_#20AEB2)]'>
                <Countersection />
            </div> */}
            {/* <div className='w-full'>
                <AlumniSlider />
            </div> */}
            <HallOfFrameSlider />
            <div className='bg-[linear-gradient(to_right,_#090A47,_#20AEB2)]'>
                <CARegistrationSection />
            </div>
            {/* <RoleSection /> */}
            {/* <div className='w-full bg-[linear-gradient(to_right,_#090A47,_#20AEB2)]'>
                <HowWeWork />
            </div> */}
            {/* <div className='container mx-auto'>
                <WhoCanApply />
            </div> */}
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
