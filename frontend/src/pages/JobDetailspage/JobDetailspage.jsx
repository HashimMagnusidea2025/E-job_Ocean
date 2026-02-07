import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios.js";
import {
    FaMapMarkerAlt,
    FaClock,
    FaBriefcase,
    FaMoneyBill,
    FaGraduationCap,
    FaBuilding,
    FaCalendar,
    FaShareAlt,
    FaBookmark,
    FaExternalLinkAlt,
    FaCheckCircle,
    FaIndustry,
    FaUserTie,
    FaStar,
    FaRegStar,
    FaArrowLeft
} from "react-icons/fa";
import { SiLevelsdotfyi } from "react-icons/si";
import { MdWork, MdLocationOn, MdAccessTime } from "react-icons/md";
import { BsFillBagCheckFill, BsClockHistory } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { JobApplicationForm } from "../../components/ui/cards/cards.jsx";
export default function JobDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [locationNames, setLocationNames] = useState({
        city: "",
        state: "",
        country: ""
    });
    const [sidebarJobs, setSidebarJobs] = useState([]);
    const [sidebarLoading, setSidebarLoading] = useState(true);
    const [locationNamesMap, setLocationNamesMap] = useState({});
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [activeTab, setActiveTab] = useState("description");

    const type = "job";

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const fetchComments = async () => {
        try {
            const res = await axios.get(`/comment/${id}?type=${type}`);
            setComments(res.data.comments);
            setCommentCount(res.data.count);
        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [id, type]);


    const fetchLocationNames = async (ids = [], apiPath) => {
  if (!Array.isArray(ids) || !ids.length) return [];

  try {
    const requests = ids.map(id =>
      axios
        .get(`/${apiPath}/${id}`)
        .then(res => res.data?.data?.name || res.data?.name)
        .catch(() => null)
    );

    const results = await Promise.all(requests);
    return results.filter(Boolean);
  } catch {
    return [];
  }
};

    // useEffect(() => {
    //     const fetchJobAndLocations = async () => {
    //         try {
    //             const jobResponse = await axios.get(`/job-post/${id}`);
    //             const jobData = jobResponse.data;
    //             console.log(jobData);

    //             setJob(jobData);

    //             const locationPromises = [];

    //             if (jobData.country) {
    //                 locationPromises.push(
    //                     axios.get(`/country/${jobData.country}`)
    //                         .then(res => res.data.data?.name || "Unknown Country")
    //                         .catch(() => "Unknown Country")
    //                 );
    //             } else {
    //                 locationPromises.push(Promise.resolve(""));
    //             }

    //             if (jobData.state) {
    //                 locationPromises.push(
    //                     axios.get(`/state/${jobData.state}`)
    //                         .then(res => res.data.data?.name || "Unknown State")
    //                         .catch(() => "Unknown State")
    //                 );
    //             } else {
    //                 locationPromises.push(Promise.resolve(""));
    //             }

    //             if (jobData.city) {
    //                 locationPromises.push(
    //                     axios.get(`/city/${jobData.city}`)
    //                         .then(res => res.data.data?.name || "Unknown City")
    //                         .catch(() => "Unknown City")
    //                 );
    //             } else {
    //                 locationPromises.push(Promise.resolve(""));
    //             }

    //             const [countryName, stateName, cityName] = await Promise.all(locationPromises);

    //             setLocationNames({
    //                 country: countryName,
    //                 state: stateName,
    //                 city: cityName
    //             });

    //         } catch (error) {
    //             console.error("Error fetching job details:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchJobAndLocations();
    // }, [id]);
useEffect(() => {
  const fetchJobAndLocations = async () => {
    try {
      const jobResponse = await axios.get(`/job-post/${id}`);
      const jobData = jobResponse.data;
      setJob(jobData);

      const [countryNames, stateNames, cityNames] = await Promise.all([
        fetchLocationNames(jobData.country, "country"),
        fetchLocationNames(jobData.state, "state"),
        fetchLocationNames(jobData.city, "city"),
      ]);

      setLocationNames({
        country: countryNames.join(", "),
        state: stateNames.join(", "),
        city: cityNames.join(", "),
      });

    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchJobAndLocations();
}, [id]);

    useEffect(() => {
        const fetchSidebarJobs = async () => {
            try {
                const response = await axios.get("/job-post/active");
                const jobsData = response.data;

                const filteredJobs = jobsData
                    .filter(jobItem => jobItem._id !== id)
                    .slice(0, 5);

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

    const handleApplyClick = () => {
        setSelectedJob(job);
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

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: job?.jobTitle,
                text: `Check out this job: ${job?.jobTitle}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        // Add API call to bookmark job here
    };

    const formatSalary = () => {
        if (job?.hideSalary) return "Salary not disclosed";
        if (job?.salaryFrom && job?.salaryTo) {
            return `${job.salaryFrom} - ${job.salaryTo} ${job.salaryCurrency}`;
        }
        if (job?.salaryFrom) return `From ${job.salaryFrom} ${job.salaryCurrency}`;
        return "Negotiable";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#339ca0]"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Not Found</h2>
                    <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
                    <button
                        onClick={() => navigate("/placement-program")}
                        className="bg-[#339ca0] text-white px-6 py-3 rounded-lg hover:bg-[#2a7d80] transition-colors"
                    >
                        Browse All Jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-[linear-gradient(to_right,_#090A47,_#20AEB2)] to-black text-white">
                <div className="container mx-auto px-4 py-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                    >
                        <FaArrowLeft /> Back to Jobs
                    </button>

                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                {/* <span className="px-3 py-1 bg-[#339ca0]/20 text-[#339ca0] rounded-full text-sm font-medium">
                                    {job.jobType?.name }
                                </span> */}
                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                                    Featured
                                </span> 
                                {/* <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                                    {job.mode}
                                </span> */}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                {job.jobTitle}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-white/80">
                                <div className="flex items-center gap-2">
                                    <FaBuilding className="text-white" />
                                    <span>{job.companyId?.company?.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MdLocationOn className="text-white" />
                                    <span>{getLocationString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BsClockHistory className="text-white" />
                                    <span>Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleShare}
                                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                            >
                                <FaShareAlt />
                            </button>

                            <button
                                onClick={handleApplyClick}
                                className="bg-white text-[#090A47] px-6 py-3 rounded-lg font-semibold 
                   hover:bg-gray-100 hover:scale-[1.03] 
                   shadow-lg transition-all duration-300"
                            >
                                Apply Now
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {job.experience && (
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <FaBriefcase className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Experience</p>
                                            <p className="font-semibold text-sm text-gray-800 mt-2">{job.experience} Years</p>
                                        </div>
                                    </div>
                                </div>
                            )}



                            {job?.degreeLevel?.name && (
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <FaGraduationCap className="text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Qualification</p>
                                            <p className="font-semibold text-sm text-gray-800 mt-2">{job.degreeLevel?.name}</p>
                                        </div>
                                    </div>
                                </div>
                            )}


                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <FaLocationDot className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm  text-gray-600">Location</p>
                                        <p className="font-semibold text-sm text-gray-800 mt-2">
                                            {job.address && (
                                                <span> {job?.address} </span>
                                            )}
                                            {getLocationString()}</p>
                                    </div>
                                </div>
                            </div>
                            {job?.mode && (
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-50 rounded-lg">
                                            <FaCalendar className="text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Mode</p>
                                            <p className="font-semibold text-sm text-gray-800 mt-2">
                                                {job.mode}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                            <div className="border-b border-gray-200">
                                <div className="flex space-x-8 px-6">
                                    <button
                                        onClick={() => setActiveTab("description")}
                                        className={`py-4 font-medium border-b-2 transition-colors ${activeTab === "description" ? "border-[#339ca0] text-[#339ca0]" : "border-transparent text-gray-600 hover:text-gray-900"}`}
                                    >
                                         Description
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("requirements")}
                                        className={`py-4 font-medium border-b-2 transition-colors ${activeTab === "requirements" ? "border-[#339ca0] text-[#339ca0]" : "border-transparent text-gray-600 hover:text-gray-900"}`}
                                    >
                                        Requirements
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("skills")}
                                        className={`py-4 font-medium border-b-2 transition-colors ${activeTab === "skills" ? "border-[#339ca0] text-[#339ca0]" : "border-transparent text-gray-600 hover:text-gray-900"}`}
                                    >
                                        Skills
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                {activeTab === "description" && (
                                    <div className="prose max-w-none">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h3>
                                        <p className="text-gray-700 whitespace-pre-line">
                                            {job.description || "No description provided."}
                                        </p>

                                        {job.responsibilities && (
                                            <div className="mt-6">
                                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Key Responsibilities</h4>
                                                <ul className="space-y-2">
                                                    {job.responsibilities.split('\n').map((item, index) => (
                                                        <li key={index} className="flex items-start gap-2">
                                                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                                            <span className="text-gray-700">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "requirements" && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Requirements</h3>

                                        {job.experience && (
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-semibold text-gray-800 mb-2">Experience</h4>
                                                <p className="text-gray-700">{job.experience} Years</p>
                                            </div>
                                        )}

                                        {job.degreeLevel?.name && (
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-semibold text-gray-800 mb-2">Education</h4>
                                                <p className="text-gray-700">{job.degreeLevel.name}</p>
                                            </div>
                                        )}

                                        {job.specialization?.name && (
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-semibold text-gray-800 mb-2">Specialization</h4>
                                                <p className="text-gray-700">{job.specialization.name}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "skills" && job.skills?.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Required Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {job.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-4 py-2 bg-gradient-to-r from-[#339ca0]/10 to-[#2a7d80]/10 text-[#339ca0] rounded-full text-sm font-medium border border-[#339ca0]/20"
                                                >
                                                    {typeof skill === "object" ? skill.name : skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Additional Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div className="flex items-start gap-3">
                                    <MdLocationOn className="text-[#339ca0] mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-gray-800 mb-1">Address</h4>
                                        {job.address && (

                                            <p className="text-gray-700">{job.address}</p>

                                        )}
                                        <span className="text-gray-700">
                                            {getLocationString()}
                                        </span>
                                    </div>
                                </div>


                                {job.mode && (
                                    <div className="flex items-start gap-3">
                                        <FaBuilding className="text-[#339ca0] mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-gray-800 mb-1">Work Mode</h4>
                                            <p className="text-gray-700">{job.mode}</p>
                                        </div>
                                    </div>
                                )}

                                {/* {job.jobType?.name && (
                                    <div className="flex items-start gap-3">
                                        <FaBriefcase className="text-[#339ca0] mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-gray-800 mb-1">Job Type</h4>
                                            <p className="text-gray-700">{job.jobType.name}</p>
                                        </div>
                                    </div>
                                )} */}

                                {job.industry?.name && (
                                    <div className="flex items-start gap-3">
                                        <FaIndustry className="text-[#339ca0] mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-gray-800 mb-1">Industry</h4>
                                            <p className="text-gray-700">{job.industry.name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Company Card */}
                            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    {job.companyId?.company?.employerLogo ? (
                                        <img
                                            src={`${import.meta.env.VITE_BACKEND_URL}${job.companyId.company.employerLogo}`}
                                            alt={job.companyId.company.name}
                                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#339ca0] to-[#2a7d80] rounded-lg flex items-center justify-center">
                                            <span className="text-white text-xl font-bold">
                                                {job.companyId?.company?.name?.charAt(0) || "C"}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{job.companyId?.company?.name || "Company"}</h3>
                                        <p className="text-sm text-gray-600">
                                            {job.companyId?.company?.website || "No website"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => window.open(job.companyId?.company?.website, '_blank')}
                                    className="w-full border border-[#339ca0] text-[#339ca0] py-2 rounded-lg font-medium hover:bg-[#339ca0] hover:text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    Visit Website <FaExternalLinkAlt />
                                </button>
                            </div> */}

                            {/* Similar Jobs */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="font-semibold text-gray-800">Similar Jobs</h3>
                                </div>
                                <div className="p-6">
                                    {sidebarLoading ? (
                                        <div className="text-center py-4 text-gray-500">Loading similar jobs...</div>
                                    ) : sidebarJobs.length === 0 ? (
                                        <div className="text-center py-4 text-gray-500">No similar jobs found</div>
                                    ) : (
                                        <div className="space-y-4">
                                            {sidebarJobs.map((jobItem) => (
                                                <div
                                                    key={jobItem._id}
                                                    className="group cursor-pointer"
                                                    onClick={() => handleSidebarJobClick(jobItem)}
                                                >
                                                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                                        {getCompanyLogo(jobItem) ? (
                                                            <img
                                                                src={getCompanyLogo(jobItem)}
                                                                alt={getCompanyName(jobItem)}
                                                                className="w-12 h-12 rounded-lg object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                                <span className="text-gray-600 font-bold">
                                                                    {getCompanyName(jobItem).charAt(0)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-gray-800 group-hover:text-[#339ca0] transition-colors line-clamp-1">
                                                                {jobItem.jobTitle}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 truncate">
                                                                {getCompanyName(jobItem)}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <MdLocationOn className="text-gray-400 text-xs" />
                                                                <span className="text-xs text-gray-500">
                                                                    {getSidebarLocationString(jobItem._id)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Apply Card */}
                            <div className="bg-gradient-to-br from-[#339ca0] to-[#2a7d80] rounded-xl p-6 text-white">
                                <h3 className="font-semibold text-lg mb-2">Ready to Apply?</h3>
                                <p className="text-white/80 text-sm mb-6">
                                    Submit your application and take the next step in your career.
                                </p>
                                <button
                                    onClick={handleApplyClick}
                                    className="w-full bg-white text-[#339ca0] py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    Apply Now
                                </button>
                                <div className="mt-6 pt-6 border-t border-white/20">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white/80">Posted</span>
                                        <span className="font-medium">
                                            {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-2">
                                        <span className="text-white/80">Expires</span>
                                        <span className="font-medium">
                                            {job.expiryDate ? new Date(job.expiryDate).toLocaleDateString() : "Open"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Modal */}
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
                        {/* <p className="text-gray-700 mb-6">{selectedJob.description}</p> */}

                        <JobApplicationForm jobId={selectedJob._id} closeModal={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
}