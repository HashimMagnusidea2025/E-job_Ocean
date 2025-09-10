
import MasterclassCombo from "../../components/layout/section/MasterclassCombo/MasterclassCombo";
import { MarqueeTagCards } from "../../components/cards/cards";
import { StudentCardMarquee } from "../../components/cards/cards";
import PackageIncludes from "../../components/layout/section/PackageIncludes/PackageIncludes";
import CompletionCertificate from "../../components/layout/section/CompletionCertificate/CompletionCertificate";
import WhoCanApply from '../../components/layout/section/WhoCanApply/WhoCanApply';
import WhatParticipantssay from "../../components/layout/section/Whatparticipantssay/Whatparticipantssay";
import BonusSection from "../../components/layout/section/BonusSection/BonusSection";
import Countersection from "../../components/layout/section/countersection/countersection";
import { WhatsAppGroupSection } from "../../components/layout/section/WhatsAppGroupSection/WhatsAppGroupSection";
import PlacementProgramSection from "../../components/layout/section/AppDownloadSection/AppDownloadSection";

export default function ComboIncludesPage() {


    return (
        <>
            <div className="max-w-[1440px] bg-[linear-gradient(to_right,_#090A47,_#20AEB2)] to-black mx-auto">
                <MasterclassCombo />


                <div className="bg-white flex justify-center flex-col items-center">
                    <h2 className="text-[39px] font-bold pt-20">
                        OUR ALUMNI PLACED IN 100+ TOP COMPANIES
                    </h2>

                    <MarqueeTagCards />
                    <StudentCardMarquee />

                </div>

                <div>
                    <PackageIncludes />
                </div>

                <div className="bg-gray-50">
                    <CompletionCertificate />

                </div>

                <div className="flex justify-center flex-col items-center bg-gray-50 pt-20">
                    <h2 className="text-[47.2px] text-[#339ca0] font-bold">
                        Who Should Join
                    </h2>
                    <WhoCanApply />
                </div>

                <div>
                    <WhatParticipantssay />

                </div>

                <div>
                    <BonusSection />
                </div>

                <div>
                    <Countersection />
                </div>
                <div>
                    <WhatsAppGroupSection/>
                </div>
                <div>
                    <PlacementProgramSection/>
                </div>







            </div>



        </>
    )
}