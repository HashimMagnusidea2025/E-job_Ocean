import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaEdit, FaTrash, FaUsers, FaPowerOff, FaBuilding } from "react-icons/fa";
import { useNavigate } from "react-router";
import axios from '../../utils/axios.js'
import Swal from "sweetalert2";

import Layout from "../seekerDashboard/partials/layout";
const baseURL = import.meta.env.VITE_BACKEND_URL;
export default function ManageJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [locationNamesMap, setLocationNamesMap] = useState({});
    const navigate = useNavigate();

    // Fetch employer's jobs
    useEffect(() => {
        fetchEmployerJobs();
    }, []);

    const fetchEmployerJobs = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/job-post/employer/my-jobs");
            const jobsData = response.data;
            setJobs(jobsData);

            // Fetch location names for all jobs
            await fetchLocationNames(jobsData);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            Swal.fire("Error", "Failed to load jobs", "error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch location names for jobs
    const fetchLocationNames = async (jobsData) => {
        try {
            const locationPromises = jobsData.map(async (job) => {
                const loc = { city: "", state: "", country: "" };

                // Fetch country name
                if (job.country) {
                    try {
                        const countryRes = await axios.get(`/country/${job.country}`);
                        loc.country = countryRes.data.data?.name || countryRes.data?.name || "Unknown Country";
                    } catch (error) {
                        console.error(`Error fetching country ${job.country}:`, error);
                        loc.country = "Unknown Country";
                    }
                }

                // Fetch state name
                if (job.state) {
                    try {
                        const stateRes = await axios.get(`/state/${job.state}`);
                        loc.state = stateRes.data.data?.name || stateRes.data?.name || "Unknown State";
                    } catch (error) {
                        console.error(`Error fetching state ${job.state}:`, error);
                        loc.state = "Unknown State";
                    }
                }

                // Fetch city name
                if (job.city) {
                    try {
                        const cityRes = await axios.get(`/city/${job.city}`);
                        loc.city = cityRes.data.data?.name || cityRes.data?.name || "Unknown City";
                    } catch (error) {
                        console.error(`Error fetching city ${job.city}:`, error);
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
            console.log("Location names loaded:", locationsMap);
        } catch (error) {
            console.error("Error fetching location names:", error);
        }
    };

    // Get location string for a job
    const getLocationString = (jobId) => {
        const loc = locationNamesMap[jobId];
        if (!loc) return "Loading location...";

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

    // Alternative: Direct location display (if you want to show individual fields)
    const getLocationName = (job) => {
        // Try populated city name from location map first
        const loc = locationNamesMap[job._id];
        if (loc?.city) return loc.city;

        // Fallback to direct city name if available
        if (job.city?.name) return job.city.name;
        if (job.cityName) return job.cityName;

        // If city is a number, show generic message
        if (job.city && typeof job.city === 'number') {
            return "Location specified";
        }

        return "Location not specified";
    };

    // Edit job
    const handleEditJob = (jobId) => {
        navigate(`/employer-dashboard/post-job/${jobId}`);
    };

    // Delete job
    const handleDeleteJob = async (jobId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/job-post/${jobId}`);
                Swal.fire("Deleted!", "Job has been deleted.", "success");
                fetchEmployerJobs(); // Refresh the list
            } catch (error) {
                console.error("Error deleting job:", error);
                Swal.fire("Error", "Failed to delete job", "error");
            }
        }
    };

    // Toggle job active status
    const handleToggleStatus = async (jobId, currentStatus) => {
        try {
            await axios.patch(`/job-post/${jobId}/toggle-status`);
            Swal.fire("Success", `Job ${currentStatus ? "deactivated" : "activated"}`, "success");
            fetchEmployerJobs(); // Refresh the list
        } catch (error) {
            console.error("Error updating job status:", error);
            const errorMessage = error.response?.data?.message || "Failed to update job status";
            Swal.fire("Error", errorMessage, "error");
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "Not set";
        return new Date(dateString).toLocaleDateString();
    };

    // Check if job is expired
    const isJobExpired = (expiryDate) => {
        if (!expiryDate) return false;
        return new Date(expiryDate) <= new Date();
    };

    if (loading) {
        return (
            <Layout>
                <div className="w-full mx-auto px-4 py-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg">Loading jobs...</div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="w-full mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Jobs</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            Total Jobs: {jobs.length}
                        </span>
                        <button
                            onClick={() => navigate("/employer-dashboard/post-job")}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold text-sm"
                        >
                            Post New Job
                        </button>
                    </div>
                </div>

                {jobs.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg mb-4">
                            No jobs found. Post your first job!
                        </p>
                        <button
                            onClick={() => navigate("/employer-dashboard/post-job")}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-semibold"
                        >
                            Post Your First Job
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => {
                            const companyLogo = getCompanyLogo(job);
                            const companyName = getCompanyName(job);

                            return (
                                <div
                                    key={job._id}
                                    className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 space-y-3 relative"
                                >
                                    {/* Company Logo */}
                                    {/* <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        {companyLogo ? (
                                            <img
                                                src={companyLogo}
                                                alt={companyName}
                                                className="w-26 h-20 rounded-lg border-2 border-white shadow-md object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg border-2 border-white shadow-md flex items-center justify-center">
                                                <FaBuilding className="text-blue-600 text-lg" />
                                            </div>
                                        )}
                                    </div> */}

                                    {/* Job Status Badges */}
                                    <div className="flex justify-between items-start">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${job.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}>
                                            {job.isActive ? "Active" : "Inactive"}
                                        </span>
                                        {isJobExpired(job.expiryDate) && (
                                            <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                                Expired
                                            </span>
                                        )}
                                    </div>

                                    {/* Company Name */}
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                        <FaBuilding className="text-gray-400" />
                                        <span className="font-medium">{companyName}</span>
                                    </div>

                                    {/* Job Type */}
                                    <p className="text-xs text-gray-600 uppercase tracking-wide">
                                        {job.jobType?.name || "Not specified"}
                                    </p>

                                    {/* Job Title */}
                                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                                        {job.jobTitle}
                                    </h3>

                                    {/* Salary */}
                                    {!job.hideSalary && (job.salaryFrom || job.salaryTo) && (
                                        <p className="text-sm font-medium text-gray-700">
                                            Salary: {job.salaryFrom && `$${job.salaryFrom}`}
                                            {job.salaryTo && ` - $${job.salaryTo}`}
                                            {job.salaryPeriod && ` (${job.salaryPeriod})`}
                                        </p>
                                    )}

                                    {/* Location - UPDATED */}
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-blue-500 flex-shrink-0" />
                                        <span className="truncate">
                                            {getLocationString(job._id)}
                                        </span>
                                    </p>

                                    {/* Job Details */}
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <p>Positions: {job.positions || "Not specified"}</p>
                                        <p>Expiry: {formatDate(job.expiryDate)}</p>
                                        <p>Posted: {formatDate(job.createdAt)}</p>
                                    </div>

                                    {/* Skills */}
                                    {job.skills && job.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {job.skills.slice(0, 3).map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                                >
                                                    {skill.name}
                                                </span>
                                            ))}
                                            {job.skills.length > 3 && (
                                                <span className="text-xs text-gray-500">
                                                    +{job.skills.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex justify-between items-center pt-3 border-t">
                                        <button
                                            className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
                                            onClick={() => navigate(`/employer-dashboard/job-candidates/${job._id}`)}
                                        >
                                            <FaUsers />
                                            <span>Candidates</span>
                                            {/* Optional: Application count show karein */}
                                            {job.applicationCount > 0 && (
                                                <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                                    {job.applicationCount}
                                                </span>
                                            )}
                                        </button>

                                        <div className="flex gap-2">
                                            <button
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                onClick={() => handleEditJob(job._id)}
                                                title="Edit Job"
                                            >
                                                <FaEdit size={20} />
                                            </button>
                                            <button
                                                className={`p-2 rounded flex items-center gap-1 ${job.isActive
                                                    ? "text-yellow-600 hover:bg-yellow-50"
                                                    : "text-green-600 hover:bg-green-50"
                                                    }`}
                                                onClick={() => handleToggleStatus(job._id, job.isActive)}
                                                title={job.isActive ? "Deactivate Job" : "Activate Job"}
                                            >
                                                <FaPowerOff size={20} className="text-sm" />
                                                {job.isActive ? "Deactivate" : "Activate"}
                                            </button>
                                            <button
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                onClick={() => handleDeleteJob(job._id)}
                                                title="Delete Job"
                                            >
                                                <FaTrash size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
}