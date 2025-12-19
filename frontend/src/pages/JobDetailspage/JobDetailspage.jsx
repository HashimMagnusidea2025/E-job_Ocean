import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios.js";
import { FaMapMarkerAlt, FaClock, FaBriefcase, FaMoneyBill, FaGraduationCap, FaUsers, FaCalendar } from "react-icons/fa";

import HeaderPalecment from '../../media/png/HeaderPalecment.png';
import { JobApplicationForm, CommentList, CommentCards } from "../../components/ui/cards/cards.jsx";


export default function JobDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const [likeCount, setLikeCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [locationNames, setLocationNames] = useState({
        city: "",
        state: "",
        country: ""
    });


    // Sidebar jobs state
    const [sidebarJobs, setSidebarJobs] = useState([]);
    const [sidebarLoading, setSidebarLoading] = useState(true);
    const [locationNamesMap, setLocationNamesMap] = useState({});

    const type = "job";
    useEffect(() => {
        const token = localStorage.getItem("token"); // ya cookies se lo
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    // useEffect(() => {

    //     const fetchComments = async () => {

    //         try {

    //             const res = await axios.get(`/comment/${id}?type=${type}`);
    //             setComments(res.data.comments);
    //             setCommentCount(res.data.count);
    //         } catch (err) {
    //             console.error("Error fetching comments:", err);

    //         }
    //     };
    //     fetchComments();
    // }, [id, type]);

    // ✅ Fetch Like Count

    // ✅ Comments fetch करने का function अलग बनाएं
    const fetchComments = async () => {
        try {
            console.log("JobDetailsPage: Fetching comments for job:", { id, type });
            const res = await axios.get(`/comment/${id}?type=${type}`);
            console.log("JobDetailsPage: Comments response:", {
                count: res.data.count,
                comments: res.data.comments
            });
            setComments(res.data.comments);
            setCommentCount(res.data.count);
        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    };

    // ✅ Initial load पर comments fetch करें
    useEffect(() => {
        fetchComments();
    }, [id, type]);

    // ✅ Comment add होने के बाद refresh करने का function
    const handleCommentAdded = () => {
        console.log("Comment added, refreshing comments...");
        fetchComments(); // ✅ Comments को फिर से fetch करें
    };

    useEffect(() => {
        const fetchLikeCount = async () => {
            try {
                console.log("Fetching like count for job:", id, "type:", type); // Debugging
                const res = await axios.get(`/blogs/like/likes/${id}/${type}`);
                console.log("Like count response:", res.data); // Debugging
                setLikeCount(res.data.totalCount);
            } catch (err) {
                console.error(err.response?.data || err.message);
                console.error("Error fetching like count:", err);
                console.error("Error details:", err.response?.data); // Detailed error
                setLikeCount(0); // Default to 0 on error
            }
        };
        fetchLikeCount();
    }, [id, type]);
    // ✅ Handle Like
    const handleLike = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                "/blogs/like",
                { blogId: id, type },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.totalCount !== undefined) {
                setLikeCount(res.data.totalCount);
                setLiked(true);
            }
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };


    useEffect(() => {
        const fetchJobAndLocations = async () => {
            try {
                // Fetch job first
                const jobResponse = await axios.get(`/job-post/${id}`);
                const jobData = jobResponse.data;
                setJob(jobData);
                console.log(jobData);


                // Then fetch location names
                const locationPromises = [];

                if (jobData.country) {
                    locationPromises.push(
                        axios.get(`/country/${jobData.country}`)
                            .then(res => res.data.data?.name || "Unknown Country")
                            .catch(() => "Unknown Country")
                    );
                } else {
                    locationPromises.push(Promise.resolve(""));
                }

                if (jobData.state) {
                    locationPromises.push(
                        axios.get(`/state/${jobData.state}`)
                            .then(res => res.data.data?.name || "Unknown State")
                            .catch(() => "Unknown State")
                    );
                } else {
                    locationPromises.push(Promise.resolve(""));
                }

                if (jobData.city) {
                    locationPromises.push(
                        axios.get(`/city/${jobData.city}`)
                            .then(res => res.data.data?.name || "Unknown City")
                            .catch(() => "Unknown City")
                    );
                } else {
                    locationPromises.push(Promise.resolve(""));
                }

                const [countryName, stateName, cityName] = await Promise.all(locationPromises);

                setLocationNames({
                    country: countryName,
                    state: stateName,
                    city: cityName
                });

            } catch (error) {
                console.error("Error fetching job details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobAndLocations();
    }, [id]);


    // Fetch sidebar jobs
    useEffect(() => {
        const fetchSidebarJobs = async () => {
            try {
                const response = await axios.get("/job-post/active");
                const jobsData = response.data;



                // Filter out current job and limit to 4-5 jobs
                const filteredJobs = jobsData
                    .filter(jobItem => jobItem._id !== id)
                    .slice(0, 5);

                // Fetch location names for sidebar jobs
                const locationPromises = filteredJobs.map(async (jobItem) => {
                    const loc = { city: "", state: "", country: "" };

                    if (jobItem.country) {
                        try {
                            const countryRes = await axios.get(`/country/${jobItem.country}`);
                            loc.country = countryRes.data.data?.name || countryRes.data?.name || "Unknown Country";
                        } catch (error) {
                            loc.country = "Unknown Country";
                        }
                    }

                    if (jobItem.state) {
                        try {
                            const stateRes = await axios.get(`/state/${jobItem.state}`);
                            loc.state = stateRes.data.data?.name || stateRes.data?.name || "Unknown State";
                        } catch (error) {
                            loc.state = "Unknown State";
                        }
                    }

                    if (jobItem.city) {
                        try {
                            const cityRes = await axios.get(`/city/${jobItem.city}`);
                            loc.city = cityRes.data.data?.name || cityRes.data?.name || "Unknown City";
                        } catch (error) {
                            loc.city = "Unknown City";
                        }
                    }

                    return { jobId: jobItem._id, location: loc };
                });

                const locationsArray = await Promise.all(locationPromises);
                const locationsMap = {};
                locationsArray.forEach(item => {
                    locationsMap[item.jobId] = item.location;
                });

                setLocationNamesMap(locationsMap);
                setSidebarJobs(filteredJobs);

            } catch (error) {
                console.error("Error fetching sidebar jobs:", error);
            } finally {
                setSidebarLoading(false);
            }
        };

        fetchSidebarJobs();
    }, [id]);






    // useEffect(() => {
    //     const fetchJob = async () => {
    //         try {
    //             const response = await axios.get(`/job-post/${id}`);
    //             setJob(response.data);
    //         } catch (error) {
    //             console.error("Error fetching job details:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     const fetchLocations = async () => {
    //         try {
    //             const [countriesRes, statesRes, citiesRes] = await Promise.all([
    //                 axios.get("/country"),
    //                 axios.get("/state"),
    //                 axios.get("/city"),
    //             ]);

    //             // Use numeric IDs as keys to match your job object
    //            setLocations({
    //         countries: Object.fromEntries(
    //             countriesRes.data.country.map(c => [c.id, c.name])
    //         ),
    //         states: Object.fromEntries(
    //             statesRes.data.state.map(s => [s.id, s.name])
    //         ),
    //         cities: Object.fromEntries(
    //             citiesRes.data.data.map(ct => [ct.id, ct.name])
    //         ),
    //     });
    //         } catch (err) {
    //             console.error("Error fetching locations:", err);
    //         }
    //     };

    //     fetchJob();
    //     fetchLocations();
    // }, [id]);

    const handleApplyClick = () => {
        setSelectedJob(job); // job is the current job loaded
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedJob(null);
        setIsModalOpen(false);
    };



    const getLocationString = () => {
        const parts = [locationNames.city, locationNames.state, locationNames.country].filter(Boolean);
        return parts.length ? parts.join(", ") : "Location not specified";
    };



    // Helper functions for sidebar jobs
    const getSidebarLocationString = (jobId) => {
        const loc = locationNamesMap[jobId];
        if (!loc) return "Location not specified";
        const parts = [loc.city, loc.state, loc.country].filter(Boolean);
        return parts.length ? parts.join(", ") : "Location not specified";
    };

    const getCompanyLogo = (jobItem) => {
        const baseURL = import.meta.env.VITE_BACKEND_URL;
        if (jobItem.companyId?.company?.employerLogo) {
            return `${baseURL}${jobItem.companyId.company.employerLogo}`;
        }
        return null;
    };

    const getCompanyName = (jobItem) => {
        return jobItem.companyId?.company?.name || "Company";
    };

    const handleSidebarJobClick = (jobItem) => {
        navigate(`/job-details/${jobItem._id}`);
    };

    const handleSidebarApplyClick = (jobItem, e) => {
        e.stopPropagation();
        setSelectedJob(jobItem);
        setIsModalOpen(true);
    };

    if (loading)
        return <div className="text-center py-10 text-gray-600 text-lg">Loading...</div>;
    if (!job)
        return <div className="text-center py-10 text-gray-600 text-lg">Job not found</div>;





    // Location formatter
    // const getLocationString = () => {    
    //     if (!job?.city && !job?.state && !job?.country) return "Location not specified";

    //     const cityName = locations.cities[job.city];
    //     const stateName = locations.states[job.state];
    //     const countryName = locations.countries[job.country];

    //     const parts = [cityName, stateName, countryName].filter(Boolean);
    //     return parts.length ? parts.join(", ") : "Location not specified";
    // };





    return (

        <div className="">

            <section className="bg-[linear-gradient(to_right,_#090A47,_#20AEB2)] w-full min-h-[300px] sm:min-h-[350px] md:min-h-[400px] flex justify-center items-center text-center font-[Poppins] px-4">
                <div className="max-w-3xl space-y-4">
                    <h1 className="text-white text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
                        {job?.jobTitle}
                    </h1>

                    <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium px-2 sm:px-6">
                        {job?.description}
                    </p>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8  py-12 px-4">

                <section className="lg:col-span-2">

                    {/* <button
                        onClick={() => navigate(-1)}
                        className="mb-8 inline-flex items-center gap-2 text-[#339ca0] font-medium px-5 py-2 rounded-lg border border-[#339ca0] hover:bg-[#339ca0] hover:text-white transition-all duration-300 shadow-sm"
                    >
                        ← Back
                    </button> */}

                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 transform transition-all duration-300 hover:shadow-3xl">

                        {/* Hero Header Section */}
                        <div className="relative bg-gradient-to-br from-[#00b6bd] via-[#339ca0] to-[#2a7f83] p-6 text-white overflow-hidden">
                            {/* Animated Background Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mt-20 -mr-20 animate-pulse"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -mb-20 -ml-20 animate-pulse delay-1000"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full animate-pulse delay-500"></div>

                            {/* Floating Particles */}
                            <div className="absolute top-10 left-20 w-4 h-4 bg-white/20 rounded-full animate-bounce"></div>
                            <div className="absolute bottom-16 right-32 w-3 h-3 bg-white/30 rounded-full animate-bounce delay-300"></div>
                            <div className="absolute top-32 right-20 w-2 h-2 bg-white/25 rounded-full animate-bounce delay-700"></div>


                            <button
                                onClick={() => navigate(-1)}
                                className=" absolute top-5 right-5 mb-8 inline-flex items-center gap-2 text-white font-medium px-5 py-2 rounded-lg border bo border-white hover:bg-[#339ca0] hover:text-white transition-all duration-300 shadow-sm"
                            >
                                ← Back
                            </button>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-3 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                                    <span className="text-yellow-300 font-semibold text-lg">Featured Job</span>
                                </div>

                                <h1 className="text-4xl md:text-4xl font-bold mb-2 leading-tight bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
                                    {job.jobTitle}
                                </h1>

                                <p className="text-white/90 text-lg leading-relaxed max-w-4xl backdrop-blur-sm bg-white/10 p-3 rounded-2xl border border-white/20">
                                    {job.description}
                                </p>
                            </div>
                        </div>

                        {/* Key Info Cards - Modern Grid */}
                        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-gradient-to-br from-gray-50 to-blue-50/30">
                            {!job.hideSalary && (
                                <div className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
                                    <div className="relative z-10">
                                        <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <FaMoneyBill className="text-white text-2xl" />
                                        </div>
                                        <p className="font-bold text-gray-800 text-lg mb-1">
                                            {job.salaryFrom} - {job.salaryTo} {job.salaryCurrency}
                                        </p>
                                        <span className="text-gray-500 text-sm font-medium">{job.salaryPeriod && `/ ${job.salaryPeriod}`}</span>
                                        <div className="mt-3 text-xs text-green-600 font-semibold">💰 Competitive Salary</div>
                                    </div>
                                </div>
                            )}

                            {job.jobType && (
                                <div className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500"></div>
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <FaBriefcase className="text-white text-2xl" />
                                        </div>
                                        <p className="font-bold text-gray-800 text-sm mb-1">
                                            {job.jobType?.name || job.jobType}
                                        </p>
                                        <span className="text-gray-500 text-sm font-medium">Job Type</span>
                                        <div className="mt-3 text-xs text-purple-600 font-semibold">💼 Work Style</div>
                                    </div>
                                </div>
                            )}

                            {job.jobShift && (
                                <div className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <FaClock className="text-white text-2xl" />
                                        </div>
                                        <p className="font-bold text-gray-800 text-sm mb-1">
                                            {job.jobShift?.name || job.jobShift}
                                        </p>
                                        <span className="text-gray-500 text-sm font-medium">Shift</span>
                                        <div className="mt-3 text-xs text-orange-600 font-semibold">⏰ Timing</div>
                                    </div>
                                </div>
                            )}

                            <div className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-500"></div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <FaMapMarkerAlt className="text-white text-2xl" />
                                    </div>
                                    <p className="font-bold text-gray-800 text-sm mb-1">
                                        {getLocationString()}
                                    </p>
                                    <span className="text-gray-500 text-sm font-medium">Location</span>
                                    <div className="mt-3 text-xs text-blue-600 font-semibold">📍 Work Location</div>
                                </div>
                            </div>
                        </div>

                        {/* Skills Section - Modern Tags */}
                        {job.skills?.length > 0 && (
                            <div className="p-10 border-t border-gray-200 bg-gradient-to-r from-white to-indigo-50/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -mt-16 -mr-16"></div>

                                <h3 className="text-2xl font-bold text-gray-800 mb-6 relative z-10 flex items-center gap-3">
                                    <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                                    Required Skills & Technologies
                                </h3>

                                <div className="flex flex-wrap gap-3 relative z-10">
                                    {job.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-2 text-sm font-semibold rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 cursor-pointer border border-indigo-400/30 group relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300"></div>
                                            <span className="relative z-10 flex items-center gap-2">

                                                {typeof skill === "object" ? skill.name : skill}
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Benefits Section - Modern Card */}
                        {job.benefits && (
                            <div className="p-10 border-t border-gray-200 bg-gradient-to-r from-emerald-50 to-green-50/30 relative overflow-hidden">
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-emerald-200 to-green-200 rounded-full opacity-50"></div>

                                <h3 className="text-2xl font-bold text-gray-800 mb-6 relative z-10 flex items-center gap-3">
                                    <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full"></div>
                                    Perks & Benefits
                                </h3>

                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-100 relative z-10">
                                    <p className="text-gray-700 text-lg leading-relaxed font-medium">
                                        {job.benefits}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Additional Info Section - Modern Grid */}
                        <div className="p-10 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-gradient-to-br from-amber-50 to-orange-50/20">
                            <div className="group bg-white/90 backdrop-blur-sm p-4 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-amber-100">
                                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                                    <FaBriefcase className="text-white text-2xl" />
                                </div>
                                <span className="font-bold text-amber-600 block mb-2 text-sm uppercase tracking-wide">Experience</span>
                                <p className="text-gray-800 font-semibold text-lg">{job.experience || "Flexible"}</p>
                            </div>

                            <div className="group bg-white/90 backdrop-blur-sm p-4 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-blue-100">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                                    <FaGraduationCap className="text-white text-2xl" />
                                </div>
                                <span className="font-bold text-blue-600 block mb-2 text-sm uppercase tracking-wide">Degree Level</span>
                                <p className="text-gray-800 font-semibold text-lg">{job.degreeLevel.name || "Any Graduate"}</p>
                            </div>

                            <div className="group bg-white/90 backdrop-blur-sm p-4 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-green-100">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                                    <FaUsers className="text-white text-2xl" />
                                </div>
                                <span className="font-bold text-green-600 block mb-2 text-sm uppercase tracking-wide">Positions</span>
                                <p className="text-gray-800 font-semibold text-lg">{job.positions || "Multiple"}</p>
                            </div>

                            <div className="group bg-white/90 backdrop-blur-sm p-4 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-red-100">
                                <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                                    <FaCalendar className="text-white text-2xl" />
                                </div>
                                <span className="font-bold text-red-600 block mb-2 text-sm uppercase tracking-wide">Apply Before</span>
                                <p className="text-gray-800 font-semibold text-lg">
                                    {job.expiryDate ? new Date(job.expiryDate).toLocaleDateString() : "Open"}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons - Modern Design */}
                        <div className="p-8 flex flex-col md:flex-row gap-6 justify-center items-center border-t border-gray-200 bg-gradient-to-r from-slate-50 to-gray-100/50">
                            <button
                                onClick={handleApplyClick}
                                className="group relative bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-0 py-3 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 min-w-[200px] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                                    🚀 Apply Now
                                </span>
                            </button>

                            <button
                                onClick={() => navigate(-1)}
                                className="group relative bg-white text-gray-700 font-bold px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 border-2 border-gray-300 hover:border-gray-400 min-w-[200px] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                                    ↩️ Back to Jobs
                                </span>
                            </button>
                        </div>

                        {/* Comments Section */}
                        <div className="p-10 border-t border-gray-200 bg-gradient-to-br from-white to-blue-50/20">
                            <CommentCards
                                isLoggedIn={isLoggedIn}
                                blogId={job._id}
                                type="job"
                                title="Share Your Thoughts"
                                des={
                                    <p className="text-sm text-gray-600 mb-4">
                                        Your email address will <span className="italic">not</span> be published.
                                        Required fields are marked <span className="text-red-500">*</span>
                                    </p>
                                }
                                checkbox="Save my name, email, and website in this browser for the next time I comment."
                                onCommentAdded={handleCommentAdded}
                            />
                            <CommentList
                                comments={comments}
                                commentCount={commentCount}
                                setComments={setComments}
                                onCommentUpdate={fetchComments}
                            />
                        </div>
                    </div>
                </section>

                {/* Sidebar - 1/3 width */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 space-y-6">
                        {/* Similar Jobs Section */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-[#339ca0] to-[#2a7f83] p-4 text-white">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <FaBriefcase className="text-white" />
                                    Similar Jobs
                                </h3>
                                <p className="text-white/80 text-sm mt-1">Other opportunities you might like</p>
                            </div>

                            <div className="p-4">
                                {sidebarLoading ? (
                                    <div className="text-center py-4 text-gray-500">Loading similar jobs...</div>
                                ) : sidebarJobs.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500">No similar jobs found</div>
                                ) : (
                                    <div className="space-y-4">
                                        {sidebarJobs.map((jobItem) => {
                                            const companyLogo = getCompanyLogo(jobItem);
                                            const companyName = getCompanyName(jobItem);

                                            return (
                                                <div
                                                    key={jobItem._id}
                                                    onClick={() => handleSidebarJobClick(jobItem)}
                                                    className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-[#339ca0] hover:shadow-md transition-all duration-300 cursor-pointer group"
                                                >
                                                    {/* Company Logo and Name */}
                                                    <div className="flex items-center gap-3 mb-3">
                                                        {companyLogo ? (
                                                            <img
                                                                src={companyLogo}
                                                                alt={companyName}
                                                                className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] rounded-lg border border-gray-200 flex items-center justify-center">
                                                                <span className="text-[#00796b] font-bold text-sm">
                                                                    {companyName.charAt(0)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-gray-900 text-sm group-hover:text-[#339ca0] transition-colors line-clamp-1">
                                                                {jobItem.jobTitle}
                                                            </h4>
                                                            <p className="text-xs text-gray-600 truncate">{companyName}</p>
                                                        </div>
                                                    </div>

                                                    {/* Job Details */}
                                                    <div className="space-y-2 text-xs text-gray-600">
                                                        {/* Location */}
                                                        <div className="flex items-center gap-2">
                                                            <FaMapMarkerAlt className="text-[#339ca0] text-xs flex-shrink-0" />
                                                            <span className="line-clamp-1">
                                                                {getSidebarLocationString(jobItem._id)}
                                                            </span>
                                                        </div>

                                                        {/* Job Type */}
                                                        {jobItem.jobType?.name && (
                                                            <div className="flex items-center gap-2">
                                                                <FaBriefcase className="text-[#339ca0] text-xs flex-shrink-0" />
                                                                <span>{jobItem.jobType.name}</span>
                                                            </div>
                                                        )}

                                                        {/* Salary */}
                                                        {!jobItem.hideSalary && jobItem.salaryFrom && (
                                                            <div className="flex items-center gap-2">
                                                                <FaMoneyBill className="text-[#339ca0] text-xs flex-shrink-0" />
                                                                <span className="line-clamp-1">
                                                                    {jobItem.salaryFrom} - {jobItem.salaryTo} {jobItem.salaryCurrency}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Skills Preview */}
                                                    {jobItem.skills?.length > 0 && (
                                                        <div className="mt-3 flex flex-wrap gap-1">
                                                            {jobItem.skills.slice(0, 2).map((skill, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="px-2 py-1 bg-[#339ca0]/10 text-[#339ca0] text-xs rounded-md"
                                                                >
                                                                    {typeof skill === "object" ? skill.name : skill}
                                                                </span>
                                                            ))}
                                                            {jobItem.skills.length > 2 && (
                                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                                                    +{jobItem.skills.length - 2} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Action Buttons */}
                                                    <div className="mt-3 flex gap-2">
                                                        <button
                                                            onClick={() => handleSidebarJobClick(jobItem)}
                                                            className="flex-1 bg-white border border-[#339ca0] text-[#339ca0] text-sm font-medium py-2 rounded-lg hover:bg-[#339ca0] hover:text-white transition-colors"
                                                        >
                                                            View Details
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleSidebarApplyClick(jobItem, e)}
                                                            className="flex-1 bg-[#339ca0] hover:bg-[#2a7f83] text-white text-sm font-medium py-2 rounded-lg transition-colors"
                                                        >
                                                            Apply
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats Section */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                Job Statistics
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Views</span>
                                    <span className="font-semibold text-gray-800">{likeCount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Posted</span>
                                    <span className="font-semibold text-gray-800">
                                        {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Expires</span>
                                    <span className="font-semibold text-gray-800">
                                        {job.expiryDate ? new Date(job.expiryDate).toLocaleDateString() : 'Open'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-3">Quick Actions</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={handleApplyClick}
                                    className="w-full bg-[#339ca0] hover:bg-[#2a7f83] text-white font-medium py-2 rounded-lg transition-colors"
                                >
                                    Apply for this Job
                                </button>
                                <button
                                    onClick={() => navigate('/placement-program')}
                                    className="w-full bg-white border border-[#339ca0] text-[#339ca0] hover:bg-[#339ca0] hover:text-white font-medium py-2 rounded-lg transition-colors"
                                >
                                    Browse All Jobs
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>




            {isModalOpen && selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative shadow-lg">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            &times;
                        </button>

                        <h3 className="text-2xl font-bold mb-2">{selectedJob.jobTitle}</h3>
                        <p className="text-gray-700 mb-6">{selectedJob.description}</p>

                        <JobApplicationForm jobId={selectedJob._id} closeModal={closeModal} />
                    </div>
                </div>
            )}

        </div>
    );
}
