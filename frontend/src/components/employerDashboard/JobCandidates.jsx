// components/JobCandidates.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios.js";
import {
    FaDownload,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaArrowLeft,
    FaUser,
    FaCalendar,
    FaFilePdf
} from "react-icons/fa";
import Layout from "../seekerDashboard/partials/layout.jsx";
const baseURL = import.meta.env.VITE_BACKEND_URL; // Vite
export default function JobCandidates() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [locationNamesMap, setLocationNamesMap] = useState({});

    useEffect(() => {
        fetchCandidates();
        fetchJobDetails();
    }, [jobId]);

    useEffect(() => {
        if (candidates.length > 0) {
            fetchLocationNamesForCandidates();
        }
    }, [candidates]);

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await axios.get(`/job-register/job/${jobId}`);
            console.log("Candidates response:", response.data);
            setCandidates(response.data.registrations || []);
        } catch (error) {
            console.error("Error fetching candidates:", error);
            setError("Failed to load candidates");
            setCandidates([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchJobDetails = async () => {
        try {
            const response = await axios.get(`/job-post/${jobId}`);
            setJob(response.data);
        } catch (error) {
            console.error("Error fetching job details:", error);
            setError("Failed to load job details");
        }
    };

    const fetchLocationNamesForCandidates = async () => {
        try {
            const locationPromises = candidates.map(async (candidate) => {
                const location = { city: "", state: "", country: "" };

                // Fetch country name
                if (candidate.country) {
                    try {
                        const countryResponse = await axios.get(`/country/${candidate.country}`);
                        if (countryResponse.data.success) {
                            location.country = countryResponse.data.data.name;
                        } else {
                            location.country = candidate.country; // Fallback to ID
                        }
                    } catch (err) {
                        console.error(`Error fetching country ${candidate.country}:`, err);
                        location.country = candidate.country; // Fallback to ID
                    }
                }

                // Fetch state name
                if (candidate.state) {
                    try {
                        const stateResponse = await axios.get(`/state/${candidate.state}`);
                        if (stateResponse.data.success) {
                            location.state = stateResponse.data.data.name;
                        } else {
                            location.state = candidate.state; // Fallback to ID
                        }
                    } catch (err) {
                        console.error(`Error fetching state ${candidate.state}:`, err);
                        location.state = candidate.state; // Fallback to ID
                    }
                }

                // Fetch city name
                if (candidate.city) {
                    try {
                        const cityResponse = await axios.get(`/city/${candidate.city}`);
                        if (cityResponse.data.success) {
                            location.city = cityResponse.data.data.name;
                        } else {
                            location.city = candidate.city; // Fallback to ID
                        }
                    } catch (err) {
                        console.error(`Error fetching city ${candidate.city}:`, err);
                        location.city = candidate.city; // Fallback to ID
                    }
                }

                return { candidateId: candidate._id, location };
            });

            const locationsArray = await Promise.all(locationPromises);
            const locationsMap = {};
            locationsArray.forEach(item => {
                locationsMap[item.candidateId] = item.location;
            });

            setLocationNamesMap(locationsMap);
            console.log("Location names loaded for candidates:", locationsMap);
        } catch (error) {
            console.error("Error fetching location names for candidates:", error);
        }
    };

    // ✅ Get location string for a candidate
    const getLocationString = (candidateId) => {
        const location = locationNamesMap[candidateId];
        if (!location) return "Loading location...";

        const locationParts = [
            location.city,
            location.state,
            location.country
        ].filter(part => part && part !== "");

        return locationParts.length > 0 ? locationParts.join(", ") : "Location not specified";
    };


    const downloadResume = (resumePath, candidateName) => {
        if (resumePath) {
            const fullUrl = `${baseURL}/${resumePath}`;
            window.open(fullUrl, '_blank');
        } else {
            alert("No resume available for this candidate");
        }
    };

    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading candidates...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-6">
                        <button
                            onClick={() => navigate("/employer-dashboard/posted-jobs")}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors"
                        >
                            <FaArrowLeft />
                            Back to Manage Jobs
                        </button>

                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                {job?.jobTitle || "Job"} - Applications
                            </h1>
                            <div className="flex flex-wrap gap-4 text-gray-600">
                                <p className="flex items-center gap-2">
                                    <FaUser className="text-blue-500" />
                                    Total Applicants: <span className="font-semibold">{candidates.length}</span>
                                </p>
                                {job?.jobType?.name && (
                                    <p className="flex items-center gap-2">
                                        <FaCalendar className="text-green-500" />
                                        Job Type: <span className="font-semibold">{job.jobType.name}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Candidates List */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        {candidates.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">📝</div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    No Applications Yet
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    No candidates have applied for this job yet.
                                </p>
                                <button
                                    onClick={() => navigate("/employer-dashboard/posted-jobs")}
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                                >
                                    Back to Jobs
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {candidates.map((candidate, index) => (
                                    <div key={candidate._id} className="px-6 py-2 hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                                                        <span className="text-white font-bold text-lg">
                                                            {getInitials(candidate.firstName, candidate.lastName)}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                                            <h3 className="text-xl font-semibold text-gray-800">
                                                                {candidate.firstName} {candidate.lastName}
                                                            </h3>
                                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                                Applicant #{index + 1}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                                            <FaCalendar className="text-gray-400" />
                                                            Applied on {formatDate(candidate.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                        <FaEnvelope className="text-blue-500 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Email</p>
                                                            <p className="text-sm font-medium text-gray-800 truncate">
                                                                {candidate.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                        <FaPhone className="text-green-500 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Mobile</p>
                                                            <p className="text-sm font-medium text-gray-800">
                                                                {candidate.mobile}
                                                            </p>
                                                        </div>
                                                    </div>
                                                   
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                {candidate.resume && (
                                                    <button
                                                        onClick={() => downloadResume(
                                                            candidate.resume,
                                                            `${candidate.firstName}_${candidate.lastName}_resume`
                                                        )}
                                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                                                    >
                                                        <FaFilePdf />
                                                        Download Resume
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    {candidates.length > 0 && (
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-800 text-center">
                                Showing <strong>{candidates.length}</strong> candidate{candidates.length !== 1 ? 's' : ''} for this job posting
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}