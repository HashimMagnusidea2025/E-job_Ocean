import {
    FaHistory,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaCheckCircle,
    FaMars,
    FaBriefcase,
    FaMoneyBillWave,
    FaMoneyCheckAlt,
    FaExclamationTriangle,
    FaSuitcase,
} from "react-icons/fa";
import { MdWorkOutline, MdOutlineNotInterested } from "react-icons/md";
import { BsPersonVcard } from "react-icons/bs";
import noImg from '../../media/png/no-image.png';
import Layout from "../seekerDashboard/partials/layout";
import { useState, useEffect } from "react";
import axios from '../../utils/axios.js';
const baseURL = import.meta.env.VITE_BACKEND_URL; // Vite
// या CRA में: const baseURL = process.env.REACT_APP_BACKEND_URL;
import { FollowSocialsEmployer } from "../ui/cards/cards.jsx";
export default function CompanyPublicProfile() {

    const [companyData, setCompanyData] = useState(null);
    const [locationNames, setLocationNames] = useState({
        country: "",
        state: "",
        city: ""
    });
    const [mapEmbedCode, setMapEmbedCode] = useState('');

    useEffect(() => {
        fetchCompanyData();
    }, [])
    useEffect(() => {
        if (companyData && companyData.company && companyData.company.address) {
            fetchLocationNames();

            if (companyData.company.address.companyLocation) {
                generateMapEmbedCode(companyData.company.address.companyLocation);
            }
        }
    }, [companyData]);

    const fetchCompanyData = async (id) => {
        try {
            const response = await axios.get(`/Company-Information/my-company`);

            if (response.data.success) {
                setCompanyData(response.data.data);
                console.log("Company Data:", response.data.data);
            } else {
                throw new Error(response.data.message || "Failed to fetch company data");
            }
        } catch (err) {
            console.error("Error fetching company data:", err);
        }

    };

    // Function to generate map embed code from location
    const generateMapEmbedCode = (location) => {
        if (!location) {
            setMapEmbedCode('');
            return;
        }

        // ✅ Check if the location is already an iframe code (from old data)
        if (location.includes('<iframe')) {
            // Extract the src URL from iframe code
            const srcMatch = location.match(/src="([^"]*)"/);
            if (srcMatch && srcMatch[1]) {
                setMapEmbedCode(srcMatch[1]);
            } else {
                // If we can't extract src, use the location as plain text
                const encodedLocation = encodeURIComponent(location);
                setMapEmbedCode(`https://maps.google.com/maps?q=${encodedLocation}&output=embed`);
            }
        } else {
            // ✅ Normal address - generate map URL
            const encodedLocation = encodeURIComponent(location);
            setMapEmbedCode(`https://maps.google.com/maps?q=${encodedLocation}&output=embed`);
        }
    };

    const fetchLocationNames = async () => {
        try {
            const address = companyData.company.address;
            const newLocationNames = { country: "", state: "", city: "" };

            // Fetch country name
            if (address.country) {
                try {
                    const countryResponse = await axios.get(`/country/${address.country}`);
                    if (countryResponse.data.success) {
                        newLocationNames.country = countryResponse.data.data.name;
                    }
                } catch (err) {
                    console.error("Error fetching country:", err);
                    newLocationNames.country = address.country; // Fallback to ID if name not found
                }
            }

            // Fetch state name
            if (address.state) {
                try {
                    const stateResponse = await axios.get(`/state/${address.state}`);
                    if (stateResponse.data.success) {
                        newLocationNames.state = stateResponse.data.data.name;
                    }
                } catch (err) {
                    console.error("Error fetching state:", err);
                    newLocationNames.state = address.state; // Fallback to ID if name not found
                }
            }

            // Fetch city name

            if (address.city) {
                try {
                    const cityResponse = await axios.get(`/city/${address.city}`);
                    if (cityResponse.data.success) {
                        newLocationNames.city = cityResponse.data.data.name;
                    }
                } catch (err) {
                    console.error("Error fetching city:", err);
                    newLocationNames.city = address.city; // Fallback to ID if name not found
                }
            }

            setLocationNames(newLocationNames);
        } catch (err) {
            console.error("Error fetching location names:", err);
        }
    };

    // Format the member since date
    const formatMemberSince = (dateString) => {
        if (!dateString) return "N/A";

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return "N/A";
        }
    };
    // Function to get full image URL
    const getFullImageUrl = (path) => {
        if (!path) return noImg;
        if (path.startsWith('http')) return path;
        // Replace with your actual backend base URL
        return `${baseURL}${path}`;
    };

    // Generate location string with proper names

    const getLocationString = () => {
        if (!companyData?.company?.address) return "Location not specified";

        const address = companyData.company.address;
        const locationParts = [
            address.companyAddress || '',
            locationNames.city || address.city || '',
            locationNames.state || address.state || '',
            locationNames.country || address.country || ''
        ];

        return locationParts.filter(part => part).join(', ');
    };

    return (
        <Layout>
            <div className="w-full mx-auto  py-6 space-y-6 font-[Poppins]">

                <div className="flex flex-col lg:flex-row gap-6">

                    <div className="flex-1 space-y-10">

                        <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                {companyData?.company?.employerLogo ? (
                                    <img
                                        src={getFullImageUrl(companyData.company.employerLogo)}
                                        alt="Company Logo"
                                        className="w-20 h-20 object-contain rounded-md"
                                    />
                                ) : (
                                    <span className="text-xs text-gray-400 text-center">NO LOGO</span>
                                )}
                                <div>
                                    <h2 className="text-xl font-semibold">{companyData?.company?.name || "Company Name"}</h2>
                                    <p className="text-gray-600">{companyData?.company?.industry || "Industry not specified"}</p>
                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">

                                        <FaHistory /> Member Since, <span className="font-medium">{formatMemberSince(companyData?.createdAt)}</span>

                                    </p>

                                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-red-500" />
                                        {getLocationString()}
                                    </p>

                                </div>
                            </div>

                            <div className="bg-gray-100 mt-4 rounded-md p-4 flex flex-col sm:flex-row gap-4">
                                <button className="w-full sm:w-auto border border-blue-600 text-blue-600 px-4 py-2 rounded-md text-sm hover:bg-blue-50">
                                    Add to Favourite
                                </button>
                                <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-red-500 text-red-600 px-4 py-2 rounded-md text-sm hover:bg-red-50">
                                    <FaExclamationTriangle /> Report Abuse
                                </button>
                            </div>
                        </div>


                        <div className="bg-white rounded-lg p-12 shadow-sm border">
                            <h3 className="text-lg sm:text-2xl font-semibold mb-3">About Company</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {companyData?.company?.description || "Company Description"}

                            </p>
                        </div>
                    </div>

                    <div className="w-full lg:w-[320px] flex flex-col gap-6">

                        {/* <div className="w-full bg-white shadow-lg rounded-xl p-6 space-y-4 border">
                            <h2 className="text-xl font-semibold text-blue-600 text-center">Company Detail</h2>

                            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                                <div className="flex flex-col items-center gap-2">
                                    <FaCheckCircle className="text-blue-500" size={22} />
                                    <span className="font-medium">Offices:</span>
                                    <span></span>
                                </div>

                                {companyData?.company?.foundedYear && (
                                    <div className="flex flex-col items-center text-center gap-1">
                                        <FaCalendarAlt className="text-blue-500" size={22} />
                                        <span className="font-medium">Founded:</span>
                                        <span>{companyData.company.foundedYear}</span>
                                    </div>
                                )}


                                {companyData?.company?.employeesCount && (
                                    <div className="flex flex-col items-center gap-2">
                                        <BsPersonVcard className="text-blue-500" size={22} />
                                        <span className="font-medium">Employees:</span>
                                        <span>{companyData.company.employeesCount}</span>
                                    </div>
                                )}
                                {companyData?.company?.officesCount && (
                                    <div className="flex flex-col items-center gap-2">
                                        <FaMapMarkerAlt className="text-blue-500" size={22} />
                                        <span className="font-medium">Offices:</span>
                                        <span>{companyData.company.officesCount}</span>
                                    </div>
                                )}
                                {companyData?.company?.ownershipType && (
                                    <div className="flex flex-col items-center gap-2">
                                        <FaBriefcase className="text-blue-500" />
                                        <span className="font-medium">Ownership:</span>
                                        <span>{companyData.company.ownershipType}</span>
                                    </div>
                                )}

                            </div>
                        </div> */}

                        <div className="w-full bg-white shadow-xl rounded-2xl p-6 border border-gray-200">

                            {/* Header */}
                            <h2 className="text-xl font-bold t border-b pb-3">
                                Company Details
                            </h2>

                            {/* Content Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 text-gray-700 text-sm">

                                {/* Offices */}
                                {companyData?.company?.officesCount && (
                                    <div className="flex items-start gap-3">
                                        <FaMapMarkerAlt className="text-[#1A3B66] mt-1" size={20} />
                                        <div>
                                            <p className="font-semibold text-gray-900">Offices</p>
                                            <p>{companyData.company.officesCount}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Founded */}
                                {companyData?.company?.foundedYear && (
                                    <div className="flex items-start gap-3">
                                        <FaCalendarAlt className="text-[#1A3B66] mt-1" size={20} />
                                        <div>
                                            <p className="font-semibold text-gray-900">Founded</p>
                                            <p>{companyData.company.foundedYear}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Employees */}
                                {companyData?.company?.employeesCount && (
                                    <div className="flex items-start gap-3">
                                        <BsPersonVcard className="text-[#1A3B66] mt-1" size={20} />
                                        <div>
                                            <p className="font-semibold text-gray-900">Employees</p>
                                            <p>{companyData.company.employeesCount}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Ownership */}
                                {companyData?.company?.ownershipType && (
                                    <div className="flex items-start gap-3">
                                        <FaBriefcase className="text-[#1A3B66] mt-1" size={20} />
                                        <div>
                                            <p className="font-semibold text-gray-900">Ownership</p>
                                            <p>{companyData.company.ownershipType}</p>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>


                        <FollowSocialsEmployer
                            socialLinks={{
                                facebook: companyData?.company?.socialLinks?.facebook || "",
                                twitter: companyData?.company?.socialLinks?.twitter || "",
                                linkedin: companyData?.company?.socialLinks?.linkedin || "",
                                pinterest: companyData?.company?.socialLinks?.pinterest || "",
                                other: companyData?.company?.socialLinks?.other || "",
                                // Add instagram and telegram if they exist in your data
                                instagram: companyData?.company?.socialLinks?.instagram || "",
                                telegram: companyData?.company?.socialLinks?.telegram || ""
                            }}
                        />
                    </div>


                </div>


                <div className="bg-white rounded-lg p-4 shadow-sm border w-full">
                    {mapEmbedCode ? (
                        <iframe
                            title="Company Map"
                            src={mapEmbedCode}
                            width="100%"
                            height="300"
                            allowFullScreen
                            loading="lazy"
                            className="w-full h-72 rounded"
                        ></iframe>
                    ) : (
                        <div className="h-72 bg-gray-100 flex items-center justify-center rounded">
                            <p className="text-gray-500">
                                {companyData?.company?.address?.companyLocation
                                    ? "Loading map..."
                                    : "No location specified"
                                }
                            </p>
                        </div>
                    )}
                </div>


                {/* <div className="pt-10">
                    <h2 className="text-xl font-semibold sm:text-[25px]">Current Openings</h2>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="max-w-xs w-full bg-white border shadow-md rounded-xl py-8 px-5 space-y-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <FaSuitcase className="text-gray-400" />
                                    <span> Full Time/Permanent</span>
                                </div>

                                <h3 className="font-semibold text-lg text-gray-900 truncate">
                                    Full Stack Developer
                                </h3>

                                <p className="text-gray-700">
                                    <strong>Salary:</strong> <span className="font-bold text-black">0 - 0</span>
                                </p>

                                <div className="flex items-center text-blue-600 gap-1">
                                    <FaMapMarkerAlt className="text-blue-500" />
                                    <span className="font-semibold"> Atlanta</span>
                                </div>

                                <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-xs">Jun 18, 2025</p>
                                        <p className="text-gray-700 font-medium">Multimedia Design</p>
                                    </div>
                                    <img
                                        src={noImg}
                                        alt="Company Logo"
                                        className="w-10 h-10 object-contain rounded-full"
                                    />
                                </div>


                            </div>
                        ))}
                    </div>
                </div> */}
            </div>
        </Layout>
    );
}
