import React, { useEffect, useState } from "react";
import axios from "../../utils/axios.js";
import Navbar from "../../components/layout/navbar/navbar";
import Footer from "../../components/layout/footer/footer";
import { HallOfFameCards } from "../../components/ui/cards/cards";

export default function HallOfFamepage() {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMentorsWithSessions = async () => {
            try {
                setLoading(true);
                
                const { data } = await axios.get("/users/mentors/with-sessions");

                const mentorList = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data)
                        ? data.data
                        : [];

                setMentors(mentorList);
                console.log("Fetched Mentor Users with Sessions:", mentorList);
            } catch (err) {
                console.error("Error fetching mentors:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMentorsWithSessions();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto font-[Poppins]">
                <div className="px-4 py-10">
                    <div className="text-center">Loading mentors...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto font-[Poppins]">
            <div className="px-4 py-10">
                <h1 className="text-4xl font-extrabold text-center">LIVE MENTORSHIP</h1>
                <div className="w-40 h-1 bg-black mx-auto my-2"></div>
                <p className="text-center text-gray-600 mb-8">
                    Connect with our expert mentors
                </p>

                <div className="flex flex-wrap justify-center gap-9 mt-10">
                    {mentors.length > 0 ? (
                        mentors.map((mentor, index) => (
                            <div key={index} className="w-full max-w-sm">
                                <HallOfFameCards speaker={mentor} />

                                {/* Mentor के Sessions Display */}
                                {/* {mentor.sessions && mentor.sessions.length > 0 && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                        <h3 className="font-semibold text-lg mb-3 text-center">
                                            Available Sessions ({mentor.sessionCount || mentor.sessions.length})
                                        </h3>
                                        <div className="space-y-3">
                                            {mentor.sessions.map((session, sessionIndex) => (
                                                <div key={session._id || sessionIndex} className="p-3 bg-white border rounded-lg shadow-sm">
                                                    <h4 className="font-medium text-blue-600 text-sm">
                                                        {session.courseTitle}
                                                    </h4>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {session.courseDescription}
                                                    </p>
                                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                                        <span>
                                                            {session.selectDate} • {session.startTime} - {session.endTime}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded ${
                                                            session.paymentType === 'Free' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {session.paymentType}
                                                        </span>
                                                    </div>
                                                    {session.fees && session.fees !== "" && (
                                                        <div className="text-xs font-medium mt-1 text-right">
                                                            Fees: ₹{session.fees}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">
                            No mentors found
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}