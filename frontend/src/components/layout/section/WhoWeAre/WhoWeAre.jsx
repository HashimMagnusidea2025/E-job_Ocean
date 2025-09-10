import { FaBookOpen, FaTools, FaChalkboardTeacher, FaBriefcase } from "react-icons/fa";

export default function WhoWeAre() {
    return (
        <div className="bg-[#1d1d1d] text-white py-12 px-4 font-[Poppins]">
            <div className="container mx-auto">
                <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row items-start gap-10">


                    <div className="flex-1">
                        <h2 className="text-[40px] font-bold mb-8">
                            Who <span className="text-[#339ca0]">We Are...</span>
                        </h2>

                        <div className="relative pl-10">
                            {/* <div className="absolute top-6 left-5 h-[calc(100%-30px)] border-l-2 border-dotted border-orange-500"></div> */}

                            <div className="mb-8 flex items-center gap-4">
                                <div className="bg-[#339ca0] rounded-full p-2 text-white text-xl">
                                    <FaBookOpen />
                                </div>
                                <p className="text-white font-medium">One-Stop Learning Platform For Finance</p>
                            </div>

                            <div className="mb-8 flex items-center gap-4">
                                <div className="bg-[#339ca0] rounded-full p-2 text-white text-xl">
                                    <FaTools />
                                </div>
                                <p className="text-white font-medium">Hands-on Training for Practical Skills</p>
                            </div>

                            <div className="mb-8 flex items-center gap-4">
                                <div className="bg-[#339ca0] rounded-full p-2 text-white text-xl">
                                    <FaChalkboardTeacher />
                                </div>
                                <p className="text-white font-medium">Mentorship from Industry Experts</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="bg-[#339ca0] rounded-full p-2 text-white text-xl">
                                    <FaBriefcase />
                                </div>
                                <p className="text-white font-medium">Placement in Leading Firms & MNCs</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <div className="w-full aspect-video rounded-lg overflow-hidden border border-white">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                                title="eJob Ocean"

                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
