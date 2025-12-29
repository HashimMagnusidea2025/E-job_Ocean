
import StatsSection from "../../components/layout/section/StatsSection/StatsSection";
import MissionVision from "../../components/layout/section/MissionVision/MissionVision";
import JourneyTimeline from "../../components/layout/section/JourneyTimeline/JourneyTimeline";
import HowWeDoIt from "../../components/layout/section/HowWeDoIt/HowWeDoIt";
import UniquePedagogy from "../../components/layout/section/UniquePedagogy/UniquePedagogy";
import OurFounders from "../../components/layout/section/OurFounders/OurFounders";
import IndustryExperts from "../../components/layout/section/IndustryExperts/IndustryExperts";
import AlumniCompanies from "../../components/layout/section/AlumniCompanies/AlumniCompanies";

export default function AboutUs() {

    return (
        <>
            <div className="w-full font-[Poppins]">
                
                <div>
                    <StatsSection />

                </div>
                <div className="container mx-auto">
                    <MissionVision />
                </div>
                {/* <div className="container mx-auto">
                    <JourneyTimeline />

                </div> */}
                {/* <div className="container mx-auto">
                    <HowWeDoIt />

                </div> */}
                
                <div className="container mx-auto">
                    <OurFounders/>

                </div>
                {/* <div className="">
                    <IndustryExperts/>
                </div> */}
                {/* <div className="container mx-auto">
                    <AlumniCompanies/>
                </div> */}
            </div>




        </>
    )
}