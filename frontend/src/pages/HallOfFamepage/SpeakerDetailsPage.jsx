import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../utils/axios.js";
import { FaLinkedin, FaUserTie, FaBriefcase, FaBuilding, FaChalkboardTeacher } from "react-icons/fa";
const baseURL = import.meta.env.VITE_BACKEND_URL;
import DateTimeSelection from "../../components/ui/DateTimeSelection/DateTimeSelection.jsx";
import RegisterHallOfFame from "./RegisterHallOfFame.jsx";
import { useLocation } from "react-router-dom";
import { FollowSocials, FollowSocialsRow } from "../../components/ui/cards/cards.jsx";

export default function SpeakerDetailsPage() {
    const { speakerId } = useParams();
    const [speaker, setSpeaker] = useState(null);
    const [userType, setUserType] = useState('');
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [hasSessions, setHasSessions] = useState(false);



    const location = useLocation();
    const preselectedSlot = location.state?.preselectedSlot;

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {

                try {
                    const { data } = await axios.get(`/speakers/${speakerId}`);
                    setSpeaker(data);
                    setUserType('speaker');
                    console.log("Fetched Speaker:", data);
                } catch (speakerErr) {
                    console.log("Not a speaker, trying mentor...");


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

    useEffect(() => {
        const checkSessions = async () => {
            if (!speaker || !userType) return;

            try {
                let endpoint = "";
                if (userType === 'speaker') {
                    endpoint = `/one-to-one/speaker/${speakerId}`;
                } else if (userType === 'mentor') {
                    endpoint = `/one-to-one/mentor/${speakerId}`;
                }

                if (endpoint) {
                    const response = await axios.get(endpoint);
                    setHasSessions(response.data.length > 0);
                }
            } catch (err) {
                console.error("Error checking sessions:", err);
                setHasSessions(false);
            }
        };

        checkSessions();
    }, [speaker, userType, speakerId]);

    if (!speaker) return <p>Loading...</p>;

    const fullName = `${speaker.firstName} ${speaker.lastName}`;



    return (
        <div className="container mx-auto font-[Poppins] p-6 pt-10">
            {hasSessions ? (
                <>

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

                        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center">

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


                            <div
                                className="mt-2 text-gray-600  prose prose-blue max-w-none leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        userType === "mentor"
                                            ? speaker.des || "<p>No description available</p>"
                                            : speaker.description || "<p>No description available</p>",
                                }}
                            ></div>

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

                        <div>



                            <DateTimeSelection
                                speakerId={userType === 'speaker' ? speakerId : null}
                                mentorId={userType === 'mentor' ? speakerId : null}
                                userType={userType} // Pass user type to DateTimeSelection
                                preselectedSlot={preselectedSlot}
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
                        webinarId={speakerId}
                        userType={userType}
                        webinarType={userType === 'mentor' ? "one-to-one-mentor" : "one-to-one"}
                        selectedSlot={selectedSlot}
                        userData={speaker}
                    />


                </>
            ) : (
                <>

                    <div className="container mx-auto bg-white rounded-2xl shadow-lg p-8">

                        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">

                            {/* LEFT IMAGE */}
                            <div className="shrink-0">
                                <img
                                    src={
                                        speaker.profilePicture || speaker.profilePic
                                            ? `${baseURL}/${speaker.profilePicture || speaker.profilePic}`
                                            : "/default-avatar.png"
                                    }
                                    alt={fullName}
                                    className="w-48 h-48 md:w-56 md:h-56 object-cover object-top rounded-xl shadow-md"
                                />
                            </div>


                            <div className="flex-1 text-center md:text-left ">
                                <div className="mt-3">
                                    <span
                                        className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${userType === "mentor"
                                            ? "bg-purple-100 text-purple-800"
                                            : "bg-blue-100 text-blue-800"
                                            }`}
                                    >
                                        {userType === "mentor" ? (
                                            <>
                                                <FaChalkboardTeacher className="mr-2" />
                                                Mentor
                                            </>
                                        ) : (
                                            <>
                                                <FaUserTie className="mr-2" />
                                                Speaker
                                            </>
                                        )}
                                    </span>
                                </div>
                                {/* NAME */}
                                <h1 className="text-3xl font-bold text-gray-900 mt-1">
                                    {speaker.
                                        salutation}  {fullName}
                                </h1>
                                <div className="mt-1"
                                    dangerouslySetInnerHTML={{
                                        __html: speaker.introduction || "<p>No introduction available</p>",
                                    }}
                                ></div>


                            </div>
                        </div>
                        <div className="mt-10">
                            <div
                                className="mt-2 text-gray-600  prose prose-blue max-w-none leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        userType === "mentor"
                                            ? speaker.des || "<p>No description available</p>"
                                            : speaker.description || "<p>No description available</p>",
                                }}
                            ></div>
                        </div>





                    </div>
                    <div className="">
                        <div className="max-w-lg mx-auto">
                            <FollowSocialsRow />
                        </div>
                    </div>
                </>
            )}

        </div>
    );
}