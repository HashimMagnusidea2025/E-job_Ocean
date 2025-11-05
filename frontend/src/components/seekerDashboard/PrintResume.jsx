import { useState, useEffect } from 'react';
import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import caarchitaggarwal from '../../media/png/ca-archit-aggarwal.png'
import Layout from './partials/layout';
import { FaBook, FaPhoneAlt, FaMobileAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaPen, FaTimes, FaDownload, FaPencilAlt, FaBuilding, FaCalendarAlt, FaPlus, FaEdit, FaGraduationCap, FaSchool } from "react-icons/fa";

import axios from '../../utils/axios.js'
import React from 'react';
const baseUrl = import.meta.env.VITE_BACKEND_URL
export default function PrintResume() {
    const resumeRef = useRef();


    const handleDownloadPDF = async () => {
        const element = resumeRef.current;
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('My_Resume.pdf');
    };
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
    // Function to fetch location names for education
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



    // Function to fetch location names for experience
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

    // Fetch all data on component mount
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


    // Helper function to get education location string
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

    // Helper function to get experience location string
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
        <>
            <Layout>
                <div className=" bg-white font-[Poppins]">
                    <div className=' flex justify-end pt-5 px-10'>
                        <button
                            onClick={handleDownloadPDF}
                            className='bg-[#0981c5] font-semibold text-white py-3 px-3 rounded hover:bg-[#0a6ba5] transition'
                        >
                            Download CV
                        </button>

                    </div>


                    <div ref={resumeRef} className='flex justify-center items-start p-6'>

                        <div className="w-full grid md:grid-cols-3 bg-white shadow-lg border border-gray-200">

                            <div className="bg-[#113B67] text-white p-6 space-y-6">
                                <div className="flex flex-col items-center text-center">
                                    <img
                                        className="w-28 h-28 rounded-full border-4 border-white object-cover"
                                          
                                        src={
                                            seekerInfo?.profileImage
                                                ? `${baseUrl}/${seekerInfo.profileImage}`
                                                : caarchitaggarwal
                                        }
                                        alt="Profile"
                                    />


                                </div>

                                <div>
                                    <h3 className="text-lg sm:text-[30px] font-semibold mb-4">Contact Details</h3>
                                    <ul className="text-md space-y-1">
                                        {/* <li className='flex items-center gap-2'>
                                            <span><FaPhoneAlt /></span>
                                            <span>+1234567890</span>
                                        </li> */}
                                        <li className='flex items-center gap-2'>
                                            <span>
                                                <FaMobileAlt /></span>
                                            <span> {seekerInfo?.mobile}</span>
                                        </li>
                                        <li className='flex items-center gap-2'>
                                            <span><FaEnvelope /></span>
                                            <span>{seekerInfo?.user.email}</span>
                                        </li>
                                        <li className='flex items-center gap-2'>
                                            <span><FaGlobe /></span>
                                            <span>
                                                {[seekerLocation.city, seekerLocation.state, seekerLocation.country]
                                                    .filter(Boolean)
                                                    .join(', ') || 'Location not specified'}
                                            </span>
                                        </li>

                                        <li className='flex items-center gap-2'>
                                            <span><FaMapMarkerAlt /></span>
                                            <span>{seekerInfo?.streetAddress}</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className=" border border-white text-white text-center py-3 rounded mt-6">
                                    <p className="text-lg sm:text-[22px] leading-tight">{seekerInfo?.jobExperience}</p>
                                    <p className="text-sm font-semibold">OF EXPERIENCE</p>
                                </div>




                                <div>
                                    <h3 className="text-lg font-semibold mt-6 mb-1">Personal Details</h3>
                                    <hr className='mb-2' />
                                    <ul className="text-md space-y-1 mt-4">
                                        <li><strong>D.O.B:</strong> {seekerInfo?.dateofBirth}</li>

                                        <li><strong>Gender:</strong> {seekerInfo?.gender}</li>
                                        <li><strong>Marital Status:</strong> {seekerInfo?.maritalStatus}</li>
                                        <li><strong>Functional Area:</strong> {seekerInfo?.functionalArea.name}</li>
                                        <li><strong>Industry:</strong> {seekerInfo?.industry.name}</li>
                                        <li><strong>Current Level:</strong> {seekerInfo?.careerLevel.name}</li>
                                        <li><strong>Current Salary:</strong> {seekerInfo?.currentSalary}</li>
                                        <li><strong>Expected Salary:</strong> {seekerInfo?.expectedSalary}</li>


                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mt-6 mb-1">Key Skills</h3>
                                    <hr className='mb-2' />
                                    <div className="mt-2 space-y-2">
                                        {skills.filter(skill => skill.isActive).map(skill => (
                                            <div key={skill._id} className="rounded-full">
                                                <div className="h-full rounded-full">{skill.skillName}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>


                            {/* Main Content */}
                            <div className="md:col-span-2 space-y-6">
                                <h2 className='w-full text-lg sm:text-[35px] font-semibold bg-[#0981c5] flex justify-center items-center  text-white py-5'>Job Seeker</h2>
                                <section className='p-6'>
                                    <h2 className="text-xl sm:text-[30px] font-semibold border-b border-gray-400 pb-2">Objective</h2>

                                    <p className="text-sm text-gray-700 mt-2">
                                        {seekerInfo?.summary}

                                    </p>
                                </section>
                                {/* <section className='p-6'>
                                    <h2 className="text-xl sm:text-[30px] font-semibold border-b border-gray-400 pb-2">Experience</h2>
                                    <div className="mt-2 p-3">

                                        <h3 className="font-semibold text-lg sm:text-[20px]">UI UX Designer</h3>
                                        <p className="text-md text-gray-600 flex items-center gap-2">
                                            <span><FaMapMarkerAlt /></span>
                                            <span>Lahore - Pakistan</span>
                                        </p>
                                        <p className="text-md text-gray-600 flex items-center gap-2">
                                            <span><FaBuilding /></span>
                                            <span>Amoka Int</span>
                                        </p>
                                        <p className="text-md text-gray-600 flex items-center gap-2">
                                            <span><FaCalendarAlt /></span>
                                            <span>From 13 Dec, 2009 - 07 Feb, 2012</span>
                                        </p>
                                        <p className="text-md text-gray-700 mt-1 pl-5">This is just for testing experience details</p>
                                    </div>
                                </section> */}

                                <section className='p-6'>
                                    <h2 className="text-xl sm:text-[30px] font-semibold border-b border-gray-400 pb-2">Experience</h2>
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
                                </section>

                                {/* <section className='p-6'>
                                    <h2 className="text-xl sm:text-[30px] font-semibold border-b border-gray-400 pb-2">Education</h2>
                                    <div className="mt-2">
                                        <h3 className="font-semibold text-lg sm:text-[20px]">Matriculation/O-Level - Matric in Science</h3>
                                        <p className="text-md text-gray-600 pl-7">2005 - Hafizabad - Pakistan</p>
                                        <p className="text-md text-gray-600 flex items-center gap-2">
                                            <span>
                                            </span><FaSchool />
                                            <span>Govt School</span>
                                        </p>
                                        <p className="text-md text-gray-600 flex items-center gap-2">
                                            <span><FaBook /></span>
                                            <span> Biological Sciences, General Mathematics, Physics</span>
                                        </p>
                                    </div>
                                </section> */}

                                <section className='p-6'>
                                    <h2 className="text-xl sm:text-[30px] font-semibold border-b border-gray-400 pb-2">Education</h2>
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
                                </section>

                                <section className='p-6'>
                                    <h2 className="text-xl sm:text-[30px] font-semibold border-b border-gray-400 pb-4">Languages</h2>
                                    <div className="flex gap-4 mt-4">
                                        {languages.filter(lang => lang.isActive).map(lang => (
                                            <span key={lang._id} className="bg-[#113B67] text-white px-4 py-3 rounded-full text-md">
                                                {lang.languageName} ({lang.proficiency})
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )

}