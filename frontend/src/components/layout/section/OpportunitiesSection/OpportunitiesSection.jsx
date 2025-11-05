import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaClock, FaMoneyBill, FaUserAlt, FaBuilding, FaBriefcase, FaWrench, FaHeart, FaEye, FaComment } from "react-icons/fa";
import axios from "../../../../utils/axios.js";
import depositphotos from "../../../../media/jpg/depositphotos.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
const tabs = ["Job Vacancies", "CA Articleship", "Industrial Training", "Internships"];
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { JobApplicationForm } from "../../../ui/cards/cards.jsx";
import { ViewButton, CommentButton, LikeButtonSimple, FavoriteButton } from "../../../ui/button/button.jsx";
import { useParams } from "react-router";
import Select from "react-select";

const baseURL = import.meta.env.VITE_BACKEND_URL;
export default function OpportunitiesSection() {
    const { id } = useParams();
    const type = "job";
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState()

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

    // ✅ Filter jobs based on APPLIED filters (not temporary ones)
    const filteredJobs = jobs.filter((job) => {
        // Match country/state/city using job.country, job.state, job.city
        const matchesCountry = appliedCountryFilter ? job.country == appliedCountryFilter : true;
        const matchesState = appliedStateFilter ? job.state == appliedStateFilter : true;
        const matchesCity = appliedCityFilter ? job.city == parseInt(appliedCityFilter) : true;

        // Match mode (onsite, remote, hybrid)
        const matchesMode = appliedModeFilter ? job.mode?.toLowerCase() === appliedModeFilter.toLowerCase() : true;

        // Match experience (fresher, 1-3, 3-5, 5+)
        const matchesExperience = appliedExperienceFilter ? job.experience?.toLowerCase() === appliedExperienceFilter.toLowerCase() : true;

        // Combine all
        return (
            matchesCountry &&
            matchesState &&
            matchesCity &&
            matchesMode &&
            matchesExperience
        );
    });

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
            if (!token) {
                alert("Please login to like jobs");
                return;
            }
            const res = await axios.post(
                "/blogs/like",
                { id: jobId, type: "job" },
                { headers: { Authorization: `Bearer ${token}` } }
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
                const jobsData = response.data;
                console.log(jobsData);


                // For each job, fetch its location names
                const locationPromises = jobsData.map(async (job) => {
                    const loc = { city: "", state: "", country: "" };

                    if (job.country) {
                        try {
                            const countryRes = await axios.get(`/country/${job.country}`);
                            loc.country = countryRes.data.data?.name || countryRes.data?.name || "Unknown Country";
                        } catch (error) {
                            loc.country = "Unknown Country";
                        }
                    }

                    if (job.state) {
                        try {
                            const stateRes = await axios.get(`/state/${job.state}`);
                            loc.state = stateRes.data.data?.name || stateRes.data?.name || "Unknown State";
                        } catch (error) {
                            loc.state = "Unknown State";
                        }
                    }

                    if (job.city) {
                        try {
                            const cityRes = await axios.get(`/city/${job.city}`);
                            loc.city = cityRes.data.data?.name || cityRes.data?.name || "Unknown City";
                        } catch (error) {
                            loc.city = "Unknown City";
                        }
                    }

                    return { jobId: job._id, location: loc };
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

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "resume") {
            setFormData(prev => ({ ...prev, resume: files[0] }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                ...(name === "country" ? { state: "", city: "" } : {}),
                ...(name === "state" ? { city: "" } : {})
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.resume) {
            return Swal.fire({
                icon: "warning",
                title: "Resume Required",
                text: "Please upload your resume before submitting.",
            });
        }

        const submissionData = new FormData();
        for (let key in formData) {
            submissionData.append(key, formData[key]);
        }
        submissionData.append("jobId", selectedJob._id);

        try {
            const response = await axios.post("/job-register", submissionData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Application submitted successfully!",
                confirmButtonColor: "#339ca0",
            });

            closeModal();
        } catch (err) {
            console.error(err.response?.data || err);
            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text: err.response?.data?.message || "Failed to submit application.",
            });
        }
    };

    const getLocationString = (jobId) => {
        const loc = locationNamesMap[jobId];
        if (!loc) return "Location not specified";
        const parts = [loc.city, loc.state, loc.country].filter(Boolean);
        return parts.length ? parts.join(", ") : "Location not specified";
    };

    const getCompanyLogo = (job) => {
        if (job.companyId?.company?.employerLogo) {
            return `${baseURL || 'http://localhost:5000'}${job.companyId.company.employerLogo}`;
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

                        {/* 🌍 Country Filter */}
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

                        {/* 🏙️ State Filter */}
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

                        {/* 🏘️ City Filter */}
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
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Mode</label>
                            <Select
                                options={[
                                    { value: "", label: "All Modes" },
                                    { value: "remote", label: "Remote" },
                                    { value: "online", label: "online" },
                                    { value: "offline", label: "offline" },
                                ]}
                                value={
                                    tempModeFilter
                                        ? { value: tempModeFilter, label: tempModeFilter.charAt(0).toUpperCase() + tempModeFilter.slice(1) }
                                        : { value: "", label: "All Modes" }
                                }
                                onChange={(selected) => setTempModeFilter(selected?.value || "")}
                                placeholder="Select Mode"
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 })
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
                                    { value: "5+ years", label: "5+ Years" },
                                ]}
                                value={
                                    tempExperienceFilter
                                        ? {
                                            value: tempExperienceFilter,
                                            label: tempExperienceFilter === "0-1 years" ? "0-1 Years" :
                                                tempExperienceFilter === "1-3 years" ? "1-3 Years" :
                                                    tempExperienceFilter === "3-5 years" ? "3-5 Years" : "5+ Years"
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
                    <div className="text-center text-gray-500 mt-10">Loading jobs...</div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        {jobs.length === 0 ? "No jobs available" : "No matching jobs found. Try different filters."}
                    </div>
                ) : (
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 4 }
                        }}
                        className="mt-10"
                    >
                        {filteredJobs.map((job) => {
                            // Yeh variables map function ke andar define karein
                            const companyLogo = getCompanyLogo(job);
                            const companyName = getCompanyName(job);

                            return (
                                <SwiperSlide key={job._id}>
                                    <div className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col justify-between relative border border-gray-100 h-[320px]">
                                        {/* Company Logo - depositphotos ki jagah company logo */}
                                        <div className="absolute -top-1 left-2">
                                            {companyLogo ? (
                                                <img
                                                    src={companyLogo}
                                                    alt={companyName}
                                                    className="w-12 h-12 rounded-lg border-2 border-white shadow-md object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        // Fallback agar logo load na ho
                                                        const fallback = document.createElement('div');
                                                        fallback.className = 'w-12 h-12 bg-blue-100 rounded-lg border-2 border-white shadow-md flex items-center justify-center';
                                                        fallback.innerHTML = `<span class="text-blue-600 font-bold text-xs">${companyName.charAt(0)}</span>`;
                                                        e.target.parentNode.appendChild(fallback);
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-blue-100 rounded-lg border-2 border-white shadow-md flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold text-xs">
                                                        {companyName.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Company Name */}
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                            <FaBuilding className="text-gray-400" />
                                            <span className="font-medium truncate">{companyName}</span>
                                        </div>

                                        {/* Job Title */}
                                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 mt-2">
                                            {job.jobTitle || "Untitled Job"}
                                        </h3>

                                        {/* Job Type */}
                                        {job.jobType?.name && (
                                            <div className="flex items-center gap-2 text-sm mt-2 text-gray-600">
                                                <FaBriefcase className="text-black" />
                                                <span>{job.jobType.name}</span>
                                            </div>
                                        )}

                                        {/* Job Shift */}
                                        {job.jobShift?.name && (
                                            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                                                <FaClock className="text-black" />
                                                <span>{job.jobShift.name}</span>
                                            </div>
                                        )}

                                        {/* Location */}
                                        <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                                            <FaMapMarkerAlt className="text-black" />
                                            <span>{getLocationString(job._id)}</span>
                                        </div>

                                        {/* Skills */}
                                        {job.skills?.length > 0 && (
                                            <div className="flex items-start gap-2 text-sm mt-2 mb-3 text-gray-600">
                                                <FaWrench className="text-black mt-1" />
                                                <span className="line-clamp-2">
                                                    {job.skills
                                                        .map((skill) => (typeof skill === "object" ? skill.name : skill))
                                                        .join(", ")}
                                                </span>
                                            </div>
                                        )}

                                        <div className=" flex gap-3 justify-end">


                                            <FavoriteButton jobId={job._id} type="jobs" />


                                            <LikeButtonSimple
                                                blogId={job._id}
                                                type="job"
                                                likeCount={jobLikes[job._id] || 0}
                                                setLikeCount={(count) => setJobLikes(prev => ({
                                                    ...prev,
                                                    [job._id]: count
                                                }))}
                                                onClick={() => handleLike(job._id)}
                                            />
                                            <ViewButton blogId={job._id} type="job" />
                                            <CommentButton blogId={job._id} type="job" commentCount={jobComments[job._id] || 0} />
                                        </div>

                                        {/* Buttons */}
                                        <div className="mt-3 flex gap-3 pt-2">
                                            <button onClick={() => handleReadMore(job)}
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
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
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