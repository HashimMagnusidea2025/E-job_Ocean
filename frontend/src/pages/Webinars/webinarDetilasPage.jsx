import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios.js";
import Navbar from "../../components/layout/navbar/navbar";
import Footer from "../../components/layout/footer/footer";
import { CommentList, FollowSocials, SubscribeNow, Categories, LatestPost } from "../../components/ui/cards/cards.jsx";
const baseURL = import.meta.env.VITE_BACKEND_URL; // Vite
// या CRA में: const baseURL = process.env.REACT_APP_BACKEND_URL;
import { IoTimeSharp } from "react-icons/io5";
import { FaCalendarAlt, FaUserTie } from "react-icons/fa";
import { LuIndianRupee } from "react-icons/lu";
import { MdOutlineOndemandVideo } from "react-icons/md";
import RegisterModal from "./RegisterModal.jsx";
const WebinarDetailsPage = () => {
    const { id } = useParams();
    const { slug } = useParams(); // ✅ Change from id to slug
    const [webinar, setWebinar] = useState(null);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const openRegisterModal = () => setIsRegisterOpen(true);
    const closeRegisterModal = () => setIsRegisterOpen(false);


    useEffect(() => {
        const fetchWebinar = async () => {
            try {
                const { data } = await axios.get(`/webinars/slug/${slug}`);
                setWebinar(data);
                console.log(data);

            } catch (err) {
                console.error("Error fetching webinar:", err);
            }
        };
        fetchWebinar();
    }, [slug]);

    if (!webinar) {
        return <p className="text-center mt-10">Loading...</p>;
    }
    const now = new Date();
    const start = new Date(webinar.WebinarStartDateTime);
    const end = new Date(webinar.WebinarEndDateTime);
    console.log(start);
    console.log(end);



    const isUpcoming = end > now;
    console.log(isUpcoming);
    
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    const convertToOrderedList = (htmlContent) => {
        // Remove Quill span tags
        let cleanContent = htmlContent
            .replace(/<span class="ql-ui"[^>]*><\/span>/g, "")
            .replace(/<span class="ql-cursor"[^>]*>.*?<\/span>/g, "");

        // Convert line breaks to list items
        // Assuming each line is a list item
        const lines = cleanContent.split('<br>').filter(line => line.trim());

        if (lines.length > 0) {
            const listItems = lines.map(line =>
                `<li class="mb-2">${line.trim()}</li>`
            ).join('');
            return `<ol class="list-decimal list-inside space-y-2">${listItems}</ol>`;
        }

        return cleanContent;
    };

    const getWebinarImage = (webinar) => {
        // ✅ Multiple speakers → WebinarImage
        if (webinar.Speakers && webinar.Speakers.length > 1 && webinar.WebinarImage) {
            return `${baseURL}${webinar.WebinarImage}`;
        }

        // ✅ Single speaker → Speaker profilePic
        if (
            webinar.Speakers &&
            webinar.Speakers.length === 1 &&
            webinar.Speakers[0].profilePic
        ) {
            return `${baseURL}/${webinar.Speakers[0].profilePic}`;
        }


    };
    return (
        <div className="w-full font-[Poppins] bg-gray-50">
            <Navbar />

            <div className="font-[Poppins] bg-gray-50">
                {/* 🔹 Social Share */}


                {/* Main Layout */}
                <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-2">

                        <div className="flex flex-col md:flex-row bg-white p-4 md:p-6 shadow-sm rounded-2xl">
                            {/* Speaker Image */}
                            <div className="w-full md:w-1/3 bg-gray-300 aspect-[16/9] md:aspect-[4/5] rounded-xl mb-4 md:mb-0 md:mr-6 overflow-hidden">
                                <img
                                    // src={
                                    //     webinar.Speakers?.profilePic
                                    //         ? `${baseURL}/${webinar.Speakers?.profilePic}`
                                    //         : "/default-speaker.png"
                                    // }
                                    // alt={`${webinar.Speakers?.firstName} ${webinar.Speakers?.lastName}`}
                                    src={getWebinarImage(webinar)}
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>

                            {/* Webinar Title + Intro */}
                            <div className="flex flex-col justify-center w-full md:w-2/3">
                                <h2 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-[35px] leading-snug mb-3">
                                    {webinar.Speakers.salutation} {webinar.Speakers.firstName} {webinar.Speakers.lastName}
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {webinar.Speakers?.introduction}
                                </p>
                            </div>
                        </div>

                        <div className="prose max-w-none text-gray-700 mb-4 mt-5">
                            <p>{webinar.Introduction || "No Introduction available."}</p>
                        </div>



                        <div className="p-6 mb-6 rounded-xl ">
                            <div className="p-6 mb-6 rounded-xl">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    TAKEAWAYS
                                </h2>

                                <div
                                    className="prose max-w-none mt-4 text-gray-700"
                                    dangerouslySetInnerHTML={{
                                        __html: convertToOrderedList(webinar.Keywords)
                                    }}
                                />
                            </div>


                            {/* <p className="text-gray-600 mb-3 leading-relaxed">
                                {webinar.Introduction || "No introduction available."}
                            </p>

                            <div className="prose max-w-none mt-4">
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    {webinar.Description || "No description available."}
                                </p>
                            </div> */}

                            {/* <div className="mt-6 space-y-2 text-sm text-gray-500">
                                <p>
                                    <span className="font-medium text-gray-700">Start:</span>{" "}
                                    {new Date(webinar.WebinarStartDateTime).toLocaleString("en-US", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </p>
                                <p>
                                    <span className="font-medium text-gray-700">End:</span>{" "}
                                    {new Date(webinar.WebinarEndDateTime).toLocaleString("en-US", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </p>
                            </div> */}
                        </div>

                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 mb-6 rounded-2xl">
                            {/* Webinar Title */}
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">{webinar.WebinarTitle}</h2>

                            {/* Description */}
                            <div className="prose max-w-none mt-2 text-gray-700">
                                <p>{webinar.Description || "No description available."}</p>
                            </div>

                            {/* Webinar Info (Start/End/Duration) */}
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt className="text-blue-500 w-5 h-5" />
                                    <span>
                                        <strong>Start:</strong>
                                        {new Date(webinar.WebinarStartDateTime).toLocaleString("en-US", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <IoTimeSharp className="text-green-500 w-5 h-5" />
                                    <span>
                                        <strong>End:</strong>
                                        {new Date(webinar.WebinarEndDateTime).toLocaleString("en-US", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </span>
                                </div>

                            </div>
                            <div className="mt-6 flex items-center justify-center">
                                {!isUpcoming && (
                                    <button
                                        onClick={openRegisterModal}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                                    >
                                        Register Now
                                    </button>
                                )}
                            </div>

                        </div>

                        {/* <SubscribeNow /> */}
                    </div>
                </div>
            </div>

            <Footer />
            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={closeRegisterModal}
                webinarId={webinar._id}
                webinarType={webinar.WebinarType} // or "free"/"paid" depending on your data
            />

        </div>
    );
};

export default WebinarDetailsPage;
