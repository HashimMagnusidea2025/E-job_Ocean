import Navbar from '../../components/layout/navbar/navbar';
import HeroSection from '../../components/layout/header/header';
import { StudentCardMarquee, MarqueeTagCards, OurCourses } from '../../components/cards/cards';

import WhoWeAre from '../../components/layout/section/WhoWeAre/WhoWeAre';
import Whatparticipantssay from '../../components/layout/section/Whatparticipantssay/Whatparticipantssay';

import OurIndustryExperts from '../../components/layout/section/OurIndustryExperts/OurIndustryExperts'

import { WhatsAppGroupSection } from '../../components/layout/section/WhatsAppGroupSection/WhatsAppGroupSection';
import AppDownloadSection from '../../components/layout/section/AppDownloadSection/AppDownloadSection';
import OurFreeCourses from '../../components/layout/section/OurFreeCourses/OurFreeCourses';
import KnowlegeBaseSection from '../../components/layout/section/knowlegebasesection/knowlegebasesection';
import Footer from '../../components/layout/footer/footer';
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    return (
        <>
            <div className='w-full font-[Poppins] overflow-x-hidden'>
                <Navbar />
                <HeroSection />
                <div className='container mx-auto '>
                    <OurFreeCourses />
                </div>
                {/* <MarqueeTagCards /> */}
                <div className='mt-10  flex flex-col '>
                    <div className="flex items-center mx-auto container px-4  justify-between mb-10">
                        <h2 className="text-3xl sm:text-5xl font-bold text-[#339ca0]">
                            Our Blogs
                        </h2>

                        <button
                            onClick={() => navigate("/blogs")}
                            className="bg-gradient-to-r from-[#339ca0] to-black text-white
             sm:px-4 sm:py-2 px-2 py-1 text-[18px] sm:text-[18px]
             rounded font-medium transition-all hover:bg-gray-800"
                        >
                            View All →
                        </button>

                    </div>

                    <StudentCardMarquee />
                </div>

                <OurCourses />

                <WhoWeAre />
                <KnowlegeBaseSection />
                {/* <Whatparticipantssay /> */}
                <OurIndustryExperts />
                <WhatsAppGroupSection />
                {/* <AppDownloadSection/> */}
                <Footer />

            </div>
        </>
    );
}
