import React from "react";
import Layout from "../seekerDashboard/partials/layout";

export default function PostAJob() {
    return (
        <Layout>
            <div className="w-full mx-auto p-6 bg-white border shadow-sm rounded-md space-y-6">
                <h2 className="text-lg sm:text-[30px] font-semibold text-gray-800">Job Details</h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Job Title"
                        className="w-full border rounded px-4 py-2 text-sm" />

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <div className="h-32 border rounded overflow-hidden">

                            <textarea className="w-full h-full p-2 text-sm resize-none" placeholder="Enter job description..." />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Benefits</label>
                        <div className="h-32 border rounded overflow-hidden">
                            <textarea className="w-full h-full p-2 text-sm resize-none" placeholder="Enter benefits..." />
                        </div>
                    </div>
                    <div className="grid">
                        <select className="border px-3 py-2 rounded text-sm">
                            <option>Select Required Skills</option>
                        </select>
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                        <select className="border px-3 py-2 rounded text-sm">
                            <option>India</option>
                        </select>
                        <select className="border px-3 py-2 rounded text-sm">
                            <option>Select State</option>
                        </select>
                        <select className="border px-3 py-2 rounded text-sm">
                            <option>Select City</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <input type="number" className="border px-3 py-2 rounded text-sm" placeholder="Salary From" />
                        <input type="number" className="border px-3 py-2 rounded text-sm" placeholder="Salary To" />
                    </div>


                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <select className="border px-3 py-2 rounded text-sm">
                            <option>Select Salary Currency</option>
                        </select>
                        <select className="border px-3 py-2 rounded text-sm">
                            <option>Select Salary Period</option>
                        </select>
                        <label className="flex items-center gap-2 text-sm">
                            Hide Salary? <input type="checkbox" className="ml-2" />
                        </label>
                    </div>


                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">

                        <select className="border px-3 py-2 rounded text-sm">
                            <option>Select Career Level</option>
                        </select>
                        <select className="border px-3 py-2 rounded text-sm">
                            <option>Select Functional Area</option>
                        </select>
                        <select className="border px-3 py-2 rounded text-sm">
                            <option>Select Job Type</option>
                        </select>
                        <select className="border px-3 py-2 rounded text-sm">
                            <option>Select Job Shift</option>
                        </select>
                        <select className="border px-3 py-2 rounded text-sm">
                            <option>Select number of Positions</option>
                        </select>
                        <input type="date" className="border px-3 py-2 rounded text-sm" placeholder="Job Expiry Date" />
                        <select className="border px-3 py-2 rounded text-sm">
                            <option>Select Required Degree Level</option>
                        </select>
                        <select className="border px-3 py-2 rounded text-sm">
                            <option>Select Required Experience</option>
                        </select>
                        <select className="border px-3 py-2 rounded text-sm">
                            <option>Is this External Job?</option>
                            <option>Yes</option>
                            <option>No</option>
                        </select>

                        <label className="flex items-center gap-2 text-sm">
                            Is Freelance? <input type="checkbox" className="ml-2" />
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            Is this External Job? <input type="checkbox" className="ml-2" />
                        </label>
                    </div>


                    <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold text-sm">
                        SUBMIT JOB
                    </button>
                </div>
            </div>
        </Layout>
    );
}
