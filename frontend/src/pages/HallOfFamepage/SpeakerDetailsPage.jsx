import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../utils/axios.js";
import { FaLinkedin, FaUserTie, FaBriefcase, FaBuilding } from "react-icons/fa";

import DateTimeSelection from "../../components/ui/DateTimeSelection/DateTimeSelection.jsx";
import RegisterHallOfFame from "./RegisterHallOfFame.jsx";
export default function SpeakerDetailsPage() {
    const { speakerId } = useParams();
    const [speaker, setSpeaker] = useState(null);

    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        const fetchSpeaker = async () => {
            try {
                const { data } = await axios.get(`/speakers/${speakerId}`);
                setSpeaker(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSpeaker();
    }, [speakerId]);

    if (!speaker) return <p>Loading...</p>;

    return (
        <div className="container mx-auto font-[Poppins] p-6 pt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">


                <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center">
                    <img
                        src={speaker.profilePic ? `http://localhost:5000/${speaker.profilePic}` : "/default-avatar.png"}
                        alt={speaker.firstName}
                        className="w-72 h-80 object-cover rounded-lg shadow-md"
                    />
                    <h1 className="text-2xl font-bold mt-4">
                        {speaker.firstName} {speaker.lastName}
                    </h1>
                    <p className="mt-2 text-gray-600 text-center">{speaker.description}</p>


                    {/* <div className="mt-4 space-y-2 w-full">
                        <div className="flex items-center gap-2 text-gray-700">
                            <FaUserTie className="text-orange-500" />
                            <span>{speaker.expertise || "Indirect Tax Expert | GST Consultant | FCA"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <FaBriefcase className="text-yellow-500" />
                            <span>{speaker.experience || "GST | Tax & Regulatory Services | 8+ years Experience"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <FaBuilding className="text-orange-400" />
                            <span>{speaker.companies || "Coca-Cola | Deloitte | Airtel | Baker Tilly DHC"}</span>
                        </div>
                    </div> */}


                    <a
                        href={speaker.linkedin || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                    >
                        <FaLinkedin /> LinkedIn
                    </a>
                </div>

                <div>
                    <DateTimeSelection speakerId={speakerId}
                        onContinue={(slot) => {
                            setSelectedSlot(slot);
                            setIsRegisterOpen(true);
                        }}
                    />
                </div>


            </div>

            <RegisterHallOfFame
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                webinarId={speakerId} // ya actual webinarId agar backend se aa raha ho
                webinarType="one-to-one"
                selectedSlot={selectedSlot}
            />
        </div>
    );
}
