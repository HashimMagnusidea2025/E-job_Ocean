import caarchitaggarwal from '../../media/png/ca-archit-aggarwal.png';

import w from '../../media/jpg/1.jpg';
import { useState, useEffect } from 'react';
import React from "react";
import { FaPhone, FaBook, FaEnvelope, FaMapMarkerAlt, FaMobileAlt, FaPen, FaTimes, FaDownload, FaPencilAlt, FaBuilding, FaCalendarAlt, FaPlus, FaEdit, FaGraduationCap, FaSchool } from "react-icons/fa";
import Navbar from '../layout/navbar/navbar';

import { FaCheckCircle, FaUserTie, FaMars, FaBriefcase, FaMoneyBillWave, FaMoneyCheckAlt } from 'react-icons/fa';
import { MdWorkOutline, MdOutlineNotInterested } from 'react-icons/md';
import { BsPersonVcard } from 'react-icons/bs';
import axios from '../../utils/axios.js';
const baseUrl = import.meta.env.VITE_BACKEND_URL
const ViewPublicProfile = () => {
    const [experiences, setExperiences] = useState([]);
    const [educations, setEducations] = useState([]);
    const [skills, setSkills] = useState([]);
    const [languages, setLanguages] = useState([]);

    const [seekerInfo, setSeekerInfo] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [educationLocations, setEducationLocations] = useState({});
    const [experienceLocations, setExperienceLocations] = useState({});

    const [seekerLocation, setSeekerLocation] = useState({ country: "", state: "", city: "" });



    const fetchExperienceLocationNames = async (exp) => {
        try {
            const locationNames = { city: "", state: "", country: "" };

            // Fetch country name
            if (exp.country) {
                try {
                    const countryResponse = await axios.get(`/country/${exp.country}`);
                    if (countryResponse.data.success) {
                        locationNames.country = countryResponse.data.data.name;
                    }
                } catch (err) {
                    console.error("Error fetching country:", err);
                    locationNames.country = exp.country; // Fallback to ID
                }
            }

            if (exp.state) {
                try {
                    const stateResponse = await axios.get(`/state/${exp.state}`);
                    if (stateResponse.data.success) {
                        locationNames.state = stateResponse.data.data.name;
                    }
                } catch (err) {
                    console.error("Error fetching state:", err);
                    locationNames.state = exp.state; // Fallback to ID
                }
            }

            // Fetch city name
            if (exp.city) {
                try {
                    const cityResponse = await axios.get(`/city/${exp.city}`);
                    if (cityResponse.data.success) {
                        locationNames.city = cityResponse.data.data.name;
                    }
                } catch (err) {
                    console.error("Error fetching city:", err);
                    locationNames.city = exp.city; // Fallback to ID
                }
            }

            return locationNames;
        } catch (err) {
            console.error("Error fetching experience location names:", err);
            return { city: exp.city, state: exp.state, country: exp.country };
        }
    };


    const fetchEducationLocationNames = async (edu) => {
        try {
            const locationNames = { city: "", state: "", country: "" };

            // Fetch country name
            if (edu.country) {
                try {
                    const countryResponse = await axios.get(`/country/${edu.country}`);
                    if (countryResponse.data.success) {
                        locationNames.country = countryResponse.data.data.name;
                    }
                } catch (err) {
                    console.error("Error fetching country:", err);
                    locationNames.country = edu.country; // Fallback to ID
                }
            }

            if (edu.state) {
                try {
                    const stateResponse = await axios.get(`/state/${edu.state}`);
                    if (stateResponse.data.success) {
                        locationNames.state = stateResponse.data.data.name;
                    }
                } catch (err) {
                    console.error("Error fetching country:", err);
                    locationNames.state = edu.state; // Fallback to ID
                }
            }


            // Fetch city name
            if (edu.city) {
                try {
                    const cityResponse = await axios.get(`/city/${edu.city}`);
                    if (cityResponse.data.success) {
                        locationNames.city = cityResponse.data.data.name;
                    }
                } catch (err) {
                    console.error("Error fetching city:", err);
                    locationNames.city = edu.city; // Fallback to ID
                }
            }

            return locationNames;
        } catch (err) {
            console.error("Error fetching education location names:", err);
            return { city: edu.city, country: edu.country };
        }
    };

    // Function to fetch seeker location names
    const fetchSeekerLocationNames = async (seekerData) => {
        try {
            const locationNames = { country: "", state: "", city: "" };

            // Fetch country name
            if (seekerData.country) {
                try {
                    const countryResponse = await axios.get(`/country/${seekerData.country}`);
                    if (countryResponse.data.success) {
                        locationNames.country = countryResponse.data.data.name;
                    }
                } catch (err) {
                    console.error("Error fetching country:", err);
                    locationNames.country = seekerData.country; // Fallback to ID
                }
            }

            if (seekerData.state) {
                try {
                    const stateResponse = await axios.get(`/state/${seekerData.state}`);
                    if (stateResponse.data.success) {
                        locationNames.state = stateResponse.data.data.name;
                    }
                } catch (err) {
                    console.error("Error fetching state:", err);
                    locationNames.state = seekerData.state; // Fallback to ID
                }
            }

            // Fetch city name
            if (seekerData.city) {
                try {
                    const cityResponse = await axios.get(`/city/${seekerData.city}`);
                    if (cityResponse.data.success) {
                        locationNames.city = cityResponse.data.data.name;
                    }
                } catch (err) {
                    console.error("Error fetching city:", err);
                    locationNames.city = seekerData.city; // Fallback to ID
                }
            }

            return locationNames;
        } catch (err) {
            console.error("Error fetching seeker location names:", err);
            return { city: seekerData.city, state: seekerData.state, country: seekerData.country };
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token'); // Or from context
                const config = {
                    headers: { Authorization: `Bearer ${token}` }

                };

                // Fetch seeker information
                const seekerResponse = await axios.get('/seeker/me', config);
                const seekerData = seekerResponse.data.data;
                setSeekerInfo(seekerData);
                console.log(seekerData);


                // Fetch seeker location names
                const seekerLoc = await fetchSeekerLocationNames(seekerData);
                setSeekerLocation(seekerLoc);

                // Fetch experiences
                const expResponse = await axios.get('/build-Resume/experiences', config);
                const experiencesData = expResponse.data.data;
                setExperiences(experiencesData);

                // Fetch educations
                const eduResponse = await axios.get('/build-Resume/educations', config);
                const educationsData = eduResponse.data.data;
                console.log(educationsData);

                setEducations(educationsData);


                // Fetch location names for all educations
                const locationsMap = {};
                for (let edu of educationsData) {
                    if (edu.isActive) {
                        const locationNames = await fetchEducationLocationNames(edu);
                        locationsMap[edu._id] = locationNames;
                    }
                }
                setEducationLocations(locationsMap);


                // Fetch location names for all experiences
                const expLocationsMap = {};
                for (let exp of experiencesData) {
                    if (exp.isActive) {
                        const locationNames = await fetchExperienceLocationNames(exp);
                        expLocationsMap[exp._id] = locationNames;
                    }
                }
                setExperienceLocations(expLocationsMap);


                // Fetch skills
                const skillsResponse = await axios.get('/build-Resume/skills', config);
                setSkills(skillsResponse.data.data);

                // Fetch languages
                const langResponse = await axios.get('/build-Resume/languages', config);
                setLanguages(langResponse.data.data);



                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const getEducationLocation = (edu) => {
        const location = educationLocations[edu._id];
        if (!location) return `${edu.city},${edu.state}, ${edu.country}`; // Fallback to IDs if not loaded

        const locationParts = [
            location.city,
            location.state,
            location.country
        ].filter(part => part && part !== '');

        return locationParts.join(', ') || 'Location not specified';
    };


    const getExperienceLocation = (exp) => {
        const location = experienceLocations[exp._id];
        if (!location) return `${exp.city}, ${exp.state}, ${exp.country}`; // Fallback to IDs if not loaded

        const locationParts = [
            location.city,
            location.state,
            location.country
        ].filter(part => part && part !== '');

        return locationParts.join(', ') || 'Location not specified';
    };


    return (
        <div className=''>
            <Navbar />
            <div className="w-full container mx-auto grid md:grid-cols-3 gap-6  pt-10 font-[Poppins]">

                <div className="md:col-span-2 bg-white shadow-md rounded-md overflow-hidden">

                    <div className=''>
                        <img
                            src={w}
                            alt="Banner"
                            className="w-full h-50  object-cover"
                        />
                    </div>

                    <div className="p-4 flex items-center space-x-4 ">
                        <img
                            src={caarchitaggarwal}
                            alt="User"
                            className="w-28 h-28  border-4 border-white shadow"
                        />
                        <div className=' space-y-5'>
                            <h2 className="text-xl sm:text-[25px] font-bold">
                                {seekerInfo?.user.firstName} {seekerInfo?.user.lastName}</h2>

                             <span className='text-md text-black '>
                                    {[seekerLocation.city, seekerLocation.state, seekerLocation.country]
                                        .filter(Boolean)
                                        .join(', ') || 'Location not specified'}
                                </span>
                            {/* <p className="text-sm text-black">Member Since, Sep 19, 2018</p> */}
                        </div>
                    </div>


                    <div className="py-6 px-4">
                        {/* <div className='bg-[#f1f5fd] py-10 sm:py-14 px-8'>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                                📄 Download CV
                            </button>
                        </div> */}


                        <div className="mt-6">
                            <h3 className="text-lg sm:text-[30px] font-semibold mb-2">About me</h3>
                            <p className="text-gray-700 text-md">
                                {seekerInfo?.summary}

                            </p>
                        </div>
                        <hr className='mt-4' />
                        {/* Skills */}
                        <div className="mt-6 ">
                            <h3 className="text-lg sm:text-[25px] font-semibold mb-2">Skills</h3>
                            <div className="flex flex-wrap gap-4">
                                {skills.filter(skill => skill.isActive).map(skill => (
                                    <div key={skill._id} className="rounded-full">
                                        <div className="h-full rounded-full">{skill.skillName}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 px-4">
                        <h3 className="text-lg sm:text-[25px] font-semibold mb-2">Languages</h3>
                        <div className="flex flex-wrap gap-4">
                            {languages.filter(lang => lang.isActive).map(lang => (
                                <span key={lang._id} className="bg-[#113B67] text-white px-4 py-3 rounded-full text-md">
                                    {lang.languageName} ({lang.proficiency})
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="pt-10">
                        <hr className='mb-2' />
                        <div className="bg-white rounded-lg shadow  border-gray-200 p-6 w-full relative">

                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl sm:text-[32px] font-semibold text-gray-800">Experience</h2>

                            </div>


                            {experiences.filter(exp => exp.isActive).map(exp => (
                                <div key={exp._id} className="mt-2 p-3">
                                    <h3 className="font-semibold text-lg sm:text-[20px]">{exp.jobTitle}</h3>
                                    <p className="text-md text-gray-600 flex items-center gap-2">
                                        <span><FaMapMarkerAlt /></span>
                                        <span>{getExperienceLocation(exp)}</span>
                                    </p>
                                    <p className="text-md text-gray-600 flex items-center gap-2">
                                        <span><FaBuilding /></span>
                                        <span>{exp.companyName}</span>
                                    </p>
                                    <p className="text-md text-gray-600 flex items-center gap-2">
                                        <span><FaCalendarAlt /></span>
                                        <span>From {new Date(exp.startDate).toLocaleDateString()} - {exp.currentlyWorking ? 'Present' : new Date(exp.endDate).toLocaleDateString()}</span>
                                    </p>
                                    <p className="text-md text-gray-700 mt-1 pl-5">{exp.description}</p>
                                </div>
                            ))}



                        </div>
                    </div>

                    {/* Education */}
                    <div className="pt-10">
                        <div className="bg-white rounded-lg shadow  border-gray-200 p-6 w-full relative">

                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl sm:text-[32px] font-semibold text-gray-800">Education</h2>

                            </div>


                            {educations.filter(edu => edu.isActive).map(edu => (
                                <div key={edu._id} className="mt-2">
                                    <h3 className="font-semibold text-lg sm:text-[20px]">{edu.degreeTitle} - {edu.degreeType?.name}</h3>
                                    <p className="text-md text-gray-600 pl-7">
                                        {edu.yearOfCompletion} - {getEducationLocation(edu)}
                                    </p>
                                    {/* <p className="text-md text-gray-600 flex items-center gap-2">
                                                                           <span><FaSchool /></span>
                                                                           <span>{edu.institute}</span>
                                                                       </p> */}
                                    <p className="text-md text-gray-600 flex items-center gap-2">
                                        <span><FaBook /></span>
                                        <span>{edu.degreeLevel?.name}</span>
                                    </p>
                                </div>
                            ))}


                        </div>
                    </div>
                </div>

                {/* contact information */}

                <div className="space-y-8">
                    <div className="bg-white shadow-md rounded-md p-6">
                        <h3 className="text-lg sm:text-[20px] font-bold text-blue-600 mb-4">Contact Information</h3>
                        <ul className="space-y-4 text-md text-gray-700">
                            {/* <li>
                                <FaPhone className="inline mr-2" /> +1234567890
                            </li> */}
                            <li>
                                <FaMobileAlt className="inline mr-2" /> {seekerInfo?.mobile}
                            </li>
                            <li>
                                <FaEnvelope className="inline mr-2" /> {seekerInfo?.user.email}
                            </li>
                            <li>
                                <FaMapMarkerAlt className="inline mr-2" /> {seekerInfo?.streetAddress}
                            </li>
                        </ul>
                    </div>

                    <div className="w-full mx-auto bg-white shadow-lg rounded-xl p-6 space-y-4 border">
                        <h2 className="text-xl font-semibold text-blue-600">Candidate Details</h2>

                        <div className="grid grid-cols-2 gap-7 text-sm text-gray-700">
                            {/* <div className="flex justify-center flex-col gap-2 space-x-2 items-center">
                                <span> <FaCheckCircle className="text-blue-500 text-[27px]" /></span>
                                <span>Verified:</span>
                                <span>Yes</span>


                            </div> */}
                            {/* <div className="flex justify-center flex-col gap-2 space-x-2 items-center">
                                <span><MdOutlineNotInterested className="text-red-500 text-[27px]" /></span>
                                <span>Ready for Hire:</span>
                                <span>No</span>


                            </div> */}

                            {/* <div className="flex justify-center flex-col gap-2 space-x-2 items-center">
                                <span> <FaCalendarAlt className="text-blue-500 text-[27px]" /></span>
                                <span>Age:</span>
                                <span>36 Years</span>


                            </div> */}
                            <div className="flex justify-center flex-col gap-2 space-x-2 items-center">
                                <span><FaMars className="text-blue-500 text-[27px]" /></span>
                                <span>Gender:</span>
                                <span>{seekerInfo?.gender}</span>


                            </div>

                            <div className="flex justify-center flex-col gap-2 space-x-2 items-center">
                                <span><BsPersonVcard className="text-blue-500 text-[27px]" /></span>
                                <span>Marital Status:</span>
                                <span>{seekerInfo?.maritalStatus}</span>


                            </div>
                            <div className="flex justify-center flex-col gap-2 space-x-2 items-center">
                                <span><FaBriefcase className="text-blue-500 text-[27px]" /></span>
                                <span>Experience:</span>
                                <span>{seekerInfo?.jobExperience}</span>


                            </div>

                            <div className="flex justify-center flex-col gap-2 space-x-2 items-center" >
                                <span> <MdWorkOutline className="text-blue-500 text-[27px]" /></span>
                                <span>Career Level:</span>
                                <span>{seekerInfo?.careerLevel.name}</span>


                            </div>
                            <div className="flex justify-center flex-col gap-2 space-x-2 items-center">
                                <span> <FaMapMarkerAlt className="text-blue-500 text-[27px]" /></span>
                                <span>Location:</span>
                                <span>
                                    {[seekerLocation.city, seekerLocation.state, seekerLocation.country]
                                        .filter(Boolean)
                                        .join(', ') || 'Location not specified'}
                                </span>


                            </div>

                            <div className="flex justify-center flex-col gap-2 space-x-2 items-center">
                                <span> <FaMoneyBillWave className="text-blue-500 text-[27px]" /></span>
                                <span>Current Salary:</span>
                                <span> {seekerInfo?.currentSalary}</span>


                            </div>
                            <div className="flex justify-center flex-col gap-2 space-x-2 items-center">
                                <span><FaMoneyCheckAlt className="text-blue-500 text-[27px]" /></span>
                                <span>Expected Salary:</span>
                                <span>{seekerInfo?.expectedSalary}</span>


                            </div>
                        </div>
                    </div>

                    {/* youtube video */}
                    <div className=" w-full">
                        <div className="rounded-lg overflow-hidden border border-white shadow-lg">
                            <iframe
                                width="100%"
                                height="315"
                                src="https://www.youtube.com/embed/KgTgQy-2JzA"
                                title="Big 4 Masterclass Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>



                </div>


            </div>
        </div>
    );
};

export default ViewPublicProfile;
