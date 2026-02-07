import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaClock, FaMoneyBill, FaUserAlt, FaBuilding, FaWrench, FaHeart, FaEye, FaComment } from "react-icons/fa";
import axios from "../../../../utils/axios.js";
import depositphotos from "../../../../media/jpg/depositphotos.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Grid } from "swiper/modules";
import { FaBriefcase } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const tabs = ["Job Vacancies", "CA Articleship", "Industrial Training", "Internships"];
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { JobApplicationForm } from "../../../ui/cards/cards.jsx";
import { ViewButton, CommentButton, LikeButtonSimple, FavoriteButton } from "../../../ui/button/button.jsx";
import { useParams } from "react-router";
import Select from "react-select";
import { useLocation } from "react-router-dom";
const baseURL = import.meta.env.VITE_BACKEND_URL;
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function OpportunitiesSection() {
    const { id } = useParams();
    const type = "job";
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState()

    const POSTS_PER_PAGE = 8;
    const [currentPage, setCurrentPage] = useState(1);

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        country: "",
        state: "",
        city: "",
        resume: null,
    });

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchTitle = queryParams.get("title")?.toLowerCase() || "";
    const searchLocation = queryParams.get("location")?.toLowerCase() || "";

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Temporary filter states (for dropdown selection)

    const [tempCountryFilter, setTempCountryFilter] = useState("");
    const [tempStateFilter, setTempStateFilter] = useState("");
    const [tempCityFilter, setTempCityFilter] = useState("");

    // Applied filter states (actual filters)
    const [appliedCountryFilter, setAppliedCountryFilter] = useState("");
    const [appliedStateFilter, setAppliedStateFilter] = useState("");
    const [appliedCityFilter, setAppliedCityFilter] = useState("");
    const [appliedModeFilter, setAppliedModeFilter] = useState("");
    const [appliedExperienceFilter, setAppliedExperienceFilter] = useState("");

    // New state for dropdowns
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [loadingDropdown, setLoadingDropdown] = useState({
        countries: false,
        states: false,
        cities: false,
    });
    const [locationNamesMap, setLocationNamesMap] = useState({});
    const [jobLikes, setJobLikes] = useState({});
    const [jobLikedStatus, setJobLikedStatus] = useState({});
    const [jobComments, setJobComments] = useState({});

    const [tempModeFilter, setTempModeFilter] = useState("");
    const [tempExperienceFilter, setTempExperienceFilter] = useState("");

    //  Filter jobs based on APPLIED filters (not temporary ones)
    const filteredJobs = jobs.filter((job) => {
        // Match country/state/city using job.country, job.state, job.city
        const matchesCountry = appliedCountryFilter ? job.country == appliedCountryFilter : true;
        const matchesState = appliedStateFilter ? job.state == appliedStateFilter : true;
        const matchesCity = appliedCityFilter ? job.city == parseInt(appliedCityFilter) : true;

        // Match mode (onsite, remote, hybrid)
        const matchesMode = appliedModeFilter ? job.mode?.toLowerCase() === appliedModeFilter.toLowerCase() : true;

        // Match experience (fresher, 1-3, 3-5, 5+)
        const matchesExperience = appliedExperienceFilter ? job.experience?.toLowerCase() === appliedExperienceFilter.toLowerCase() : true;


        //  Search from HeroSection (title / keyword / location)
        const matchesTitle = searchTitle
            ? job.jobTitle?.toLowerCase().includes(searchTitle) ||
            job.skills?.some((s) =>
                (typeof s === "object" ? s.name : s)?.toLowerCase().includes(searchTitle)
            )
            : true;

        const getLocationString = (jobId) => {
            const loc = locationNamesMap[jobId];
            if (!loc) return "Location not specified";
            const parts = [loc.city, loc.state, loc.country].filter(Boolean);
            return parts.length ? parts.join(", ") : "Location not specified";
        };

        const normalize = (str) =>
            str?.toLowerCase().replace(/,/g, '').replace(/\s+/g, ' ').trim();

        const matchesSearchLocation = searchLocation
            ? normalize(getLocationString(job._id)).includes(normalize(searchLocation))
            : true;


        // Combine all
        return (
            matchesCountry &&
            matchesState &&
            matchesCity &&
            matchesMode &&
            matchesExperience &&
            matchesTitle &&
            matchesSearchLocation
        );
    });
    const totalPages = Math.ceil(filteredJobs.length / POSTS_PER_PAGE);

    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const paginatedJobs = filteredJobs.slice(
        startIndex,
        startIndex + POSTS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredJobs.length]);

    const handleReadMore = async (job) => {
        try {
            console.log("Incrementing view for job:", job._id);
            await axios.post(`/blogs/like/view/${job._id}?type=job`);
            navigate(`/job-details/${job._id}`)
        } catch (err) {
            console.error("Error incrementing view:", err);
            navigate(`/job-details/${job._id}`);
        }
    };

    // Fetch countries for filter dropdown
    useEffect(() => {
        const loadCountries = async () => {
            setLoadingDropdown(prev => ({ ...prev, countries: true }));
            try {
                const response = await axios.get("/country");
                // Try different response structures
                const countriesData = response.data.country || response.data.data || response.data || [];
                setCountries(countriesData);

            } catch (error) {
                console.error("Failed to fetch countries:", error);
                alert("Failed to load countries");
            } finally {
                setLoadingDropdown(prev => ({ ...prev, countries: false }));
            }
        };
        loadCountries();
    }, []);

    // Fetch states based on selected country filter
    useEffect(() => {
        const loadStates = async () => {
            if (!tempCountryFilter) {
                setStates([]);
                setTempStateFilter("");
                setTempCityFilter("");
                return;
            }
            setLoadingDropdown(prev => ({ ...prev, states: true }));
            try {
                const response = await axios.get(`/state/country/${tempCountryFilter}`);
                // Try different response structures
                const statesData = response.data.data || response.data.states || response.data || [];
                setStates(statesData);
                console.log("States loaded for country:", tempCountryFilter, statesData);
            } catch (error) {
                console.error("Failed to fetch states:", error);
                setStates([]);
            } finally {
                setLoadingDropdown(prev => ({ ...prev, states: false }));
            }
        };
        loadStates();
    }, [tempCountryFilter]);

    // Fetch cities based on selected state filter
    useEffect(() => {
        const loadCities = async () => {
            if (!tempStateFilter) {
                setCities([]);
                setTempCityFilter("");
                return;
            }
            setLoadingDropdown(prev => ({ ...prev, cities: true }));
            try {
                const response = await axios.get(`/city/state/${tempStateFilter}`);
                // Try different response structures
                const citiesData = response.data.data || response.data.cities || response.data || [];
                setCities(citiesData);
                console.log("Cities loaded for state:", tempStateFilter, citiesData);
            } catch (error) {
                console.error("Failed to fetch cities:", error);
                setCities([]);
            } finally {
                setLoadingDropdown(prev => ({ ...prev, cities: false }));
            }
        };
        loadCities();
    }, [tempStateFilter]);

    // Apply filters handler - NOW filters are applied only when this is clicked
    const handleApplyFilters = () => {
        setAppliedCountryFilter(tempCountryFilter);
        setAppliedStateFilter(tempStateFilter);
        setAppliedCityFilter(tempCityFilter);
        setAppliedModeFilter(tempModeFilter);
        setAppliedExperienceFilter(tempExperienceFilter);
        setCurrentPage(1);


        console.log("Filters applied:", {
            country: tempCountryFilter,
            state: tempStateFilter,
            city: tempCityFilter,
            mode: tempModeFilter,
            experience: tempExperienceFilter
        });
    };

    // Reset filters handler
    const handleResetFilters = () => {
        setTempCountryFilter("");
        setTempStateFilter("");
        setTempCityFilter("");
        setTempModeFilter("");
        setTempExperienceFilter("");
        setCurrentPage(1);

        // Also reset applied filters
        setAppliedCountryFilter("");
        setAppliedStateFilter("");
        setAppliedCityFilter("");
        setAppliedModeFilter("");
        setAppliedExperienceFilter("");
    };

    // Open modal
    const handleApplyClick = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedJob(null);
        setIsModalOpen(false);
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            mobile: "",
            country: "",
            state: "",
            city: "",
            resume: null,
        });
    };

    const handleLike = async (jobId) => {
        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const res = await axios.post(
                "/blogs/like",
                { id: jobId, type: "job" },
                { headers }
            );

            if (res.data.totalCount !== undefined) {
                setJobLikes(prev => ({ ...prev, [jobId]: res.data.totalCount }));
                setJobLikedStatus(prev => ({ ...prev, [jobId]: true }));
            }
        } catch (err) {
            console.error("Like error details:", err);
            if (err.response?.data?.message === "Already liked") {
                alert("You've already liked this job");
            } else {
                alert("Failed to like job: " + (err.response?.data?.message || err.message));
            }
        }
    };
    const fetchNamesByIds = async (ids = [], apiPath) => {
        if (!Array.isArray(ids) || ids.length === 0) return [];

        const requests = ids.map(id =>
            axios
                .get(`/${apiPath}/${id}`)
                .then(res => res.data?.data?.name || res.data?.name)
                .catch(() => null)
        );

        const results = await Promise.all(requests);
        return results.filter(Boolean);
    };
    // Fetch all job data (likes, views, comments)
    useEffect(() => {
        const fetchAllJobData = async () => {
            if (jobs.length === 0) return;

            try {
                const likePromises = jobs.map(async (job) => {
                    try {
                        const res = await axios.get(`/blogs/like/likes/${job._id}/job`);
                        return { jobId: job._id, likeCount: res.data.totalCount || 0 };
                    } catch (err) {
                        console.error(`Error fetching likes for job ${job._id}:`, err);
                        return { jobId: job._id, likeCount: 0 };
                    }
                });

                const commentPromises = jobs.map(async (job) => {
                    try {
                        const res = await axios.get(`/comment/${job._id}?type=job`);
                        return { jobId: job._id, commentCount: res.data.count || 0 };
                    } catch (err) {
                        console.error(`Error fetching comments for job ${job._id}:`, err);
                        return { jobId: job._id, commentCount: 0 };
                    }
                });

                const [likeResults, commentResults] = await Promise.all([
                    Promise.all(likePromises),
                    Promise.all(commentPromises)
                ]);

                const newJobLikes = {};
                likeResults.forEach(result => {
                    newJobLikes[result.jobId] = result.likeCount;
                });

                const newJobComments = {};
                commentResults.forEach(result => {
                    newJobComments[result.jobId] = result.commentCount;
                });

                setJobLikes(newJobLikes);
                setJobComments(newJobComments);

            } catch (error) {
                console.error("Error fetching job data:", error);
            }
        };

        fetchAllJobData();
    }, [jobs]);

    // Fetch all jobs
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get("/job-post/active");
                // const jobsData = response.data;
                const jobsData = response.data.data || response.data || [];

                console.log(jobsData);


                const locationPromises = jobsData.map(async (job) => {
                    const [countries, states, cities] = await Promise.all([
                        fetchNamesByIds(job.country, "country"),
                        fetchNamesByIds(job.state, "state"),
                        fetchNamesByIds(job.city, "city"),
                    ]);

                    return {
                        jobId: job._id,
                        location: {
                            country: countries,
                            state: states,
                            city: cities,
                        },
                    };
                });

                const locationsArray = await Promise.all(locationPromises);

                const locationsMap = {};
                locationsArray.forEach(item => {
                    locationsMap[item.jobId] = item.location;
                });

                setLocationNamesMap(locationsMap);
                setJobs(jobsData);



            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);
    const formatLocationPart = (arr, label) => {
        if (!arr || arr.length === 0) return "";

        if (arr.length <= 2) return arr.join(", ");
        return `${arr[0]}, ${arr[1]} +${arr.length - 2} ${label}`;
    };

    const getLocationString = (jobId) => {
        const loc = locationNamesMap[jobId];
        if (!loc) return "Location not specified";

        const city = formatLocationPart(loc.city, "cities");
        const state = formatLocationPart(loc.state, "states");
        const country = formatLocationPart(loc.country, "countries");

        return [city, state, country].filter(Boolean).join(", ");
    };


    // const getLocationString = (jobId) => {
    //     const loc = locationNamesMap[jobId];
    //     if (!loc) return "Location not specified";
    //     const parts = [loc.city, loc.state, loc.country].filter(Boolean);
    //     return parts.length ? parts.join(", ") : "Location not specified";
    // };

    const getCompanyLogo = (job) => {
        if (job.companyId?.company?.employerLogo) {
            return `${baseURL}${job.companyId.company.employerLogo}`;
        }
        return null;
    };

    // Get company name
    const getCompanyName = (job) => {
        return job.companyId?.company?.name || "Company";
    };




    return (
        <section className="container mx-auto bg-white">
            <div className="py-20 px-6 w-full">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
                    Job/<span className="text-[#339ca0]"> Articleship Opportunities</span>
                </h2>

                <div className="border border-gray-200 rounded-2xl shadow-sm bg-white py-6">
                    <div className="flex justify-center flex-wrap gap-3">

                        {/*  Country Filter */}
                        <div className="flex flex-col min-w-[180px]">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                            <Select
                                options={[
                                    { value: "", label: "All Countries" },
                                    ...countries.map((c) => ({ value: c.id, label: c.name }))
                                ]}
                                value={countries.find((c) => c.id === tempCountryFilter) ?
                                    { value: tempCountryFilter, label: countries.find((c) => c.id === tempCountryFilter)?.name } :
                                    { value: "", label: "All Countries" }
                                }
                                onChange={(selected) => {
                                    setTempCountryFilter(selected?.value || "");
                                    setTempStateFilter("");
                                    setTempCityFilter("");
                                }}
                                isLoading={loadingDropdown.countries}
                                placeholder="Select Country"
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                }}
                            />
                        </div>

                        {/*  State Filter */}
                        <div className="flex flex-col min-w-[180px]">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                            <Select
                                options={[
                                    { value: "", label: "All States" },
                                    ...states.map((s) => ({ value: s.id, label: s.name }))
                                ]}
                                value={states.find((s) => s.id === tempStateFilter) ?
                                    { value: tempStateFilter, label: states.find((s) => s.id === tempStateFilter)?.name } :
                                    { value: "", label: "All States" }
                                }
                                onChange={(selected) => {
                                    setTempStateFilter(selected?.value || "");
                                    setTempCityFilter("");
                                }}
                                isDisabled={!tempCountryFilter}
                                isLoading={loadingDropdown.states}
                                placeholder={tempCountryFilter ? "Select State" : "Select Country First"}
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                }}
                            />
                        </div>

                        {/*  City Filter */}
                        <div className="flex flex-col min-w-[180px]">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                            <Select
                                options={[
                                    { value: "", label: "All Cities" },
                                    ...cities.map((c) => ({ value: c.id, label: c.name }))
                                ]}
                                value={cities.find((c) => c.id === tempCityFilter) ?
                                    { value: tempCityFilter, label: cities.find((c) => c.id === tempCityFilter)?.name } :
                                    { value: "", label: "All Cities" }
                                }
                                onChange={(selected) => setTempCityFilter(selected?.value || "")}
                                isDisabled={!tempStateFilter}
                                isLoading={loadingDropdown.cities}
                                placeholder={tempStateFilter ? "Select City" : "Select State First"}
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                }}
                            />
                        </div>

                        {/* Mode Filter */}
                        <div className="flex flex-col min-w-[180px]">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Job Mode
                            </label>

                            <Select
                                options={[
                                    { value: "", label: "All Modes" },
                                    { value: "Work From Home", label: "Work From Home" },
                                    { value: "Work From Office", label: "Work From Office" },
                                    { value: "Hybrid", label: "Hybrid" },
                                ]}
                                value={
                                    tempModeFilter
                                        ? { value: tempModeFilter, label: tempModeFilter }
                                        : { value: "", label: "All Modes" }
                                }
                                onChange={(selected) => setTempModeFilter(selected?.value || "")}
                                placeholder="Select Mode"
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                            />
                        </div>


                        {/* Experience Filter */}
                        <div className="flex flex-col min-w-[180px]">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                            <Select
                                options={[
                                    { value: "", label: "All Experience" },
                                    { value: "0-1 years", label: "0-1 Years" },
                                    { value: "1-3 years", label: "1-3 Years" },
                                    { value: "3-5 years", label: "3-5 Years" },
                                    { value: "5-10 years", label: "5-10 Years" },
                                    { value: "10-15 years", label: "10+15 Years" },
                                    { value: "15+ years", label: "15+ Years" },
                                ]}
                                value={
                                    tempExperienceFilter
                                        ? {
                                            value: tempExperienceFilter,
                                            label: tempExperienceFilter === "0-1 years" ? "0-1 Years" :
                                                tempExperienceFilter === "1-3 years" ? "1-3 Years" :
                                                    tempExperienceFilter === "3-5 years" ? "3-5 Years" :
                                                        tempExperienceFilter === "5-10 years" ? "5-10 Years" :
                                                            tempExperienceFilter === "10-15 years" ? "10+10 Years" :
                                                                tempExperienceFilter === "15-20 years" ? "15+20 Years" : ""
                                        }
                                        : { value: "", label: "All Experience" }
                                }
                                onChange={(selected) => setTempExperienceFilter(selected?.value || "")}
                                placeholder="Select Experience"
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                }}
                            />
                        </div>

                        {/* Apply Filter Button */}
                        <div className="flex items-end gap-2">
                            <button
                                onClick={handleApplyFilters}
                                className="bg-[#339ca0] hover:bg-[#2b7f83] text-white font-medium rounded-lg px-5 py-2 transition"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={handleResetFilters}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg px-5 py-2 transition"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Show loading or results */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {[...Array(15)].map((_, index) => (
                            <div key={index} className="p-4 border rounded-lg animate-pulse">
                                <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        {jobs.length === 0 ? "No jobs available" : "No matching jobs found. Try different filters."}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                        {paginatedJobs.map((job) => {
                            const companyLogo = getCompanyLogo(job);
                            const companyName = getCompanyName(job);

                            return (
                                <div key={job._id}>
                                    <div className="bg-white rounded-2xl  p-5 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative border border-gray-200 h-[360px]">

                                        {/* Company Logo */}
                                        <div className="absolute top-0 right-2">
                                            {companyLogo ? (
                                                <img
                                                    src={companyLogo}
                                                    alt={companyName}
                                                    className="w-16 h-16 rounded-xl border-2 border-white shadow-md object-cover bg-white"

                                                />
                                            ) : (
                                                <div className="w-14 h-14 bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] rounded-xl border-2 border-white shadow-md flex items-center justify-center">
                                                    <span className="text-[#00796b] font-bold text-base">
                                                        {companyName.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Content */}
                                        <div className="flex flex-col h-full  mt-7">

                                            {/* Top Section */}
                                            <div>
                                                {/* Company Name */}
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FaBuilding className="text-gray-400" />
                                                    <span className="font-medium truncate line-clamp-1">{companyName}</span>
                                                </div>

                                                {/* Job Title */}
                                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mt-2">
                                                    {job.jobTitle}
                                                </h3>

                                                {/* Job Type / Shift / Location */}
                                                <div className="mt-2 space-y-1 text-sm text-gray-600">
                                                    {job?.mode && (
                                                        <div className="flex items-center gap-2">
                                                            <FaBriefcase className="text-[#339ca0]" />
                                                            <span>{job?.mode}</span>
                                                        </div>
                                                    )}

                                                    {job.degreeLevel?.name && (
                                                        <div className="flex items-center gap-2">
                                                            <FaClock className="text-[#339ca0]" />
                                                            <span>{job.degreeLevel.name}</span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-2">
                                                        <FaMapMarkerAlt className="text-[#339ca0]" />
                                                        <span className="truncate">{getLocationString(job._id)}</span>
                                                    </div>
                                                    {job?.experience && (
                                                        <div className="flex items-center gap-2">
                                                            <FaBriefcase className="text-[#339ca0]" />
                                                            <span className="truncate">{job?.experience} Years</span>
                                                        </div>
                                                    )}

                                                </div>


                                                {job.skills?.length > 0 && (
                                                    <div className="flex items-start gap-2 text-sm mt-3 text-gray-600">
                                                        <FaWrench className="text-[#339ca0] mt-1" />
                                                        <span className="line-clamp-2">
                                                            {job.skills
                                                                .slice(0, 3) //  only first 3 skills
                                                                .map((skill) =>
                                                                    typeof skill === "object" ? skill.name : skill
                                                                )
                                                                .join(", ")}
                                                        </span>
                                                    </div>
                                                )}

                                            </div>

                                            {/* Interaction Buttons */}
                                            <div className="flex justify-end gap-3 mt-auto pt-4">
                                                <FavoriteButton jobId={job._id} type="jobs" />
                                                <LikeButtonSimple
                                                    blogId={job._id}
                                                    type="job"
                                                    likeCount={jobLikes[job._id] || 0}
                                                    setLikeCount={(count) =>
                                                        setJobLikes((prev) => ({ ...prev, [job._id]: count }))
                                                    }
                                                    onClick={() => handleLike(job._id)}
                                                />
                                                <ViewButton blogId={job._id} type="job" />
                                                <CommentButton
                                                    blogId={job._id}
                                                    type="job"
                                                    commentCount={jobComments[job._id] || 0}
                                                />
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="mt-4 flex gap-3">
                                                <button
                                                    onClick={() => handleReadMore(job)}
                                                    type="button"
                                                    className="flex-1 bg-white border border-[#339ca0] text-[#339ca0] py-2 rounded-lg font-medium hover:bg-[#339ca0] hover:text-white transition-all duration-200"
                                                >
                                                    Details
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleApplyClick(job)}
                                                    className="flex-1 bg-gradient-to-r from-[#339ca0] to-black text-white py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200"
                                                >
                                                    Apply Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>

                )}
                {totalPages > 1 && (
                    <nav className="mt-10 flex justify-center">
                        <ul className="flex items-center gap-1">

                            {/* Prev Button */}
                            <li>
                                <button
                                    className={`px-3 py-2 rounded border ${currentPage === 1
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-gray-200"
                                        }`}
                                    onClick={() =>
                                        currentPage !== 1 && setCurrentPage(currentPage - 1)
                                    }
                                >
                                    <FaChevronLeft />
                                </button>
                            </li>

                            {(() => {
                                const maxVisiblePages = 5;
                                const halfVisible = Math.floor(maxVisiblePages / 2);

                                let startPage = Math.max(1, currentPage - halfVisible);
                                let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                                if (endPage - startPage + 1 < maxVisiblePages) {
                                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                                }

                                const buttons = [];

                                // First page
                                if (startPage > 1) {
                                    buttons.push(
                                        <li key={1}>
                                            <button
                                                className="px-3 py-2 border rounded hover:bg-gray-200"
                                                onClick={() => setCurrentPage(1)}
                                            >
                                                1
                                            </button>
                                        </li>
                                    );

                                    if (startPage > 2) {
                                        buttons.push(
                                            <li key="start-ellipsis">
                                                <span className="px-3 py-2">...</span>
                                            </li>
                                        );
                                    }
                                }

                                // Middle pages
                                for (let i = startPage; i <= endPage; i++) {
                                    buttons.push(
                                        <li key={i}>
                                            <button
                                                className={`px-3 py-2 border rounded ${currentPage === i
                                                    ? "bg-[#339ca0] text-white"
                                                    : "hover:bg-gray-200"
                                                    }`}
                                                onClick={() => setCurrentPage(i)}
                                            >
                                                {i}
                                            </button>
                                        </li>
                                    );
                                }

                                // Last page
                                if (endPage < totalPages) {
                                    if (endPage < totalPages - 1) {
                                        buttons.push(
                                            <li key="end-ellipsis">
                                                <span className="px-3 py-2">...</span>
                                            </li>
                                        );
                                    }

                                    buttons.push(
                                        <li key={totalPages}>
                                            <button
                                                className="px-3 py-2 border rounded hover:bg-gray-200"
                                                onClick={() => setCurrentPage(totalPages)}
                                            >
                                                {totalPages}
                                            </button>
                                        </li>
                                    );
                                }

                                return buttons;
                            })()}

                            {/* Next Button */}
                            <li>
                                <button
                                    className={`px-3 py-2 rounded border ${currentPage === totalPages
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-gray-200"
                                        }`}
                                    onClick={() =>
                                        currentPage !== totalPages &&
                                        setCurrentPage(currentPage + 1)
                                    }
                                >
                                    <FaChevronRight />
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}


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
        </section>
    );
}