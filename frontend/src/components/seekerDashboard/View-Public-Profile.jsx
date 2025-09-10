import caarchitaggarwal from '../../media/png/ca-archit-aggarwal.png';
import vector from '../../media/jpg/vector.jpg';
import vector2 from '../../media/jpg/vector2.jpg';
import w from '../../media/jpg/1.jpg';

import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaMobileAlt, FaPen, FaTimes, FaDownload, FaPencilAlt, FaBuilding, FaCalendarAlt, FaPlus, FaEdit, FaGraduationCap, FaSchool } from "react-icons/fa";
import Navbar from '../layout/navbar/navbar';

import { FaCheckCircle, FaUserTie, FaMars, FaBriefcase, FaMoneyBillWave, FaMoneyCheckAlt } from 'react-icons/fa';
import { MdWorkOutline, MdOutlineNotInterested } from 'react-icons/md';
import { BsPersonVcard } from 'react-icons/bs';

const ViewPublicProfile = () => {
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
                        <div className=' space-y-1'>
                            <h2 className="text-xl sm:text-[25px] font-bold">
                                Job Seeker<span className='text-sm text-gray-500'> (Engineering and IT)</span></h2>

                            <p className="text-md text-black ">Bagaha, Bihar, India</p>
                            <p className="text-sm text-black">Member Since, Sep 19, 2018</p>
                        </div>
                    </div>


                    <div className="py-6 px-4">
                        <div className='bg-[#f1f5fd] py-10 sm:py-14 px-8'>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                                📄 Download CV
                            </button>
                        </div>


                        <div className="mt-6">
                            <h3 className="text-lg sm:text-[30px] font-semibold mb-2">About me</h3>
                            <p className="text-gray-700 text-md">
                                Hello! I'm Sharjeel, a Passionate UI/UX Designer and Frontend Developer with a strong
                                technical background. I bring innovation and attention to detail to create visually
                                stunning, user-centric designs. Proactive and disciplined, I excel in ensuring maximum
                                accessibility and elevating customer experiences throughout the development process.
                                Let’s redefine digital interactions together.
                            </p>
                        </div>
                        <hr className='mt-4' />
                        {/* Skills */}
                        <div className="mt-6 ">
                            <h3 className="text-lg sm:text-[25px] font-semibold mb-2">Skills</h3>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { name: "Adobe Photoshop", exp: "14 Years" },
                                    { name: "Adobe Illustrator", exp: "9 Years" },
                                    { name: "HTML", exp: "14 Years" },
                                    { name: "CSS", exp: "13 Years" },
                                    { name: "Adaptability skills", exp: "8 Years" },
                                ].map((skill, i) => (
                                    <div
                                        key={i}
                                        className="px-4  py-2 border bg-gray-100  rounded-md shadow-sm"
                                    >
                                        <strong className=' text-[16px]'>{skill.name}</strong> <br />
                                        <span className="text-gray-600 text-[14px]">{skill.exp}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 px-4">
                        <h3 className="text-lg sm:text-[25px] font-semibold mb-2">Languages</h3>
                        <div className="flex flex-wrap gap-4">
                            {[
                                { name: "Urdu", exp: "Expert" },
                                { name: "English", exp: "Expert" },

                            ].map((skill, i) => (
                                <div
                                    key={i}
                                    className="px-10  py-2 border bg-gray-100  rounded-md shadow-sm">
                                    <strong className=' text-[16px]'>{skill.name}</strong> <br />
                                    <span className="text-gray-600 text-[14px]">{skill.exp}</span>
                                </div>
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


                            <div className="relative pl-6">
                                <div className="absolute left-0 top-2 w-3 h-3 bg-gray-300 rounded-full"></div>


                                <h3 className="text-md sm:text-[20px] font-bold text-gray-800">UI UX Designer</h3>

                                <div className="flex items-center text-md text-gray-600 mt-1 gap-2 ">
                                    <FaMapMarkerAlt />
                                    <span>Lahore - Pakistan</span>
                                </div>

                                <div className="flex items-center text-md text-gray-600 mt-1 gap-2">
                                    <FaBuilding />
                                    <span>Amoka Int</span>
                                </div>

                                <div className="flex items-center text-md text-gray-600 mt-1 gap-2">
                                    <FaCalendarAlt />
                                    <span>
                                        From <strong>13 Dec, 2009</strong> - <strong>07 Feb, 2012</strong>
                                    </span>
                                </div>

                                <p className="text-md text-gray-700 mt-2">
                                    This is just for testing experience details
                                </p>
                            </div>



                        </div>
                    </div>

                    {/* Education */}
                    <div className="pt-10">
                        <div className="bg-white rounded-lg shadow  border-gray-200 p-6 w-full relative">

                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl sm:text-[32px] font-semibold text-gray-800">Education</h2>

                            </div>


                            <div className="relative pl-6">
                                <div className="absolute left-0 top-2 w-3 h-3 bg-gray-300 rounded-full"></div>


                                <h3 className="text-md sm:text-[20px] font-bold text-gray-800">Matriculation/O-Level - Matric in Science</h3>

                                <div className="flex items-center text-md text-gray-600 mt-1 gap-2 ">

                                    <span>2005 - Hafizabad - Pakistan</span>
                                </div>

                                <div className="flex items-center text-md text-gray-600 mt-1 gap-2">
                                    <FaGraduationCap />
                                    <span>Matric</span>
                                </div>

                                <div className="flex items-center text-md text-gray-600 mt-1 gap-2">
                                    <FaMapMarkerAlt />
                                    <span>
                                        Hafizabad - Pakistan
                                    </span>
                                </div>

                                <div className="flex items-center text-md text-gray-600 mt-1 gap-2">
                                    <FaSchool />
                                    <span>
                                        Govt School
                                    </span>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>

                {/* contact information */}

                <div className="space-y-8">
                    <div className="bg-white shadow-md rounded-md p-6">
                        <h3 className="text-lg sm:text-[20px] font-bold text-blue-600 mb-4">Contact Information</h3>
                        <ul className="space-y-4 text-md text-gray-700">
                            <li>
                                <FaPhone className="inline mr-2" /> +1234567890
                            </li>
                            <li>
                                <FaMobileAlt className="inline mr-2" /> +1234564798
                            </li>
                            <li>
                                <FaEnvelope className="inline mr-2" /> seeker@jobsportal.com
                            </li>
                            <li>
                                <FaMapMarkerAlt className="inline mr-2" /> Dummy Street Address 123 USA
                            </li>
                        </ul>
                    </div>

                    <div className="w-full mx-auto bg-white shadow-lg rounded-xl p-6 space-y-4 border">
                        <h2 className="text-xl font-semibold text-blue-600">Candidate Details</h2>

                        <div className="grid grid-cols-2 gap-7 text-sm text-gray-700">
                            <div className="flex justify-center flex-col gap-2 space-x-2 items-center">
                                <span> <FaCheckCircle className="text-blue-500 text-[27px]" /></span>
                                <span>Verified:</span>
                                <span>Yes</span>


                            </div>
                            <div className="flex justify-center flex-col gap-2 space-x-2 items-center">
                                <span><MdOutlineNotInterested className="text-red-500 text-[27px]" /></span>
                                <span>Ready for Hire:</span>
                                <span>No</span>


                            </div>

                            <div className="flex justify-center flex-col gap-2 space-x-2 items-center">
                                <span> <FaCalendarAlt className="text-blue-500 text-[27px]" /></span>
                                <span>Age:</span>
                                <span>36 Years</span>


                            </div>
                            <div className="flex justify-center flex-col gap-2 space-x-2 items-center">
                                <span><FaMars className="text-blue-500 text-[27px]" /></span>
                                <span>Gender:</span>
                                <span>Male</span>


                            </div>

                            <div className="flex justify-center flex-col gap-2 space-x-2 items-center">
                                <span><BsPersonVcard className="text-blue-500 text-[27px]" /></span>
                                <span>Marital Status:</span>
                                <span>Single</span>


                            </div>
                            <div className="flex justify-center flex-col gap-2 space-x-2 items-center">
                                <span><FaBriefcase className="text-blue-500 text-[27px]" /></span>
                                <span>Experience:</span>
                                <span>6 years</span>


                            </div>

                            <div className="flex justify-center flex-col gap-2 space-x-2 items-center" >
                                <span> <MdWorkOutline className="text-blue-500 text-[27px]" /></span>
                                <span>Career Level:</span>
                                <span>Experienced Professional</span>


                            </div>
                            <div className="flex justify-center flex-col gap-2 space-x-2 items-center">
                                <span> <FaMapMarkerAlt className="text-blue-500 text-[27px]" /></span>
                                <span>Location:</span>
                                <span>Bagaha, Bihar, India</span>


                            </div>

                            <div className="flex justify-center flex-col gap-2 space-x-2 items-center">
                                <span> <FaMoneyBillWave className="text-blue-500 text-[27px]" /></span>
                                <span>Current Salary:</span>
                                <span> 60000</span>


                            </div>
                            <div className="flex justify-center flex-col gap-2 space-x-2 items-center">
                                <span><FaMoneyCheckAlt className="text-blue-500 text-[27px]" /></span>
                                <span>Expected Salary:</span>
                                <span>100000</span>


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
