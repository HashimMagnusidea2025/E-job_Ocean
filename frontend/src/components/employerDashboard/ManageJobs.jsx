import React, { useState } from "react";
import { FaMapMarkerAlt, FaEdit, FaTrash, FaUsers } from "react-icons/fa";

const jobData = [
    {
        id: 1,
        type: "Full Time/Permanent",
        title: "IOS Developer",
        salary: "60000 - 90000/Monthly",
        location: "Atlanta",
        date: "Mar 07, 2025",
        candidates: 1,
        status: "active",
    },
    {
        id: 2,
        type: "Full Time/Permanent",
        title: "Project Manager",
        salary: "USD3500 - USD5000/Monthly",
        location: "Kaneohe Station",
        date: "Mar 07, 2025",
        candidates: 1,
        status: "active",
    },
    {
        id: 3,
        type: "Contract",
        title: "Full Stack Developer...",
        salary: "USD100000 - USD200000/Monthly",
        location: "Bessemer",
        date: "Mar 07, 2025",
        candidates: 1,
        status: "expired",
    },
    {
        id: 4,
        type: "Contract",
        title: "Graphic Designer Req...",
        salary: "USD100000 - USD200000/Monthly",
        location: "Bessemer",
        date: "Mar 07, 2025",
        candidates: 1,
        status: "expired",
    },
    {
        id: 3,
        type: "Full Time/Permanent",
        title: "Project Manager",
        salary: "USD3500 - USD5000/Monthly",
        location: "Kaneohe Station",
        date: "Mar 07, 2025",
        candidates: 1,
        status: "active",
    },
    {
        id: 5,
        type: "Contract",
        title: "Graphic Designer Req...",
        salary: "USD100000 - USD200000/Monthly",
        location: "Bessemer",
        date: "Mar 07, 2025",
        candidates: 1,
        status: "expired",
    },
];

import Layout from "../seekerDashboard/partials/layout";
export default function ManageJobs() {
    const [activeTab, setActiveTab] = useState("active");

    const filteredJobs = jobData.filter((job) => job.status === activeTab);

    return (
        <Layout>
            <div className="w-full mx-auto px-4 py-6">

                <div className="flex border-b mb-6">
                    <button
                        onClick={() => setActiveTab("active")}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === "active" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                            }`}
                    >
                        Active Jobs
                    </button>
                    <button
                        onClick={() => setActiveTab("expired")}
                        className={`ml-4 px-4 py-2 text-sm font-medium ${activeTab === "expired" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                            }`}
                    >
                        Expired Jobs
                    </button>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredJobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white border rounded-lg shadow-sm py-8 px-4 space-y-2 flex flex-col justify-between"
                        >
                            <p className="text-xs text-gray-600">{job.type}</p>
                            <h3 className="text-lg sm:text-[20px] font-semibold">{job.title}</h3>
                            <p className="text-sm font-medium text-gray-700">Salary: {job.salary}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <FaMapMarkerAlt className="text-blue-500" />
                                {job.location} <span className="ml-1">{job.date}</span>
                            </p>


                            <div className="flex justify-start items-center gap-2 mt-3">
                                <button className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1">
                                    <FaUsers /> Candidates <span className="ml-1 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs">{job.candidates}</span>
                                </button>
                                <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded">
                                    <FaEdit />
                                </button>
                                <button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
