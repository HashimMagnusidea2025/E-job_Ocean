import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../utils/axios.js";
import { FaLinkedin, FaUserTie, FaBriefcase, FaBuilding, FaChalkboardTeacher } from "react-icons/fa";
const baseURL = import.meta.env.VITE_BACKEND_URL;
import DateTimeSelection from "../../components/ui/DateTimeSelection/DateTimeSelection.jsx";
import RegisterHallOfFame from "./RegisterHallOfFame.jsx";

export default function SpeakerDetailsPage() {
    const { speakerId } = useParams();
    const [speaker, setSpeaker] = useState(null);
    const [userType, setUserType] = useState(''); // 'speaker' or 'mentor'
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                // Pehle speaker ki tarah try karo
                try {
                    const { data } = await axios.get(`/speakers/${speakerId}`);
                    setSpeaker(data);
                    setUserType('speaker');
                    console.log("Fetched Speaker:", data);
                } catch (speakerErr) {
                    console.log("Not a speaker, trying mentor...");

                    // Agar speaker nahi mila toh mentor ki tarah try karo
                    const { data } = await axios.get(`/users/mentors/${speakerId}`);
                    setSpeaker(data);
                    setUserType('mentor');
                    console.log("Fetched Mentor:", data);
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchUserDetails();
    }, [speakerId]);

    if (!speaker) return <p>Loading...</p>;

    const fullName = `${speaker.firstName} ${speaker.lastName}`;

    return (
        <div className="container mx-auto font-[Poppins] p-6 pt-10">
            {/* User Type Badge */}
            <div className="mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${userType === 'mentor'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                    }`}>
                    {userType === 'mentor' ? (
                        <>
                            <FaChalkboardTeacher className="mr-1" />
                            Mentor
                        </>
                    ) : (
                        <>
                            <FaUserTie className="mr-1" />
                            Speaker
                        </>
                    )}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                {/* User Profile Card */}
                <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center">
                    {/* <img
                        src={speaker.profilePicture || speaker.profilePic ? 
                            `${baseURL}/${speaker.profilePicture || speaker.profilePic}` 
                            : "/default-avatar.png"}
                        alt={fullName}
                        className="w-72 h-80 object-cover rounded-lg shadow-md"
                    /> */}
                    <img
                        src={
                            speaker.profilePicture || speaker.profilePic
                                ? `${baseURL}/${speaker.profilePicture || speaker.profilePic}`
                                : "/default-avatar.png"
                        }
                        alt={fullName}
                        className="w-72 h-80 object-cover object-top rounded-lg shadow-md"
                    />

                    <h1 className="text-2xl font-bold mt-4">
                        {fullName}
                    </h1>

                    {/* Bio/Description */}
                    <p className="mt-2 text-gray-600 text-center">
                        {userType === "mentor"
                            ? speaker.des || "No description available"
                            : speaker.description || "No description available"}
                    </p>


                    {/* Expertise and Details */}
                    <div className="mt-4 space-y-2 w-full">
                        {speaker.expertise && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <FaUserTie className="text-orange-500" />
                                <span>{speaker.expertise}</span>
                            </div>
                        )}

                        {speaker.qualification && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <FaBriefcase className="text-yellow-500" />
                                <span>{speaker.qualification}</span>
                            </div>
                        )}

                        {speaker.experience && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <FaBuilding className="text-orange-400" />
                                <span>{speaker.experience} experience</span>
                            </div>
                        )}
                    </div>

                    {/* LinkedIn Button */}
                    {speaker.linkedin && (
                        <a
                            href={speaker.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-5 inline-flex items-center gap-2 px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                        >
                            <FaLinkedin /> LinkedIn
                        </a>
                    )}
                </div>

                {/* Calendar and Sessions Section */}
                <div>

                    {/* {userType === 'mentor' && speaker.sessions && speaker.sessions.length > 0 && (
                        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-4 text-purple-700 flex items-center">
                                <FaChalkboardTeacher className="mr-2" />
                                Available Mentor Sessions
                            </h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {speaker.sessions.map((session) => (
                                    <div key={session._id} className="p-3 border border-purple-200 rounded-lg bg-purple-50">
                                        <h4 className="font-semibold text-purple-800">{session.courseTitle}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{session.courseDescription}</p>
                                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                                            <span>{session.selectDate} • {session.startTime} - {session.endTime}</span>
                                            <span className={`px-2 py-1 rounded ${session.paymentType === 'Free'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {session.paymentType}
                                            </span>
                                        </div>
                                        {session.fees && session.fees !== "" && (
                                            <div className="text-right mt-1">
                                                <span className="text-sm font-bold">₹{session.fees}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}

                    {/* DateTime Selection for Booking */}
                    <DateTimeSelection
                        speakerId={userType === 'speaker' ? speakerId : null}
                        mentorId={userType === 'mentor' ? speakerId : null}
                        userType={userType} // Pass user type to DateTimeSelection
                        onContinue={(slot) => {
                            setSelectedSlot(slot);
                            setIsRegisterOpen(true);
                        }}
                    />
                </div>
            </div>

            {/* Registration Modal */}
            <RegisterHallOfFame
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                webinarId={speakerId}
                userType={userType} // Pass user type to registration
                webinarType={userType === 'mentor' ? "one-to-one-mentor" : "one-to-one"}
                selectedSlot={selectedSlot}
                userData={speaker} // Pass complete user data
            />
        </div>
    );
}