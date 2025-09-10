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
                <Navbar/>
                <HeroSection />
                <MarqueeTagCards />
                <StudentCardMarquee />
                <OurCourses />
                <OurFreeCourses/>
                <WhoWeAre/>
                <Whatparticipantssay/>
                <OurIndustryExperts/>
                <WhatsAppGroupSection/>
                <AppDownloadSection/>
                <Footer/> 
                


            </div>
        </>
    );
}
