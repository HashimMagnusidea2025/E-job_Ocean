// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "../../utils/axios.js";
// import Navbar from "../../components/layout/navbar/navbar";
// import Footer from "../../components/layout/footer/footer";
// import { CommentList, FollowSocials, SubscribeNow, Categories, LatestPost } from "../../components/ui/cards/cards.jsx";
// const baseURL = import.meta.env.VITE_BACKEND_URL; // Vite
// // या CRA में: const baseURL = process.env.REACT_APP_BACKEND_URL;
// import { IoTimeSharp } from "react-icons/io5";
// import { FaCalendarAlt, FaUserTie } from "react-icons/fa";
// import { LuIndianRupee } from "react-icons/lu";
// import { MdOutlineOndemandVideo } from "react-icons/md";
// import RegisterModal from "./RegisterModal.jsx";
// const WebinarDetailsPage = () => {
//     const { id } = useParams();
//     const { slug } = useParams(); // ✅ Change from id to slug
//     const [webinar, setWebinar] = useState(null);
//     const [oneToOneSessions, setOneToOneSessions] = useState([]);
//     const [isRegisterOpen, setIsRegisterOpen] = useState(false);
//     const [showFullDesc, setShowFullDesc] = useState(false);

//     const openRegisterModal = () => setIsRegisterOpen(true);
//     const closeRegisterModal = () => setIsRegisterOpen(false);


//     useEffect(() => {
//         const fetchWebinar = async () => {
//             try {
//                 const { data } = await axios.get(`/webinars/slug/${slug}`);
//                 setWebinar(data);
//                 console.log(data);

//             } catch (err) {
//                 console.error("Error fetching webinar:", err);
//             }
//         };
//         fetchWebinar();
//     }, [slug]);

//     useEffect(() => {
//         if (webinar && webinar.Speakers && webinar.Speakers.length > 0) {
//             const speakerId = webinar.Speakers[0]._id;
//             const fetchOneToOne = async () => {
//                 try {
//                     const { data } = await axios.get(`/one-to-one/speaker/${speakerId}`);
//                     setOneToOneSessions(data);
//                 } catch (err) {
//                     console.error("Error fetching one-to-one sessions:", err);
//                 }
//             };
//             fetchOneToOne();
//         }
//     }, [webinar]);

//     if (!webinar) {
//         return <p className="text-center mt-10">Loading...</p>;
//     }
//     // const now = new Date();
//     // const start = new Date(webinar.WebinarStartDateTime);
//     // const end = new Date(webinar.WebinarEndDateTime);
//     // console.log(start);
//     // console.log(end);



//     // const isUpcoming = end > now;
//     // console.log(isUpcoming);
//     const now = new Date();
//     const start = new Date(webinar.WebinarStartDateTime);
//     const end = new Date(webinar.WebinarEndDateTime);

//     const isUpcoming = start > now; // ✅ SAME as WebinarCardsList
//     const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
//     const convertToOrderedList = (htmlContent) => {
//         // Remove Quill span tags
//         let cleanContent = htmlContent
//             .replace(/<span class="ql-ui"[^>]*><\/span>/g, "")
//             .replace(/<span class="ql-cursor"[^>]*>.*?<\/span>/g, "");

//         // Convert line breaks to list items
//         // Assuming each line is a list item
//         const lines = cleanContent.split('<br>').filter(line => line.trim());

//         if (lines.length > 0) {
//             const listItems = lines.map(line =>
//                 `<li class="mb-2">${line.trim()}</li>`
//             ).join('');
//             return `<ol class="list-decimal list-inside space-y-2">${listItems}</ol>`;
//         }

//         return cleanContent;
//     };

//     const getWebinarImage = (webinar) => {
//         // ✅ Multiple speakers → WebinarImage
//         if (webinar.Speakers && webinar.Speakers.length > 1 && webinar.WebinarImage) {
//             return `${baseURL}${webinar.WebinarImage}`;
//         }

//         // ✅ Single speaker → Speaker profilePic
//         if (
//             webinar.Speakers &&
//             webinar.Speakers.length === 1 &&
//             webinar.Speakers[0].profilePic
//         ) {
//             return `${baseURL}/${webinar.Speakers[0].profilePic}`;
//         }

//     };

//     return (
//         <div className="w-full font-[Poppins] bg-gray-50">
//             <Navbar />

//             <div className="font-[Poppins] bg-gray-50">


//                 <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
//                     {/* LEFT CONTENT */}
//                     <div className="lg:col-span-2">

//                         <div className="flex flex-col md:flex-row bg-white p-4 md:p-6 shadow-sm rounded-2xl">
//                             {/* Speaker Image */}
//                             <div className="w-full md:w-1/3 bg-gray-300 aspect-[16/9] md:aspect-[4/5] rounded-xl mb-4 md:mb-0 md:mr-6 overflow-hidden">
//                                 <img
//                                     // src={
//                                     //     webinar.Speakers?.profilePic
//                                     //         ? `${baseURL}/${webinar.Speakers?.profilePic}`
//                                     //         : "/default-speaker.png"
//                                     // }
//                                     // alt={`${webinar.Speakers?.firstName} ${webinar.Speakers?.lastName}`}
//                                     src={getWebinarImage(webinar)}
//                                     className="w-full h-full object-cover rounded-xl"
//                                 />
//                             </div>

//                             {/* Webinar Title + Intro */}
//                             <div className="flex flex-col justify-center w-full md:w-2/3">
//                                 <h2 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-[35px] leading-snug mb-3">
//                                     {webinar.Speakers.salutation} {webinar.Speakers.firstName} {webinar.Speakers.lastName}
//                                 </h2>
//                                 <p className="text-gray-600 leading-relaxed">
//                                     {webinar.Speakers?.introduction}
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="prose max-w-none text-gray-700 mb-4 mt-5">
//                             <p>{webinar.Introduction || "No Introduction available."}</p>
//                         </div>



//                         <div className="p-6 mb-6 rounded-xl ">
//                             <div className="p-6 mb-6 rounded-xl">
//                                 <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//                                     TAKEAWAYS
//                                 </h2>

//                                 <div
//                                     className="prose max-w-none mt-4 text-gray-700"
//                                     dangerouslySetInnerHTML={{
//                                         __html: convertToOrderedList(webinar.Keywords)
//                                     }}
//                                 />
//                             </div>


//                             {/* <p className="text-gray-600 mb-3 leading-relaxed">
//                                 {webinar.Introduction || "No introduction available."}
//                             </p>

//                             <div className="prose max-w-none mt-4">
//                                 <p className="text-gray-700 mb-4 leading-relaxed">
//                                     {webinar.Description || "No description available."}
//                                 </p>
//                             </div> */}

//                             {/* <div className="mt-6 space-y-2 text-sm text-gray-500">
//                                 <p>
//                                     <span className="font-medium text-gray-700">Start:</span>{" "}
//                                     {new Date(webinar.WebinarStartDateTime).toLocaleString("en-US", {
//                                         dateStyle: "medium",
//                                         timeStyle: "short",
//                                     })}
//                                 </p>
//                                 <p>
//                                     <span className="font-medium text-gray-700">End:</span>{" "}
//                                     {new Date(webinar.WebinarEndDateTime).toLocaleString("en-US", {
//                                         dateStyle: "medium",
//                                         timeStyle: "short",
//                                     })}
//                                 </p>
//                             </div> */}
//                         </div>

//                     </div>

//                     {/* RIGHT SIDEBAR */}
//                     <div className="space-y-6">
//                         <div className="bg-white p-6 px-4 mb-6 rounded-2xl">
//                             {/* Webinar Title */}
//                             {/* <h2 className="text-3xl font-bold text-gray-900 mb-4">{webinar.WebinarTitle}</h2> */}
//                             <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 
//                                  break-words break-all line-clamp-2">
//                                 {webinar.WebinarTitle}
//                             </h2>

//                             {/* Description */}
//                             <div className="prose max-w-none mt-2 text-gray-700">
//                                 <p
//                                     className={`text-sm text-gray-700 leading-relaxed 
//                                     break-words break-all ${showFullDesc ? "" : "line-clamp-4"}`}
//                                 >
//                                     {webinar.Description || "No description available."}
//                                 </p>

//                                 {webinar.Description && webinar.Description.length > 120 && (
//                                     <button
//                                         onClick={() => setShowFullDesc(!showFullDesc)}
//                                         className="mt-2 text-blue-600 text-xs font-medium hover:underline"
//                                     >
//                                         {showFullDesc ? "Read less" : "Read more"}
//                                     </button>
//                                 )}

//                             </div>

//                             {/* Webinar Info (Start/End/Duration) */}
//                             <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
//                                 <div className="flex items-center gap-2">
//                                     <FaCalendarAlt className="text-blue-500 w-5 h-5" />
//                                     <span>
//                                         <strong>Start:</strong>
//                                         {new Date(webinar.WebinarStartDateTime).toLocaleString("en-US", {
//                                             dateStyle: "medium",
//                                             timeStyle: "short",
//                                         })}
//                                     </span>
//                                 </div>

//                                 <div className="flex items-center gap-2">
//                                     <IoTimeSharp className="text-green-500 w-5 h-5" />
//                                     <span>
//                                         <strong>End:</strong>
//                                         {new Date(webinar.WebinarEndDateTime).toLocaleString("en-US", {
//                                             dateStyle: "medium",
//                                             timeStyle: "short",
//                                         })}
//                                     </span>
//                                 </div>

//                             </div>
//                             <div className="mt-6 flex items-center justify-center">
//                                 {isUpcoming && (
//                                     <button
//                                         onClick={openRegisterModal}
//                                         className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
//                                     >
//                                         Register Now
//                                     </button>
//                                 )}
//                             </div>

//                         </div>

//                         {/* <SubscribeNow /> */}
//                     </div>
//                 </div>
//             </div>
//             {oneToOneSessions.length > 0 && (
//                 <div className="p-6 mb-6 rounded-xl">
//                     <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//                         One-to-One Sessions by this Speaker
//                     </h2>
//                     <div className="space-y-4">
//                         {oneToOneSessions.map(session => (
//                             <div key={session._id} className="bg-white p-4 rounded-lg shadow-sm border">
//                                 <h3 className="text-lg font-medium">{session.courseTitle}</h3>
//                                 <p className="text-gray-600">{session.courseDescription}</p>
//                                 <p className="text-sm text-gray-500">Date: {new Date(session.selectDate).toLocaleDateString()}</p>
//                                 <p className="text-sm text-gray-500">Time: {session.startTime} - {session.endTime}</p>
//                                 <p className="text-sm text-gray-500">Fees: ₹{session.fees}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//             <Footer />
//             <RegisterModal
//                 isOpen={isRegisterOpen}
//                 onClose={closeRegisterModal}
//                 webinarId={webinar._id}
//                 webinarType={webinar.WebinarType} // or "free"/"paid" depending on your data
//             />

//         </div>
//     );
// };

// export default WebinarDetailsPage;



import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios.js";
import Navbar from "../../components/layout/navbar/navbar";
import Footer from "../../components/layout/footer/footer";
import { CommentList, FollowSocials, SubscribeNow, Categories, LatestPost } from "../../components/ui/cards/cards.jsx";
const baseURL = import.meta.env.VITE_BACKEND_URL;
import { IoTimeSharp } from "react-icons/io5";
import { FaCalendarAlt, FaUserTie, FaVideo, FaRupeeSign, FaClock } from "react-icons/fa";
import { LuIndianRupee } from "react-icons/lu";
import { MdOutlineOndemandVideo, MdOutlineAccessTime } from "react-icons/md";
import { BsCalendarDate } from "react-icons/bs";
import RegisterModal from "./RegisterModal.jsx";
import { useNavigate } from "react-router-dom";
const WebinarDetailsPage = () => {
    const { slug } = useParams();
    const [webinar, setWebinar] = useState(null);
    const [oneToOneSessions, setOneToOneSessions] = useState([]);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const openRegisterModal = () => setIsRegisterOpen(true);
    const closeRegisterModal = () => setIsRegisterOpen(false);

    useEffect(() => {
        const fetchWebinar = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`/webinars/slug/${slug}`);
                setWebinar(data);
            } catch (err) {
                console.error("Error fetching webinar:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWebinar();
    }, [slug]);

    useEffect(() => {
        if (webinar && webinar.Speakers && webinar.Speakers.length > 0) {
            const speakerId = webinar.Speakers[0]._id;
            const fetchOneToOne = async () => {
                try {
                    const { data } = await axios.get(`/one-to-one/speaker/${speakerId}`);
                    setOneToOneSessions(data);
                } catch (err) {
                    console.error("Error fetching one-to-one sessions:", err);
                }
            };
            fetchOneToOne();
        }
    }, [webinar]);

    const now = new Date();
    const start = new Date(webinar?.WebinarStartDateTime || now);
    const end = new Date(webinar?.WebinarEndDateTime || now);
    const isUpcoming = start > now;
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

    const convertToOrderedList = (htmlContent) => {
        if (!htmlContent) return "";
        let cleanContent = htmlContent
            .replace(/<span class="ql-ui"[^>]*><\/span>/g, "")
            .replace(/<span class="ql-cursor"[^>]*>.*?<\/span>/g, "");

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
        if (webinar.Speakers && webinar.Speakers.length > 1 && webinar.WebinarImage) {
            return `${baseURL}${webinar.WebinarImage}`;
        }
        if (webinar.Speakers && webinar.Speakers.length === 1 && webinar.Speakers[0].profilePic) {
            return `${baseURL}/${webinar.Speakers[0].profilePic}`;
        }
        return "/default-speaker.png";
    };

    if (loading) {
        return (
            <div className="w-full font-[Poppins] bg-gray-50 min-h-screen">
                <Navbar />
                <div className="container mx-auto px-4 py-20 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!webinar) {
        return (
            <div className="w-full font-[Poppins] bg-gray-50 min-h-screen">
                <Navbar />
                <div className="container mx-auto px-4 py-20 text-center">
                    <h2 className="text-2xl font-semibold text-gray-700">Webinar not found</h2>
                    <p className="text-gray-500 mt-2">The webinar you're looking for doesn't exist.</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="w-full font-[Poppins] bg-gray-50 min-h-screen">
            <Navbar />

            <div className="font-[Poppins] bg-gray-50">
                <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                        {/* LEFT CONTENT - 2/3 width on large screens */}
                        <div className="lg:col-span-2 space-y-6 md:space-y-8">
                            {/* Speaker Card */}
                            <div className="flex flex-col md:flex-row bg-white p-4 sm:p-5 md:p-6 shadow-sm rounded-xl md:rounded-2xl">
                                <div className="w-full md:w-2/5 lg:w-1/3 bg-gray-200 aspect-[16/9] md:aspect-[4/5] rounded-lg md:rounded-xl mb-4 md:mb-0 md:mr-6 overflow-hidden">
                                    <img
                                        src={getWebinarImage(webinar)}
                                        alt={`${webinar.Speakers?.[0]?.firstName || 'Speaker'} ${webinar.Speakers?.[0]?.lastName || ''}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex flex-col justify-center w-full md:w-3/5 lg:w-2/3">
                                    {/* <div className="mb-2">
                                        <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                                            {webinar.WebinarType || "Webinar"}
                                        </span>
                                    </div> */}
                                    <h2 className="font-bold text-xl sm:text-2xl md:text-3xl leading-snug mb-3 text-gray-900">
                                        {webinar.Speakers?.[0]?.salutation} {webinar.Speakers?.[0]?.firstName} {webinar.Speakers?.[0]?.lastName}
                                    </h2>
                                    {/* <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                        {webinar.Speakers?.[0]?.introduction }
                                    </p> */}
                                    <div
                                        className="text-gray-600 leading-relaxed text-sm sm:text-base"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                webinar.Speakers?.[0]?.introduction,
                                        }}
                                    ></div>

                                </div>
                            </div>

                            {/* Webinar Introduction */}
                            <div className="bg-white p-5 sm:p-6 rounded-xl md:rounded-2xl shadow-sm">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Introduction</h3>
                                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                    {webinar.Introduction || "No introduction available."}
                                </p>
                            </div>

                            {/* Takeaways */}
                            <div className="bg-white p-5 sm:p-6 rounded-xl md:rounded-2xl shadow-sm">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Key Takeaways</h3>
                                <div
                                    className="prose prose-sm sm:prose-base max-w-none mt-4 text-gray-700"
                                    dangerouslySetInnerHTML={{
                                        __html: convertToOrderedList(webinar.Keywords)
                                    }}
                                />
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR - 1/3 width on large screens */}
                        <div className="space-y-6 md:space-y-8">
                            {/* Webinar Details Card */}
                            <div className="bg-white p-5 sm:p-6 rounded-xl md:rounded-2xl shadow-sm sticky top-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 line-clamp-3">
                                    {webinar.WebinarTitle}
                                </h2>

                                {/* Description with Read More */}
                                <div className="mb-6">
                                    <p className={`text-sm text-gray-700 leading-relaxed ${showFullDesc ? "" : "line-clamp-4"}`}>
                                        {webinar.Description || "No description available."}
                                    </p>
                                    {webinar.Description && webinar.Description.length > 150 && (
                                        <button
                                            onClick={() => setShowFullDesc(!showFullDesc)}
                                            className="mt-2 text-blue-600 text-sm font-medium hover:underline"
                                        >
                                            {showFullDesc ? "Read less" : "Read more"}
                                        </button>
                                    )}
                                </div>

                                {/* Webinar Info Grid */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <FaCalendarAlt className="text-blue-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">Start Date & Time</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {new Date(webinar.WebinarStartDateTime).toLocaleString("en-IN", {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MdOutlineAccessTime className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">End Date & Time</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {new Date(webinar.WebinarEndDateTime).toLocaleString("en-IN", {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* <div className="flex items-start gap-3">
                                        <FaClock className="text-purple-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">Duration</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {duration} minutes
                                            </p>
                                        </div>
                                    </div> */}
                                </div>

                                {/* Register Button */}
                                <div className="mt-6">
                                    {isUpcoming ? (
                                        <button
                                            onClick={openRegisterModal}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02]"
                                        >
                                            Register Now
                                        </button>
                                    ) : (
                                        <div className="text-center py-3 px-4 bg-gray-100 rounded-lg">
                                            <p className="text-gray-600 font-medium">This webinar has ended</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Optional: SubscribeNow or other components */}
                            {/* <SubscribeNow /> */}
                        </div>
                    </div>

                    {/* One-to-One Sessions Section - Full width below */}
                    {oneToOneSessions.length > 0 && (
                        <div className="mt-10 md:mt-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                    One-to-One Sessions by this Speaker
                                </h2>
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    {oneToOneSessions.length} session{oneToOneSessions.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {oneToOneSessions.map((session) => (
                                    <div
                                        key={session._id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden"
                                    >
                                        {/* Session Image/Thumbnail */}
                                        <div className="h-40 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
                                            <FaVideo className="w-12 h-12 text-blue-400" />
                                        </div>

                                        <div className="p-4 sm:p-5">
                                            <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                                                {session.courseTitle}
                                            </h3>

                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                {session.courseDescription}
                                            </p>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <BsCalendarDate className="text-gray-400 w-4 h-4" />
                                                    <span className="text-sm text-gray-700">
                                                        {new Date(session.selectDate).toLocaleDateString('en-IN', {
                                                            weekday: 'short',
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <IoTimeSharp className="text-gray-400 w-4 h-4" />
                                                    <span className="text-sm text-gray-700">
                                                        {session.startTime} - {session.endTime}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <FaRupeeSign className="text-gray-400 w-4 h-4" />
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        ₹{session.fees.toLocaleString('en-IN')}
                                                    </span>
                                                </div>
                                            </div>



                                            <button
                                                onClick={() =>
                                                    navigate(`/hall-of-fame/${webinar.Speakers[0]._id}`, {
                                                        state: {
                                                            preselectedSlot: {
                                                                sessionId: session._id,
                                                                startTime: session.startTime,
                                                                endTime: session.endTime,
                                                                courseTitle: session.courseTitle,
                                                                selectDate: session.selectDate,
                                                            },
                                                        },
                                                    })
                                                }
                                                className="w-full mt-4 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2.5 px-4 rounded-lg"
                                            >
                                                Book Session
                                            </button>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={closeRegisterModal}
                webinarId={webinar._id}
                webinarType={webinar.WebinarType}
            />
        </div>
    );
};

export default WebinarDetailsPage;