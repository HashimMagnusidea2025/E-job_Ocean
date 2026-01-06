import React, { useEffect, useState } from "react";
import axios from "../../utils/axios.js";
import Navbar from "../../components/layout/navbar/navbar";
import Footer from "../../components/layout/footer/footer";
import { HallOfFameCards } from "../../components/ui/cards/cards";

export default function HallOfFamepage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('mentors');

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             setLoading(true);
    //             let endpoint = "";
    //             if (activeTab === 'mentors') {
    //                 endpoint = "/users/mentors/with-sessions";
    //             } else if (activeTab === 'speakers') {
    //                 endpoint = "/one-to-one";
    //             }

    //             const { data: response } = await axios.get(endpoint);

    //             let list = Array.isArray(response)
    //                 ? response
    //                 : Array.isArray(response.data)
    //                     ? response.data
    //                     : [];

    //             if (activeTab === 'speakers') {
    //                 // Filter speakers who have one-to-one sessions
    //                 list = list.filter(speaker => speaker.hasOneToOneSession);

    //                 // Fetch sessions for each speaker
    //                 const speakersWithSessions = await Promise.all(
    //                     list.map(async (speaker) => {
    //                         try {
    //                             const sessionRes = await axios.get(`/one-to-one/speaker/${speaker._id}`);
    //                             return { ...speaker, sessions: sessionRes.data };
    //                         } catch (err) {
    //                             console.error(`Error fetching sessions for speaker ${speaker._id}:`, err);
    //                             return { ...speaker, sessions: [] };
    //                         }
    //                     })
    //                 );
    //                 list = speakersWithSessions;
    //             }

    //             setData(list);
    //             console.log(`Fetched ${activeTab}:`, list);
    //         } catch (err) {
    //             console.error(`Error fetching ${activeTab}:`, err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, [activeTab]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 🔹 MENTORS
                if (activeTab === "mentors") {
                    const res = await axios.get("/users/mentors/with-sessions");
                    setData(Array.isArray(res.data) ? res.data : []);
                }

                // 🔹 SPEAKERS + ONE TO ONE SESSIONS
                if (activeTab === "speakers") {
                    const res = await axios.get("/one-to-one");

                    // Group sessions by Speaker
                    const speakerMap = {};

                    res.data.forEach((session) => {
                        const speaker = session.Speaker;
                        if (!speaker) return;

                        if (!speakerMap[speaker._id]) {
                            speakerMap[speaker._id] = {
                                ...speaker,
                                sessions: [],
                            };
                        }

                        speakerMap[speaker._id].sessions.push(session);
                    });

                    setData(Object.values(speakerMap));
                }

            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    if (loading) {
        return (
            <div className="container mx-auto font-[Poppins]">
                <div className="px-4 py-10">
                    <div className="text-center">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto font-[Poppins]">
            <div className="px-4 py-10">
                <h1 className="text-4xl font-extrabold text-center">MENTORSHIP</h1>
                <div className="w-40 h-1 bg-black mx-auto my-2"></div>
                <p className="text-center text-gray-600 mb-8">
                    Connect with our expert mentors and speakers
                </p>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <button
                        onClick={() => setActiveTab('speakers')}
                        className={`px-6 py-2 mx-2 rounded-lg font-medium transition ${activeTab === 'speakers'
                            ? 'bg-black text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Speakers
                    </button>
                    <button
                        onClick={() => setActiveTab('mentors')}
                        className={`px-6 py-2 mx-2 rounded-lg font-medium transition ${activeTab === 'mentors'
                            ? 'bg-black text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Mentors
                    </button>

                </div>

                <div className="flex flex-wrap justify-center gap-9 mt-10">
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <div key={index} className="">
                                <HallOfFameCards speaker={item} noClick={activeTab === 'speakers'} />

                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">
                            No {activeTab} found
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}