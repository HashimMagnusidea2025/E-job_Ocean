import Navbar from '../../components/layout/navbar/navbar';
import HeroSection from '../../components/layout/header/header';
import { StudentCardMarquee, MarqueeTagCards, OurCourses } from '../../components/cards/cards';

import WhoWeAre from '../../components/layout/section/WhoWeAre/WhoWeAre';
import Whatparticipantssay from '../../components/layout/section/Whatparticipantssay/Whatparticipantssay';

import OurIndustryExperts from '../../components/layout/section/OurIndustryExperts/OurIndustryExperts'

import { WhatsAppGroupSection } from '../../components/layout/section/WhatsAppGroupSection/WhatsAppGroupSection';
import AppDownloadSection from '../../components/layout/section/AppDownloadSection/AppDownloadSection';
import OurFreeCourses from '../../components/layout/section/OurFreeCourses/OurFreeCourses';

import Footer from '../../components/layout/footer/footer';
export default function Home() {
    return (
        <>
            <div className='w-full font-[Poppins]'>
                <Navbar />
                <HeroSection />
                {/* <MarqueeTagCards /> */}
                <div className='mt-14  flex flex-col items-center justify-center'>
                    <h2 className='text-5xl mb-10 font-bold text-[#339ca0]'>Our Blogs</h2>
                    <StudentCardMarquee />
                </div>

                <OurCourses />
                <OurFreeCourses />
                <WhoWeAre />
                <Whatparticipantssay />
                <OurIndustryExperts />
                <WhatsAppGroupSection />
                {/* <AppDownloadSection/> */}
                <Footer />



            </div>
        </>
    );
}
