import React, { useState } from "react";
import { FaMapMarkerAlt, FaMoneyBill, FaUserAlt, FaBuilding, FaGraduationCap } from "react-icons/fa";

import depositphotos from '../../../../media/jpg/depositphotos.jpg'
const tabs = ["Job Vacancies", "CA Articleship", "Industrial Training", "Internships"];

const jobData = [
    {
        title: "Vacancy for Experienced CAs",
        company: "Fast-Growing Consulting Firm",
        domain: "Assurance & Advisory",
        location: "Delhi",
        salary: "25–30 LPA",
        experience: "5+ Years",
    },
    {
        title: "Vacancy for CA/CS & Graduates",
        company: "Renowned CA Firm (Bangalore)",
        domain: "Multiple Roles",
        location: "Bangalore",
        salary: "As per market standard",
        experience: "0–3 Years",
    },
    {
        title: "Vacancy for CAs/CA Dropped/Graduates",
        company: "Brahmayya & Co.",
        domain: "Statutory Audit",
        location: "Gurgaon",
        salary: "Based on experience",
        experience: "0–4 Years",
    },
    {
        title: "CAs, Semi-Qualified CA Dropped & Graduates",
        company: "Arun K. Agarwal & Assoc",
        domain: "Audit & Taxation",
        location: "South Delhi",
        salary: "As per market standard",
        experience: "0–2 Years",
    },
];

export default function OpportunitiesSection() {
    const [activeTab, setActiveTab] = useState("Job Vacancies");

    return (
        <section className="container mx-auto bg-white">
            <div className="py-20 px-6 w-full ">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
                    Job/<span className="text-[#339ca0]"> Articleship Opportunities</span>
                </h2>

                <div className="flex justify-center gap-4 mb-10 flex-wrap">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`tab-btn px-4 py-2 rounded-md border ${activeTab === tab
                                ? "bg-gray-800 text-black shadow-md"
                                : "text-black border-gray-300"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 reletive">
                    {jobData.map((job, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col justify-between relative"
                        >
                            {/* Top badge image */}
                            <div className="absolute -top-4 left-4">
                                <img
                                    src={depositphotos}
                                    alt="job-tag"
                                    className="w-16"
                                />
                            </div>

                            <h3 className="text-md font-semibold mt-6">{job.title}</h3>
                            <p className="text-sm text-gray-600">{job.company}</p>

                            <div className="flex items-center gap-2 text-sm mt-2">
                                <FaBuilding className="text-gray-500" />
                                <span>{job.domain}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm mt-1">
                                <FaMapMarkerAlt className="text-gray-500" />
                                <span>{job.location}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm mt-1">
                                <FaMoneyBill className="text-gray-500" />
                                <span>{job.salary}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm mt-1 mb-3">
                                <FaUserAlt className="text-gray-500" />
                                <span>{job.experience}</span>
                            </div>

                            <button className="mt-auto bg-gradient-to-r from-[#339ca0] to-black text-white  py-2 rounded hover:opacity-90 transition">
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
