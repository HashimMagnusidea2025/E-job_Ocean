// // import React, { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import axios from "../../utils/axios.js";
// // import Navbar from "../../components/layout/navbar/navbar";
// // import Footer from "../../components/layout/footer/footer";
// // import { CommentList, FollowSocials, SubscribeNow, Categories, LatestPost } from "../../components/ui/cards/cards.jsx";
// // const baseURL = import.meta.env.VITE_BACKEND_URL; // Vite
// // // या CRA में: const baseURL = process.env.REACT_APP_BACKEND_URL;
// // import { IoTimeSharp } from "react-icons/io5";
// // import { FaCalendarAlt, FaUserTie } from "react-icons/fa";
// // import { LuIndianRupee } from "react-icons/lu";
// // import { MdOutlineOndemandVideo } from "react-icons/md";
// // import RegisterModal from "./RegisterModal.jsx";
// // const WebinarDetailsPage = () => {
// //     const { id } = useParams();
// //     const { slug } = useParams(); // ✅ Change from id to slug
// //     const [webinar, setWebinar] = useState(null);
// //     const [oneToOneSessions, setOneToOneSessions] = useState([]);
// //     const [isRegisterOpen, setIsRegisterOpen] = useState(false);
// //     const [showFullDesc, setShowFullDesc] = useState(false);

// //     const openRegisterModal = () => setIsRegisterOpen(true);
// //     const closeRegisterModal = () => setIsRegisterOpen(false);


// //     useEffect(() => {
// //         const fetchWebinar = async () => {
// //             try {
// //                 const { data } = await axios.get(`/webinars/slug/${slug}`);
// //                 setWebinar(data);
// //                 console.log(data);

// //             } catch (err) {
// //                 console.error("Error fetching webinar:", err);
// //             }
// //         };
// //         fetchWebinar();
// //     }, [slug]);

// //     useEffect(() => {
// //         if (webinar && webinar.Speakers && webinar.Speakers.length > 0) {
// //             const speakerId = webinar.Speakers[0]._id;
// //             const fetchOneToOne = async () => {
// //                 try {
// //                     const { data } = await axios.get(`/one-to-one/speaker/${speakerId}`);
// //                     setOneToOneSessions(data);
// //                 } catch (err) {
// //                     console.error("Error fetching one-to-one sessions:", err);
// //                 }
// //             };
// //             fetchOneToOne();
// //         }
// //     }, [webinar]);

// //     if (!webinar) {
// //         return <p className="text-center mt-10">Loading...</p>;
// //     }
// //     // const now = new Date();
// //     // const start = new Date(webinar.WebinarStartDateTime);
// //     // const end = new Date(webinar.WebinarEndDateTime);
// //     // console.log(start);
// //     // console.log(end);



// //     // const isUpcoming = end > now;
// //     // console.log(isUpcoming);
// //     const now = new Date();
// //     const start = new Date(webinar.WebinarStartDateTime);
// //     const end = new Date(webinar.WebinarEndDateTime);

// //     const isUpcoming = start > now; // ✅ SAME as WebinarCardsList
// //     const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
// //     const convertToOrderedList = (htmlContent) => {
// //         // Remove Quill span tags
// //         let cleanContent = htmlContent
// //             .replace(/<span class="ql-ui"[^>]*><\/span>/g, "")
// //             .replace(/<span class="ql-cursor"[^>]*>.*?<\/span>/g, "");

// //         // Convert line breaks to list items
// //         // Assuming each line is a list item
// //         const lines = cleanContent.split('<br>').filter(line => line.trim());

// //         if (lines.length > 0) {
// //             const listItems = lines.map(line =>
// //                 `<li class="mb-2">${line.trim()}</li>`
// //             ).join('');
// //             return `<ol class="list-decimal list-inside space-y-2">${listItems}</ol>`;
// //         }

// //         return cleanContent;
// //     };

// //     const getWebinarImage = (webinar) => {
// //         // ✅ Multiple speakers → WebinarImage
// //         if (webinar.Speakers && webinar.Speakers.length > 1 && webinar.WebinarImage) {
// //             return `${baseURL}${webinar.WebinarImage}`;
// //         }

// //         // ✅ Single speaker → Speaker profilePic
// //         if (
// //             webinar.Speakers &&
// //             webinar.Speakers.length === 1 &&
// //             webinar.Speakers[0].profilePic
// //         ) {
// //             return `${baseURL}/${webinar.Speakers[0].profilePic}`;
// //         }

// //     };

// //     return (
// //         <div className="w-full font-[Poppins] bg-gray-50">
// //             <Navbar />

// //             <div className="font-[Poppins] bg-gray-50">


// //                 <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
// //                     {/* LEFT CONTENT */}
// //                     <div className="lg:col-span-2">

// //                         <div className="flex flex-col md:flex-row bg-white p-4 md:p-6 shadow-sm rounded-2xl">
// //                             {/* Speaker Image */}
// //                             <div className="w-full md:w-1/3 bg-gray-300 aspect-[16/9] md:aspect-[4/5] rounded-xl mb-4 md:mb-0 md:mr-6 overflow-hidden">
// //                                 <img
// //                                     // src={
// //                                     //     webinar.Speakers?.profilePic
// //                                     //         ? `${baseURL}/${webinar.Speakers?.profilePic}`
// //                                     //         : "/default-speaker.png"
// //                                     // }
// //                                     // alt={`${webinar.Speakers?.firstName} ${webinar.Speakers?.lastName}`}
// //                                     src={getWebinarImage(webinar)}
// //                                     className="w-full h-full object-cover rounded-xl"
// //                                 />
// //                             </div>

// //                             {/* Webinar Title + Intro */}
// //                             <div className="flex flex-col justify-center w-full md:w-2/3">
// //                                 <h2 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-[35px] leading-snug mb-3">
// //                                     {webinar.Speakers.salutation} {webinar.Speakers.firstName} {webinar.Speakers.lastName}
// //                                 </h2>
// //                                 <p className="text-gray-600 leading-relaxed">
// //                                     {webinar.Speakers?.introduction}
// //                                 </p>
// //                             </div>
// //                         </div>

// //                         <div className="prose max-w-none text-gray-700 mb-4 mt-5">
// //                             <p>{webinar.Introduction || "No Introduction available."}</p>
// //                         </div>



// //                         <div className="p-6 mb-6 rounded-xl ">
// //                             <div className="p-6 mb-6 rounded-xl">
// //                                 <h2 className="text-2xl font-semibold text-gray-900 mb-4">
// //                                     TAKEAWAYS
// //                                 </h2>

// //                                 <div
// //                                     className="prose max-w-none mt-4 text-gray-700"
// //                                     dangerouslySetInnerHTML={{
// //                                         __html: convertToOrderedList(webinar.Keywords)
// //                                     }}
// //                                 />
// //                             </div>


// //                             {/* <p className="text-gray-600 mb-3 leading-relaxed">
// //                                 {webinar.Introduction || "No introduction available."}
// //                             </p>

// //                             <div className="prose max-w-none mt-4">
// //                                 <p className="text-gray-700 mb-4 leading-relaxed">
// //                                     {webinar.Description || "No description available."}
// //                                 </p>
// //                             </div> */}

// //                             {/* <div className="mt-6 space-y-2 text-sm text-gray-500">
// //                                 <p>
// //                                     <span className="font-medium text-gray-700">Start:</span>{" "}
// //                                     {new Date(webinar.WebinarStartDateTime).toLocaleString("en-US", {
// //                                         dateStyle: "medium",
// //                                         timeStyle: "short",
// //                                     })}
// //                                 </p>
// //                                 <p>
// //                                     <span className="font-medium text-gray-700">End:</span>{" "}
// //                                     {new Date(webinar.WebinarEndDateTime).toLocaleString("en-US", {
// //                                         dateStyle: "medium",
// //                                         timeStyle: "short",
// //                                     })}
// //                                 </p>
// //                             </div> */}
// //                         </div>

// //                     </div>

// //                     {/* RIGHT SIDEBAR */}
// //                     <div className="space-y-6">
// //                         <div className="bg-white p-6 px-4 mb-6 rounded-2xl">
// //                             {/* Webinar Title */}
// //                             {/* <h2 className="text-3xl font-bold text-gray-900 mb-4">{webinar.WebinarTitle}</h2> */}
// //                             <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 
// //                                  break-words break-all line-clamp-2">
// //                                 {webinar.WebinarTitle}
// //                             </h2>

// //                             {/* Description */}
// //                             <div className="prose max-w-none mt-2 text-gray-700">
// //                                 <p
// //                                     className={`text-sm text-gray-700 leading-relaxed 
// //                                     break-words break-all ${showFullDesc ? "" : "line-clamp-4"}`}
// //                                 >
// //                                     {webinar.Description || "No description available."}
// //                                 </p>

// //                                 {webinar.Description && webinar.Description.length > 120 && (
// //                                     <button
// //                                         onClick={() => setShowFullDesc(!showFullDesc)}
// //                                         className="mt-2 text-blue-600 text-xs font-medium hover:underline"
// //                                     >
// //                                         {showFullDesc ? "Read less" : "Read more"}
// //                                     </button>
// //                                 )}

// //                             </div>

// //                             {/* Webinar Info (Start/End/Duration) */}
// //                             <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
// //                                 <div className="flex items-center gap-2">
// //                                     <FaCalendarAlt className="text-blue-500 w-5 h-5" />
// //                                     <span>
// //                                         <strong>Start:</strong>
// //                                         {new Date(webinar.WebinarStartDateTime).toLocaleString("en-US", {
// //                                             dateStyle: "medium",
// //                                             timeStyle: "short",
// //                                         })}
// //                                     </span>
// //                                 </div>

// //                                 <div className="flex items-center gap-2">
// //                                     <IoTimeSharp className="text-green-500 w-5 h-5" />
// //                                     <span>
// //                                         <strong>End:</strong>
// //                                         {new Date(webinar.WebinarEndDateTime).toLocaleString("en-US", {
// //                                             dateStyle: "medium",
// //                                             timeStyle: "short",
// //                                         })}
// //                                     </span>
// //                                 </div>

// //                             </div>
// //                             <div className="mt-6 flex items-center justify-center">
// //                                 {isUpcoming && (
// //                                     <button
// //                                         onClick={openRegisterModal}
// //                                         className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
// //                                     >
// //                                         Register Now
// //                                     </button>
// //                                 )}
// //                             </div>

// //                         </div>

// //                         {/* <SubscribeNow /> */}
// //                     </div>
// //                 </div>
// //             </div>
// //             {oneToOneSessions.length > 0 && (
// //                 <div className="p-6 mb-6 rounded-xl">
// //                     <h2 className="text-2xl font-semibold text-gray-900 mb-4">
// //                         One-to-One Sessions by this Speaker
// //                     </h2>
// //                     <div className="space-y-4">
// //                         {oneToOneSessions.map(session => (
// //                             <div key={session._id} className="bg-white p-4 rounded-lg shadow-sm border">
// //                                 <h3 className="text-lg font-medium">{session.courseTitle}</h3>
// //                                 <p className="text-gray-600">{session.courseDescription}</p>
// //                                 <p className="text-sm text-gray-500">Date: {new Date(session.selectDate).toLocaleDateString()}</p>
// //                                 <p className="text-sm text-gray-500">Time: {session.startTime} - {session.endTime}</p>
// //                                 <p className="text-sm text-gray-500">Fees: ₹{session.fees}</p>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 </div>
// //             )}
// //             <Footer />
// //             <RegisterModal
// //                 isOpen={isRegisterOpen}
// //                 onClose={closeRegisterModal}
// //                 webinarId={webinar._id}
// //                 webinarType={webinar.WebinarType} // or "free"/"paid" depending on your data
// //             />

// //         </div>
// //     );
// // };

// // export default WebinarDetailsPage;



// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "../../utils/axios.js";
// import Navbar from "../../components/layout/navbar/navbar";
// import Footer from "../../components/layout/footer/footer";
// import { CommentList, FollowSocials, SubscribeNow, Categories, LatestPost } from "../../components/ui/cards/cards.jsx";
// const baseURL = import.meta.env.VITE_BACKEND_URL;
// import { IoTimeSharp } from "react-icons/io5";
// import { FaCalendarAlt, FaUserTie, FaVideo, FaRupeeSign, FaClock } from "react-icons/fa";
// import { LuIndianRupee } from "react-icons/lu";
// import { MdOutlineOndemandVideo, MdOutlineAccessTime } from "react-icons/md";
// import { BsCalendarDate } from "react-icons/bs";
// import RegisterModal from "./RegisterModal.jsx";
// import { useNavigate } from "react-router-dom";
// const WebinarDetailsPage = () => {
//     const { slug } = useParams();
//     const [webinar, setWebinar] = useState(null);
//     const [oneToOneSessions, setOneToOneSessions] = useState([]);
//     const [isRegisterOpen, setIsRegisterOpen] = useState(false);
//     const [showFullDesc, setShowFullDesc] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//     const openRegisterModal = () => setIsRegisterOpen(true);
//     const closeRegisterModal = () => setIsRegisterOpen(false);

//     useEffect(() => {
//         const fetchWebinar = async () => {
//             try {
//                 setLoading(true);
//                 const { data } = await axios.get(`/webinars/slug/${slug}`);
//                 setWebinar(data);
//                 console.log(data);

//             } catch (err) {
//                 console.error("Error fetching webinar:", err);
//             } finally {
//                 setLoading(false);
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

//     const now = new Date();
//     const start = new Date(webinar?.WebinarStartDateTime || now);
//     const end = new Date(webinar?.WebinarEndDateTime || now);
//     const isUpcoming = start > now;
//     const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

//     const convertToOrderedList = (htmlContent) => {
//         if (!htmlContent) return "";
//         let cleanContent = htmlContent
//             .replace(/<span class="ql-ui"[^>]*><\/span>/g, "")
//             .replace(/<span class="ql-cursor"[^>]*>.*?<\/span>/g, "");

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
//         if (webinar.Speakers && webinar.Speakers.length > 1 && webinar.WebinarImage) {
//             return `${baseURL}${webinar.WebinarImage}`;
//         }
//         if (webinar.Speakers && webinar.Speakers.length === 1 && webinar.Speakers[0].profilePic) {
//             return `${baseURL}/${webinar.Speakers[0].profilePic}`;
//         }
//         return "/default-speaker.png";
//     };

//     if (loading) {
//         return (
//             <div className="w-full font-[Poppins] bg-gray-50 min-h-screen">
//                 <Navbar />
//                 <div className="container mx-auto px-4 py-20 flex justify-center items-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//                 </div>
//                 <Footer />
//             </div>
//         );
//     }

//     if (!webinar) {
//         return (
//             <div className="w-full font-[Poppins] bg-gray-50 min-h-screen">
//                 <Navbar />
//                 <div className="container mx-auto px-4 py-20 text-center">
//                     <h2 className="text-2xl font-semibold text-gray-700">Webinar not found</h2>
//                     <p className="text-gray-500 mt-2">The webinar you're looking for doesn't exist.</p>
//                 </div>
//                 <Footer />
//             </div>
//         );
//     }

//     return (
//         <div className="w-full font-[Poppins] bg-gray-50 min-h-screen">
//             <Navbar />

//             <div className="font-[Poppins] bg-gray-50">
//                 <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10">
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
//                         {/* LEFT CONTENT - 2/3 width on large screens */}
//                         <div className="lg:col-span-2 space-y-6 md:space-y-8">
//                             {/* Speaker Card */}
//                             <div className="flex flex-col md:flex-row bg-white p-4 sm:p-5 md:p-6 shadow-sm rounded-xl md:rounded-2xl">
//                                 <div className="w-full md:w-2/5 lg:w-1/3 bg-gray-200 aspect-[16/9] md:aspect-[4/5] rounded-lg md:rounded-xl mb-4 md:mb-0 md:mr-6 overflow-hidden">
//                                     <img
//                                         src={getWebinarImage(webinar)}
//                                         alt={`${webinar.Speakers?.[0]?.firstName || 'Speaker'} ${webinar.Speakers?.[0]?.lastName || ''}`}
//                                         className="w-full h-full object-cover"
//                                     />
//                                 </div>

//                                 <div className="flex flex-col justify-center w-full md:w-3/5 lg:w-2/3">
//                                     {/* <div className="mb-2">
//                                         <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
//                                             {webinar.WebinarType || "Webinar"}
//                                         </span>
//                                     </div> */}
//                                     <h2 className="font-bold text-xl sm:text-2xl md:text-3xl leading-snug mb-3 text-gray-900">
//                                         {webinar.Speakers?.[0]?.salutation} {webinar.Speakers?.[0]?.firstName} {webinar.Speakers?.[0]?.lastName}
//                                     </h2>
//                                     {/* <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
//                                         {webinar.Speakers?.[0]?.introduction }
//                                     </p> */}
//                                     <div
//                                         className="text-gray-600 leading-relaxed text-sm sm:text-base"
//                                         dangerouslySetInnerHTML={{
//                                             __html:
//                                                 webinar.Speakers?.[0]?.introduction,
//                                         }}
//                                     ></div>

//                                 </div>
//                             </div>

//                             {/* Webinar Introduction */}
//                             <div className="bg-white p-5 sm:p-6 rounded-xl md:rounded-2xl shadow-sm">
//                                 <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Introduction</h3>
//                                 <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
//                                     {webinar.Introduction || "No introduction available."}
//                                 </p>
//                             </div>

//                             {/* Takeaways */}
//                             <div className="bg-white p-5 sm:p-6 rounded-xl md:rounded-2xl shadow-sm">
//                                 <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Key Takeaways</h3>
//                                 <div
//                                     className="prose prose-sm sm:prose-base max-w-none mt-4 text-gray-700"
//                                     dangerouslySetInnerHTML={{
//                                         __html: convertToOrderedList(webinar.Keywords)
//                                     }}
//                                 />
//                             </div>
//                         </div>

//                         {/* RIGHT SIDEBAR - 1/3 width on large screens */}
//                         <div className="space-y-6 md:space-y-8">
//                             {/* Webinar Details Card */}
//                             <div className="bg-white p-5 sm:p-6 rounded-xl md:rounded-2xl shadow-sm sticky top-6">
//                                 <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 line-clamp-3">
//                                     {webinar.WebinarTitle}
//                                 </h2>

//                                 {/* Description with Read More */}
//                                 <div className="mb-6">
//                                     <p className={`text-sm text-gray-700 leading-relaxed ${showFullDesc ? "" : "line-clamp-4"}`}>
//                                         {webinar.Description || "No description available."}
//                                     </p>
//                                     {webinar.Description && webinar.Description.length > 150 && (
//                                         <button
//                                             onClick={() => setShowFullDesc(!showFullDesc)}
//                                             className="mt-2 text-blue-600 text-sm font-medium hover:underline"
//                                         >
//                                             {showFullDesc ? "Read less" : "Read more"}
//                                         </button>
//                                     )}
//                                 </div>

//                                 {/* Webinar Info Grid */}
//                                 <div className="space-y-4 mb-6">
//                                     <div className="flex items-start gap-3">
//                                         <FaCalendarAlt className="text-blue-500 w-5 h-5 mt-0.5 flex-shrink-0" />
//                                         <div>
//                                             <p className="text-xs text-gray-500">Start Date & Time</p>
//                                             <p className="text-sm font-medium text-gray-800">
//                                                 {new Date(webinar.WebinarStartDateTime).toLocaleString("en-IN", {
//                                                     day: 'numeric',
//                                                     month: 'short',
//                                                     year: 'numeric',
//                                                     hour: '2-digit',
//                                                     minute: '2-digit'
//                                                 })}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     <div className="flex items-start gap-3">
//                                         <MdOutlineAccessTime className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
//                                         <div>
//                                             <p className="text-xs text-gray-500">End Date & Time</p>
//                                             <p className="text-sm font-medium text-gray-800">
//                                                 {new Date(webinar.WebinarEndDateTime).toLocaleString("en-IN", {
//                                                     day: 'numeric',
//                                                     month: 'short',
//                                                     year: 'numeric',
//                                                     hour: '2-digit',
//                                                     minute: '2-digit'
//                                                 })}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     {/* <div className="flex items-start gap-3">
//                                         <FaClock className="text-purple-500 w-5 h-5 mt-0.5 flex-shrink-0" />
//                                         <div>
//                                             <p className="text-xs text-gray-500">Duration</p>
//                                             <p className="text-sm font-medium text-gray-800">
//                                                 {duration} minutes
//                                             </p>
//                                         </div>
//                                     </div> */}
//                                 </div>

//                                 {/* Register Button */}
//                                 <div className="mt-6">
//                                     {isUpcoming ? (
//                                         <button
//                                             onClick={openRegisterModal}
//                                             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02]"
//                                         >
//                                             Register Now
//                                         </button>
//                                     ) : (
//                                         <div className="text-center py-3 px-4 bg-gray-100 rounded-lg">
//                                             <p className="text-gray-600 font-medium">This webinar has ended</p>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Optional: SubscribeNow or other components */}
//                             {/* <SubscribeNow /> */}
//                         </div>
//                     </div>

//                     {/* One-to-One Sessions Section - Full width below */}
//                     {oneToOneSessions.length > 0 && (
//                         <div className="mt-10 md:mt-12">
//                             <div className="flex items-center justify-between mb-6">
//                                 <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
//                                     One-to-One Sessions by this Speaker
//                                 </h2>
//                                 <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
//                                     {oneToOneSessions.length} session{oneToOneSessions.length !== 1 ? 's' : ''}
//                                 </span>
//                             </div>

//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//                                 {oneToOneSessions.map((session) => (
//                                     <div
//                                         key={session._id}
//                                         className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden"
//                                     >
//                                         {/* Session Image/Thumbnail */}
//                                         <div className="h-40 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
//                                             <FaVideo className="w-12 h-12 text-blue-400" />
//                                         </div>

//                                         <div className="p-4 sm:p-5">
//                                             <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
//                                                 {session.courseTitle}
//                                             </h3>

//                                             <p className="text-gray-600 text-sm mb-4 line-clamp-3">
//                                                 {session.courseDescription}
//                                             </p>

//                                             <div className="space-y-3">
//                                                 <div className="flex items-center gap-2">
//                                                     <BsCalendarDate className="text-gray-400 w-4 h-4" />
//                                                     <span className="text-sm text-gray-700">
//                                                         {new Date(session.selectDate).toLocaleDateString('en-IN', {
//                                                             weekday: 'short',
//                                                             day: 'numeric',
//                                                             month: 'short',
//                                                             year: 'numeric'
//                                                         })}
//                                                     </span>
//                                                 </div>

//                                                 <div className="flex items-center gap-2">
//                                                     <IoTimeSharp className="text-gray-400 w-4 h-4" />
//                                                     <span className="text-sm text-gray-700">
//                                                         {session.startTime} - {session.endTime}
//                                                     </span>
//                                                 </div>

//                                                 <div className="flex items-center gap-2">
//                                                     <FaRupeeSign className="text-gray-400 w-4 h-4" />
//                                                     <span className="text-sm font-semibold text-gray-900">
//                                                         ₹{session.fees.toLocaleString('en-IN')}
//                                                     </span>
//                                                 </div>
//                                             </div>



//                                             <button
//                                                 onClick={() =>
//                                                     navigate(`/hall-of-fame/${webinar.Speakers[0]._id}`, {
//                                                         state: {
//                                                             preselectedSlot: {
//                                                                 sessionId: session._id,
//                                                                 startTime: session.startTime,
//                                                                 endTime: session.endTime,
//                                                                 courseTitle: session.courseTitle,
//                                                                 selectDate: session.selectDate,
//                                                             },
//                                                         },
//                                                     })
//                                                 }
//                                                 className="w-full mt-4 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2.5 px-4 rounded-lg"
//                                             >
//                                                 Book Session
//                                             </button>

//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             <Footer />
//             <RegisterModal
//                 isOpen={isRegisterOpen}
//                 onClose={closeRegisterModal}
//                 webinarId={webinar._id}
//                 webinarType={webinar.WebinarType}
//             />
//         </div>
//     );
// };

// export default WebinarDetailsPage;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios.js";
import Navbar from "../../components/layout/navbar/navbar";
import Footer from "../../components/layout/footer/footer";
import { FaCalendarAlt, FaClock, FaVideo, FaUsers, FaUserTie, FaMapMarkerAlt, FaRupeeSign } from "react-icons/fa";
import { IoTimeSharp } from "react-icons/io5";
import { MdOutlineAccessTime, MdOutlineVideoCall } from "react-icons/md";
import { BsCalendarDate } from "react-icons/bs";
import { PiUsersThree } from "react-icons/pi";
import RegisterModal from "./RegisterModal.jsx";

const baseURL = import.meta.env.VITE_BACKEND_URL;

const WebinarDetailsPage = () => {
    const { slug } = useParams();
    const [webinar, setWebinar] = useState(null);
    const [oneToOneSessions, setOneToOneSessions] = useState([]);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeSpeakerIndex, setActiveSpeakerIndex] = useState(0);
    const navigate = useNavigate();

    const openRegisterModal = () => setIsRegisterOpen(true);
    const closeRegisterModal = () => setIsRegisterOpen(false);

    useEffect(() => {
        const fetchWebinar = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`/webinars/slug/${slug}`);
                setWebinar(data);
                console.log(data);
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
            const fetchAllOneToOneSessions = async () => {
                const sessions = [];
                for (const speaker of webinar.Speakers) {
                    try {
                        const { data } = await axios.get(`/one-to-one/speaker/${speaker._id}`);
                        sessions.push(...data.map(session => ({ ...session, speakerName: `${speaker.firstName} ${speaker.lastName}` })));
                    } catch (err) {
                        console.error(`Error fetching sessions for speaker ${speaker._id}:`, err);
                    }
                }
                setOneToOneSessions(sessions);
            };
            fetchAllOneToOneSessions();
        }
    }, [webinar]);

    const now = new Date();
    const start = new Date(webinar?.WebinarStartDateTime || now);
    const end = new Date(webinar?.WebinarEndDateTime || now);
    const isUpcoming = start > now;
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    const isFree = webinar?.WebinarType === "Free";
    const hasMultipleSpeakers = webinar?.Speakers && webinar.Speakers.length > 1;

    const convertToOrderedList = (htmlContent) => {
        if (!htmlContent) return "";
        let cleanContent = htmlContent
            .replace(/<span class="ql-ui"[^>]*><\/span>/g, "")
            .replace(/<span class="ql-cursor"[^>]*>.*?<\/span>/g, "");

        const lines = cleanContent.split('<br>').filter(line => line.trim());
        if (lines.length > 0) {
            const listItems = lines.map(line =>
                `<li class="mb-3 pl-2 border-l-3 border-blue-500">${line.trim()}</li>`
            ).join('');
            return `<ul class="space-y-3">${listItems}</ul>`;
        }
        return cleanContent;
    };

    const getWebinarImage = (webinar) => {
        if (webinar.WebinarImage) {
            return `${baseURL}${webinar.WebinarImage}`;
        }
        if (webinar.Speakers && webinar.Speakers.length === 1 && webinar.Speakers[0].profilePic) {
            return `${baseURL}/${webinar.Speakers[0].profilePic}`;
        }
        if (hasMultipleSpeakers) {
            return `${baseURL}${webinar.WebinarLogo}`;
        }
        return "/default-speaker.png";
    };

    const getWebinarModeIcon = (mode) => {
        switch (mode?.toLowerCase()) {
            case 'online':
                return <MdOutlineVideoCall className="w-5 h-5" />;
            case 'offline':
                return <FaMapMarkerAlt className="w-5 h-5" />;
            case 'hybrid':
                return <PiUsersThree className="w-5 h-5" />;
            default:
                return <FaVideo className="w-5 h-5" />;
        }
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString("en-IN", {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;

        const regExp =
            /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);

        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    };

    const cleanQuillHTML = (html) => {
        if (!html) return "";
        return html
            .replace(/<span class="ql-ui"[^>]*><\/span>/g, "")
            .replace(/<span class="ql-cursor"[^>]*>.*?<\/span>/g, "");
    };

    return (
        <div className="w-full font-[Poppins] bg-gray-50 min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-[linear-gradient(to_right,_#090A47,_#20AEB2)] to-black  text-white">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="container mx-auto px-4 py-12 md:py-16 relative">
                    <div className="py-12">
                        {/* <div className="flex items-center gap-2 mb-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${isFree ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {isFree ? 'FREE' : `₹${webinar.registrationFees}`}
                                </span>
                                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium flex items-center gap-1">
                                    {getWebinarModeIcon(webinar.WebinarMode)}
                                    {webinar.WebinarMode || 'Online'}
                                </span>
                                {hasMultipleSpeakers && (
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium flex items-center gap-1">
                                        <FaUsers className="w-4 h-4" />
                                        {webinar.Speakers.length} Speakers
                                    </span>
                                )}
                            </div> */}

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center leading-tight">
                            {webinar.WebinarTitle}
                        </h1>

                        {/* <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl">
                                {webinar.Description ? (showFullDesc ? webinar.Description : `${webinar.Description.substring(0, 150)}...`) : "Join us for an insightful session"}
                            </p>
                            
                            {webinar.Description && webinar.Description.length > 150 && (
                                <button
                                    onClick={() => setShowFullDesc(!showFullDesc)}
                                    className="text-blue-200 hover:text-white font-medium underline"
                                >
                                    {showFullDesc ? "Read less" : "Read more"}
                                </button>
                            )} */}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - 2/3 width */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Speakers Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <FaUserTie className="text-blue-600" />
                                    {hasMultipleSpeakers ? 'Meet Our Speakers' : 'About the Speaker'}
                                </h2>
                                {hasMultipleSpeakers && (
                                    <div className="flex gap-1">
                                        {webinar.Speakers.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveSpeakerIndex(index)}
                                                className={`w-3 h-3 rounded-full ${activeSpeakerIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {hasMultipleSpeakers ? (
                                <>
                                    {/* Active Speaker Details */}
                                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                                        <div className="md:w-1/3">
                                            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                                                <img
                                                    src={webinar.Speakers[activeSpeakerIndex]?.profilePic ?
                                                        `${baseURL}/${webinar.Speakers[activeSpeakerIndex].profilePic}` :
                                                        "/default-speaker.png"}
                                                    alt={webinar.Speakers[activeSpeakerIndex]?.firstName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:w-2/3">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        {webinar.Speakers[activeSpeakerIndex]?.salutation} {webinar.Speakers[activeSpeakerIndex]?.firstName} {webinar.Speakers[activeSpeakerIndex]?.lastName}
                                                    </h3>
                                                    <p className="text-gray-600 mt-1">{webinar.Speakers[activeSpeakerIndex]?.designation}</p>
                                                </div>
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                    Speaker {activeSpeakerIndex + 1} of {webinar.Speakers.length}
                                                </span>
                                            </div>
                                            <div
                                                className="text-gray-700 leading-relaxed"
                                                dangerouslySetInnerHTML={{
                                                    __html: webinar.Speakers[activeSpeakerIndex]?.introduction || "No introduction available."
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* All Speakers Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {webinar.Speakers.map((speaker, index) => (
                                            <button
                                                key={speaker._id}
                                                onClick={() => setActiveSpeakerIndex(index)}
                                                className={`p-4 rounded-xl border-2 transition-all duration-300 ${activeSpeakerIndex === index
                                                    ? 'border-blue-500 bg-blue-50 transform scale-105'
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={speaker.profilePic ? `${baseURL}/${speaker.profilePic}` : "/default-speaker.png"}
                                                            alt={`${speaker.firstName} ${speaker.lastName}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="text-left">
                                                        <h4 className="font-semibold text-gray-900 line-clamp-1">
                                                            {speaker.salutation} {speaker.firstName} {speaker.lastName}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{speaker.designation}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                /* Single Speaker Layout */
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="md:w-1/3">
                                        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                                            <img
                                                src={webinar.Speakers[0]?.profilePic ?
                                                    `${baseURL}/${webinar.Speakers[0].profilePic}` :
                                                    "/default-speaker.png"}
                                                alt={webinar.Speakers[0]?.firstName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:w-2/3">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {webinar.Speakers[0]?.salutation} {webinar.Speakers[0]?.firstName} {webinar.Speakers[0]?.lastName}
                                        </h3>
                                        <p className="text-gray-600 mb-4">{webinar.Speakers[0]?.designation}</p>
                                        <div
                                            className="text-gray-700 leading-relaxed"
                                            dangerouslySetInnerHTML={{
                                                __html: webinar.Speakers[0]?.introduction || "No introduction available."
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Webinar Introduction */}
                        <div className="bg-white rounded-2xl p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed">
                                    {webinar.Introduction || "No introduction available."}
                                </p>
                            </div>
                        </div>

                        {/* Key Takeaways */}
                        <div className="bg-white rounded-2xl  p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Takeaways</h2>
                            <div
                                className="prose prose-lg max-w-none mt-4 text-gray-700 [&_ol]:list-decimal [&_ol]:pl-6"
                                dangerouslySetInnerHTML={{
                                    __html: cleanQuillHTML(webinar.Keywords)
                                }}
                            />

                        </div>
                    </div>

                    {/* Sidebar - 1/3 width */}
                    <div className="space-y-6">
                        {/* Webinar Details Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                            {/* Webinar Image */}
                            {/* <div className="mb-6">
                                <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                                    <img
                                        src={getWebinarImage(webinar)}
                                        alt={webinar.WebinarTitle}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div> */}

                            {/* Details Grid */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <FaCalendarAlt className="text-blue-500 w-5 h-5 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</p>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {formatDateTime(webinar.WebinarStartDateTime)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MdOutlineAccessTime className="text-green-500 w-5 h-5 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</p>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {formatDateTime(webinar.WebinarEndDateTime)}
                                        </p>
                                    </div>
                                </div>

                                {/* <div className="flex items-start gap-3">
                                    <FaClock className="text-purple-500 w-5 h-5 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</p>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {duration} minutes
                                        </p>
                                    </div>
                                </div> */}

                                {/* <div className="flex items-start gap-3">
                                    <PiUsersThree className="text-amber-500 w-5 h-5 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Available Seats</p>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {webinar.NumberofSeats} seats remaining
                                        </p>
                                    </div>
                                </div> */}

                                {/* {webinar.webinarAddress && (
                                    <div className="flex items-start gap-3">
                                        <FaMapMarkerAlt className="text-red-500 w-5 h-5 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</p>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {webinar.webinarAddress}
                                            </p>
                                        </div>
                                    </div>
                                )} */}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 space-y-3">
                                {isUpcoming ? (
                                    <>
                                        <button
                                            onClick={openRegisterModal}
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                                        >
                                            Register Now {!isFree && `- ₹${webinar.registrationFees}`}
                                        </button>

                                        {/* {webinar.googleMeetLink && (
                                            <a
                                                href={webinar.googleMeetLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-4 rounded-xl transition-colors duration-300"
                                            >
                                                <MdOutlineVideoCall className="w-5 h-5" />
                                                Join Google Meet
                                            </a>
                                        )} */}
                                    </>
                                ) : (
                                    <div className="text-center p-4 bg-gray-100 rounded-xl">
                                        <p className="text-gray-600 font-semibold">This webinar has ended</p>
                                        <p className="text-sm text-gray-500 mt-1">Check back for future sessions</p>
                                    </div>
                                )}
                            </div>

                            {/* Quick Info */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex flex-wrap gap-2">
                                    {/* <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                                        {webinar.WebinarMode}
                                    </span>
                                    <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                                        {webinar.WebinarType}
                                    </span> */}
                                    {hasMultipleSpeakers && (
                                        <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                                            {webinar.Speakers.length} Speakers
                                        </span>
                                    )}
                                </div>
                            </div>


                        </div>
                        <div className="sticky top-6">
                            {webinar?.YouTubeVideoLink && getYouTubeEmbedUrl(webinar.YouTubeVideoLink) && (
                                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        Webinar Preview
                                    </h2>

                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                                        <iframe
                                            src={getYouTubeEmbedUrl(webinar.YouTubeVideoLink)}
                                            title="Webinar YouTube Video"
                                            className="w-full h-full"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Share Links */}
                        {/* <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share This Webinar</h3>
                            <div className="flex gap-3">
                                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
                                    Facebook
                                </button>
                                <button className="flex-1 bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors">
                                    Twitter
                                </button>
                                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                                    LinkedIn
                                </button>
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* One-to-One Sessions Section */}
                {oneToOneSessions.length > 0 && (
                    <div className="mt-12 md:mt-16">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    One-on-One Sessions with Speakers
                                </h2>
                                <p className="text-gray-600 mt-2">Book personalized sessions with our experts</p>
                            </div>
                            <span className="mt-2 md:mt-0 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                {oneToOneSessions.length} available session{oneToOneSessions.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {oneToOneSessions.map((session) => (
                                <div
                                    key={session._id}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                                                    {session.courseTitle}
                                                </h3>
                                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                                    {session.speakerName}
                                                </span>
                                            </div>
                                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-semibold">
                                                ₹{session.fees.toLocaleString('en-IN')}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                                            {session.courseDescription}
                                        </p>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-2">
                                                <BsCalendarDate className="text-gray-400 w-4 h-4" />
                                                <span className="text-sm text-gray-700">
                                                    {new Date(session.selectDate).toLocaleDateString('en-IN', {
                                                        weekday: 'short',
                                                        day: 'numeric',
                                                        month: 'short'
                                                    })}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <IoTimeSharp className="text-gray-400 w-4 h-4" />
                                                <span className="text-sm text-gray-700">
                                                    {session.startTime} - {session.endTime}
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
                                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                                        >
                                            Book Personal Session
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={closeRegisterModal}
                webinarId={webinar._id}
                webinarType={webinar.WebinarType}
                webinarTitle={webinar.WebinarTitle}
            />
        </div>
    );
};

export default WebinarDetailsPage;